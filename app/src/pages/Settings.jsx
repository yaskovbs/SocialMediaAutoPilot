import { useState } from 'react'
import { useApp } from '../store'
import { RefreshCw, Check, AlertCircle, Youtube, Zap, Link2 } from 'lucide-react'

const PLATFORMS = [
    { id: 'tiktok', label: 'TikTok', color: '#010101' },
    { id: 'instagram', label: 'Instagram', color: '#e1306c' },
    { id: 'facebook', label: 'Facebook', color: '#1877f2' },
    { id: 'x', label: 'X (Twitter)', color: '#a0a0b5' },
    { id: 'telegram', label: 'Telegram', color: '#26a5e4' },
    { id: 'pinterest', label: 'Pinterest', color: '#e60023' },
    { id: 'dailymotion', label: 'Dailymotion', color: '#0066dc' },
]

export default function Settings() {
    const { settings, updateSettings, syncVideos } = useApp()
    const [channelId, setChannelId] = useState(settings.youtube_channel_id || '')
    const [apiKey, setApiKey] = useState(settings.youtube_api_key || '')
    const [isSyncing, setIsSyncing] = useState(false)
    const [syncResult, setSyncResult] = useState(null)

    const handleSync = async () => {
        setIsSyncing(true)
        setSyncResult(null)
        const result = await syncYouTube(channelId, apiKey)
        setIsSyncing(false)
        
        if (result.success) {
            syncVideos(result.videos) // Add/update videos in store
            updateSettings({ 
                youtube_channel_id: channelId, 
                youtube_api_key: apiKey,
                youtube_channel_name: result.videos[0]?.title.split(' - ')[0] || 'Your Channel',
                last_sync: new Date().toISOString(),
                total_synced: result.count 
            })
            setSyncResult(result)
        } else {
            setSyncResult({ success: false, error: result.error })
        }
    }

    return (
        <div>
            <div className="page-header">
                <h1>הגדרות</h1>
                <p>חיבור ערוץ YouTube ופלטפורמות</p>
            </div>

            {/* YouTube Channel */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, background: 'var(--accent-red-soft)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Youtube size={20} color="var(--accent-red)" />
                    </div>
                    <div>
                        <div className="card-title">ערוץ YouTube</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {settings.youtube_channel_name || 'לא מחובר'}
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">YouTube API Key (V3)</label>
                    <input
                        className="form-input"
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        placeholder="AIzaSy... (קבל מ-https://console.developers.google.com)"
                        dir="ltr"
                        type="password"
                    />
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                        צור API Key חינם: <a href="https://console.developers.google.com/apis/library/youtube.googleapis.com" target="_blank">Google Console → YouTube Data API v3</a>
                    </p>
                </div>

                <div className="form-group">
                    <label className="form-label">Channel ID</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            className="form-input"
                            value={channelId}
                            onChange={e => setChannelId(e.target.value)}
                            placeholder="UC... (הזן Channel ID של הערוץ)"
                            dir="ltr"
                            style={{ flex: 1 }}
                        />
                        <button
                            className="btn btn-red"
                            onClick={handleSync}
                            disabled={isSyncing || !channelId.trim() || !apiKey.trim()}
                            style={{ opacity: isSyncing ? 0.7 : 1 }}
                        >
                            <RefreshCw size={14} className={isSyncing ? 'spin' : ''} />
                            {isSyncing ? 'מסנכרן...' : 'סנכרן ערוץ'}
                        </button>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                        למצוא Channel ID: youtube.com/@yourchannel → About → Channel ID
                    </p>
                </div>

                {syncResult && (
                    <div className={`alert ${syncResult.success ? 'alert-success' : 'alert-error'}`}>
                        {syncResult.success ? <Check size={16} /> : <AlertCircle size={16} />}
                        {syncResult.success
                            ? `נמצאו ${syncResult.total} סרטונים, ${syncResult.count} חדשים נוספו`
                            : 'לא נמצאו סרטונים. בדוק את ה-Channel ID'}
                    </div>
                )}

                {settings.last_sync && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        סנכרון אחרון: {new Date(settings.last_sync).toLocaleString('he-IL')}
                    </p>
                )}
            </div>

            {/* Late API Integration */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, background: 'var(--blue-soft)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Link2 size={20} color="var(--blue)" />
                    </div>
                    <div>
                        <div className="card-title">Late API (getlate.dev)</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            API אחד לכל הפלטפורמות - פרסום, אנליטיקס ועוד
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">API Key</label>
                    <input
                        className="form-input"
                        value={settings.getlate_api_key || ''}
                        onChange={e => updateSettings({ getlate_api_key: e.target.value })}
                        placeholder="sk_live_..."
                        dir="ltr"
                        type="password"
                    />
                </div>

                <a
                    href="https://getlate.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="getlate-badge"
                    style={{ marginTop: 8 }}
                >
                    <Zap size={12} />
                    קבל API Key מ-getlate.dev →
                </a>
            </div>

            {/* Platform Connections */}
            <div className="card">
                <div className="card-title" style={{ marginBottom: 16 }}>חיבור פלטפורמות</div>

                <div className="alert alert-tip">
                    <Zap size={16} />
                    <span>חבר חשבונות דרך Late API - OAuth פשוט ומהיר, ללא צורך ביצירת אפליקציות מפתח</span>
                </div>

                {PLATFORMS.map(platform => {
                    const isConnected = settings[`${platform.id}_connected`]
                    return (
                        <div key={platform.id} className={`platform-card ${isConnected ? 'connected' : ''}`}>
                            <div className="platform-card-info">
                                <div className="platform-color-dot" style={{ background: platform.color }} />
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 500 }}>{platform.label}</div>
                                    <div style={{ fontSize: 12, color: isConnected ? 'var(--green)' : 'var(--text-muted)' }}>
                                        {isConnected ? '✓ מחובר' : 'לא מחובר'}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`toggle ${isConnected ? 'active' : ''}`}
                                onClick={() => updateSettings({ [`${platform.id}_connected`]: !isConnected })}
                            />
                        </div>
                    )
                })}
            </div>

            {/* Post Settings */}
            <div className="card">
                <div className="card-title" style={{ marginBottom: 16 }}>הגדרות פרסום</div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>כלול Shorts</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>פרסם גם סרטונים קצרים</div>
                    </div>
                    <div
                        className={`toggle ${settings.include_shorts ? 'active' : ''}`}
                        onClick={() => updateSettings({ include_shorts: !settings.include_shorts })}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>סדר פרסום</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>מהישן לחדש</div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--green)', background: 'var(--green-soft)', padding: '4px 10px', borderRadius: 'var(--radius-sm)' }}>פעיל</span>
                </div>
            </div>
        </div>
    )
}
