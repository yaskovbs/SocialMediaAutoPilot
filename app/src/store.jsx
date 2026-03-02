import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, registerWithEmail, loginWithEmail, logout } from './lib/firebase';

const AppContext = createContext();
const AuthContext = createContext();

const USER_PHOTO = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_67d164238787c026aecaa666/0a279b84a_photo_2026-02-22_20-31-34.jpg";

const DEMO_VIDEOS = [
    { id: '1', youtube_id: 'abc123', title: 'The Terminal List Dark Wolf Season 1 Episode 4 Full TV Show Recap', published_at: '2026-03-01T10:00:00Z', video_type: 'video', tiktok_status: 'pending', instagram_status: 'pending', facebook_status: 'pending', x_status: 'pending', telegram_status: 'pending', pinterest_status: 'pending', dailymotion_status: 'pending' },
    { id: '2', youtube_id: 'def456', title: 'Subscribe & Follow for More Adventures!', published_at: '2026-03-01T08:00:00Z', video_type: 'short', tiktok_status: 'posted', instagram_status: 'posted', facebook_status: 'pending', x_status: 'failed', telegram_status: 'pending', pinterest_status: 'pending', dailymotion_status: 'posted' },
    { id: '3', youtube_id: 'ghi789', title: "Navy SEALs' Difficult Transition to Civilian Life", published_at: '2026-03-01T06:00:00Z', video_type: 'short', tiktok_status: 'posted', instagram_status: 'posted', facebook_status: 'posted', x_status: 'posted', telegram_status: 'posted', pinterest_status: 'posted', dailymotion_status: 'posted' },
    { id: '4', youtube_id: 'jkl012', title: 'Nerve (2016) Recap Movie - High-Stakes Dares for Big Money', published_at: '2024-07-19T12:00:00Z', video_type: 'video', tiktok_status: 'posted', instagram_status: 'posted', facebook_status: 'posted', x_status: 'posted', telegram_status: 'posted', pinterest_status: 'posted', dailymotion_status: 'posted' },
    { id: '5', youtube_id: 'mno345', title: 'Atlas: The Machines Have Turned Against Humanity', published_at: '2024-07-18T14:00:00Z', video_type: 'video', tiktok_status: 'posted', instagram_status: 'pending', facebook_status: 'posted', x_status: 'pending', telegram_status: 'posted', pinterest_status: 'pending', dailymotion_status: 'posted' },
    { id: '6', youtube_id: 'pqr678', title: 'Atlas (2024) Recap Movie - What If Machines Turned Against Us?', published_at: '2024-07-18T10:00:00Z', video_type: 'video', tiktok_status: 'posted', instagram_status: 'posted', facebook_status: 'posted', x_status: 'failed', telegram_status: 'posted', pinterest_status: 'posted', dailymotion_status: 'posted' },
    { id: '7', youtube_id: 'stu901', title: 'The Bikeriders (2024) Recap Movie', published_at: '2024-07-17T08:00:00Z', video_type: 'video', tiktok_status: 'pending', instagram_status: 'pending', facebook_status: 'pending', x_status: 'pending', telegram_status: 'pending', pinterest_status: 'pending', dailymotion_status: 'pending' },
    { id: '8', youtube_id: 'vwx234', title: "Star Wars: The Acolyte Season 1 Recap - Everything You Need To Know", published_at: '2024-07-21T11:00:00Z', video_type: 'video', tiktok_status: 'posted', instagram_status: 'posted', facebook_status: 'posted', x_status: 'posted', telegram_status: 'pending', pinterest_status: 'pending', dailymotion_status: 'pending' },
    { id: '9', youtube_id: 'yza567', title: 'The AI Revolution: Humanity\'s Greatest Battle', published_at: '2024-07-19T16:00:00Z', video_type: 'short', tiktok_status: 'failed', instagram_status: 'failed', facebook_status: 'failed', x_status: 'failed', telegram_status: 'pending', pinterest_status: 'pending', dailymotion_status: 'pending' },
    { id: '10', youtube_id: 'bcd890', title: 'The Brave Biker: Benny\'s Stand for Honor and Brotherhood', published_at: '2024-07-19T14:00:00Z', video_type: 'short', tiktok_status: 'posted', instagram_status: 'pending', facebook_status: 'posted', x_status: 'pending', telegram_status: 'posted', pinterest_status: 'pending', dailymotion_status: 'pending' },
    { id: '11', youtube_id: 'efg123', title: 'The Boys Season 4 Episode 1+2 Recap TV Show', published_at: '2024-07-22T09:00:00Z', video_type: 'video', tiktok_status: 'pending', instagram_status: 'pending', facebook_status: 'pending', x_status: 'pending', telegram_status: 'pending', pinterest_status: 'pending', dailymotion_status: 'pending' },
    { id: '12', youtube_id: 'hij456', title: 'The Hidden Truth of the Jedi and Sith', published_at: '2024-07-21T16:00:00Z', video_type: 'short', tiktok_status: 'pending', instagram_status: 'pending', facebook_status: 'pending', x_status: 'pending', telegram_status: 'pending', pinterest_status: 'pending', dailymotion_status: 'pending' },
];

const PLATFORMS = ['tiktok', 'instagram', 'facebook', 'x', 'telegram', 'pinterest', 'dailymotion'];

