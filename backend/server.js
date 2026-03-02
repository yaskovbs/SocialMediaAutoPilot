require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');
const cron = require('node-cron');
const { Queue } = require('bullmq');
const Redis = require('ioredis');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('combined'));

// Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  clientId: process.env.FIREBASE_CLIENT_ID,
  authUri: process.env.FIREBASE_AUTH_URI,
  tokenUri: process.env.FIREBASE_TOKEN_URI,
  authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

// Redis for BullMQ
const redisConnection = new Redis(process.env.REDIS_URL, { lazyConnect: true });
const postingQueue = new Queue('social-posts', { connection: redisConnection });

// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.get('/health', (req, res) => res.json({ status: 'OK', queue: postingQueue.name }));

app.post('/sync-youtube', authMiddleware, async (req, res) => {
  const { channelId } = req.body;
  const { YOUTUBE_API_KEY } = process.env;
  try {
    // Same as frontend syncYouTube but save to Firestore
    const channelRes = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels`, {
      params: { part: 'contentDetails', id: channelId, key: YOUTUBE_API_KEY }
    });
    const uploadsId = channelRes.data.items[0].contentDetails.relatedPlaylists.uploads;
    const videosRes = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems`, {
      params: { part: 'snippet', playlistId: uploadsId, maxResults: 50, key: YOUTUBE_API_KEY }
    });
    const videos = videosRes.data.items.map(item => ({
      youtube_id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      // ... full video data
      status: 'pending',
      userId: req.user.uid
    })).sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
    
    // Save to Firestore
    const batch = db.batch();
    videos.forEach(v => {
      const docRef = db.collection('videos').doc(v.youtube_id);
      batch.set(docRef, v);
    });
    await batch.commit();
    res.json({ success: true, count: videos.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/post-to-social', authMiddleware, async (req, res) => {
  const { videoId, platforms } = req.body;
  for (const platform of platforms) {
    await postingQueue.add('post', { videoId, platform, userId: req.user.uid });
  }
  res.json({ queued: platforms.length });
});

// Queue processor
postingQueue.process('post', async (job) => {
  const { videoId, platform, userId } = job.data;
  const { GETLATE_API_KEY } = process.env;
  // Fetch video from Firestore
  const videoDoc = await db.collection('videos').doc(videoId).get();
  const video = videoDoc.data();
  // Post via GetLate API
  await axios.post('https://getlate.dev/api/v1/posts', {
    text: video.title,
    platforms: [platform],
    mediaUrls: [`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`],
  }, {
    headers: { Authorization: `Bearer ${GETLATE_API_KEY}` }
  });
  // Update status
  await db.collection('videos').doc(videoId).update({ [`${platform}_status`]: 'posted' });
});

// Cron: Check new videos every hour
cron.schedule('0 * * * *', async () => {
  // Poll users' channels, add to queue
  console.log('Checking for new YouTube videos...');
});

// Start server
app.listen(PORT, () => console.log(`Backend server on http://localhost:${PORT}`));