const DEFAULT_SETTINGS = {
    youtube_channel_id: '',    youtube_api_key: '',    youtube_channel_name: 'Movies & TV Show Recap',
    tiktok_connected: true,
    instagram_connected: true,
    facebook_connected: true,
    x_connected: true,
    telegram_connected: true,
    pinterest_connected: true,
    dailymotion_connected: true,
    include_shorts: true,
    last_sync: '2026-03-01T17:00:00Z',
    total_synced: 843,
    getlate_api_key: '',
};

const DEFAULT_AUTOMATION = {
    auto_post_new: true,
    auto_post_old: true,
    retry_on_fail: true,
    interval_hours: 3,
    max_per_day: 20,
    post_order: 'oldest_first',
    notifications: false,
    ai_captions: false,
    caption_style: 'engaging',
    caption_lang: 'he_en',
    include_hashtags: true,
    include_emojis: true,
};

const DEFAULT_SCHEDULE = {
    enabled: true,
    frequency: 'daily',
    posts_per_day: 10,
    active_days: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
    start_time: '00:00',
    double_post: true,
    max_in_queue: 50,
    stop_weekend: false,
};

function loadFromStorage(key, fallback) {
    try {
        const stored = localStorage.getItem(`autopost_${key}`);
        return stored ? JSON.parse(stored) : fallback;
    } catch { return fallback; }
}

function saveToStorage(key, value) {
    localStorage.setItem(`autopost_${key}`, JSON.stringify(value));
}

const syncYouTube = async (channelId, apiKey) => {
    if (!channelId || !apiKey) return { success: false, error: 'Missing channel ID or API key' };

    try {
        // Step 1: Get channel uploads playlist ID
        const channelRes = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`);
        const channelData = await channelRes.json();
        if (channelData.error) throw channelData.error;
        
        const uploadsId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
        if (!uploadsId) throw new Error('No uploads playlist found');

        // Step 2: Fetch videos from uploads playlist (newest first, reverse for oldest first)
        const videosRes = await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsId}&maxResults=50&key=${apiKey}`);
        const videosData = await videosRes.json();
        if (videosData.error) throw videosData.error;

        const newVideos = videosData.items
            .map(item => {
                const vid = item.snippet;
                const videoId = vid.resourceId.videoId;
                return {
                    id: videoId,
                    youtube_id: videoId,
                    title: vid.title,
                    description: vid.description,
                    thumbnail_url: vid.thumbnails.medium.url,
                    youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
                    published_at: vid.publishedAt,
                    video_type: vid.title.toLowerCase().includes('short') ? 'short' : 'video',
                    // Init statuses
                    ...PLATFORMS.reduce((acc, p) => ({ ...acc, [`${p}_status`]: 'pending' }), {})
                };
            })
            .sort((a, b) => new Date(a.published_at) - new Date(b.published_at)) // oldest first
            .slice(0, 20); // Limit to 20 for demo

        return { success: true, count: newVideos.length, videos: newVideos };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        user,
        loading,
        signInWithGoogle: () => signInWithGoogle().catch(console.error),
        registerWithEmail: (email, password) => registerWithEmail(email, password).catch(console.error),
        loginWithEmail: (email, password) => loginWithEmail(email, password).catch(console.error),
        logout: () => logout().catch(console.error),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}

export function AppProvider({ children }) {
    const [videos, setVideos] = useState(() => loadFromStorage('videos', DEMO_VIDEOS));
    const [settings, setSettings] = useState(() => loadFromStorage('settings', DEFAULT_SETTINGS));
    const [automation, setAutomation] = useState(() => loadFromStorage('automation', DEFAULT_AUTOMATION));
    const [schedule, setSchedule] = useState(() => loadFromStorage('schedule', DEFAULT_SCHEDULE));

    useEffect(() => { saveToStorage('videos', videos); }, [videos]);
    useEffect(() => { saveToStorage('settings', settings); }, [settings]);
    useEffect(() => { saveToStorage('automation', automation); }, [automation]);
    useEffect(() => { saveToStorage('schedule', schedule); }, [schedule]);

    const updateVideoStatus = (videoId, platform, status) => {
        setVideos(prev => prev.map(v =>
            v.id === videoId ? { ...v, [`${platform}_status`]: status } : v
        ));
    };

    const updateSettings = (updates) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    const updateAutomation = (updates) => {
        setAutomation(prev => ({ ...prev, ...updates }));
    };

    const updateSchedule = (updates) => {
        setSchedule(prev => ({ ...prev, ...updates }));
    };

    const syncVideos = (newVideos) => {
        setVideos(prev => {
            const existingIds = new Set(prev.map(v => v.youtube_id));
            const merged = [
                ...prev.filter(v => !newVideos.some(nv => nv.youtube_id === v.youtube_id)),
                ...newVideos
            ].sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
            saveToStorage('videos', merged);
            return merged;
        });
    };

    const value = {
        videos,
        settings,
        automation,
        schedule,
        updateVideoStatus,
        updateSettings,
        updateAutomation,
        updateSchedule,
        syncVideos,
        syncYouTube,
        userPhoto: USER_PHOTO,
        platforms: PLATFORMS,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    return useContext(AppContext);
}
