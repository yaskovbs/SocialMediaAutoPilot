import { useApp } from '../store'
import { Link } from 'react-router-dom'
import {
    Video, CheckCircle2, Clock, Wifi, ArrowLeft, Zap,
    Sparkles, RefreshCw
} from 'lucide-react'

const PLATFORMS = ['tiktok', 'instagram', 'facebook', 'x', 'telegram', 'pinterest', 'dailymotion']
const PLATFORM_LABELS = { tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', x: 'X', telegram: 'Telegram', pinterest: 'Pinterest', dailymotion: 'Dailymotion' }

export default function Dashboard() {
    const { videos, settings, automation } = useApp()

    const totalVideos = videos.length
    const totalPosted = videos.filter(v => PLATFORMS.every(p => v[`${p}_status`] === 'posted')).length
    const pendingVideos = videos.filter(v => PLATFORMS.some(p => v[`${p}_status`] === 'pending'))
    const shortsCount = videos.filter(v => v.video_type === 'short').length
    const connectedPlatforms = PLATFORMS.filter(p => settings[`${p}_connected`]).length

    const nextInQueue = [...pendingVideos]
        .sort((a, b) => new Date(a.published_at) - new Date(b.published_at))
        .slice(0, 3)

    // Calculate coverage percentage
    const totalSlots = totalVideos * PLATFORMS.length
    const postedSlots = videos.reduce((acc, v) => acc + PLATFORMS.filter(p => v[`${p}_status`] === 'posted').length, 0)
    const coveragePercent = totalSlots > 0 ? Math.round((postedSlots / totalSlots) * 100) : 0

    const stats = [
        { label: 'סרטונים', value: totalVideos - shortsCount, icon: Video, color: 'var(--accent-red)', bg: 'var(--accent-red-soft)' },
        { label: 'שורטס', value: shortsCount, icon: Zap, color: 'var(--yellow)', bg: 'var(--yellow-soft)' },
        { label: 'פורסמו', value: totalPosted, icon: CheckCircle2, color: 'var(--green)', bg: 'var(--green-soft)' },
        { label: '% כיסוי', value: `${coveragePercent}%`, icon: Wifi, color: 'var(--blue)', bg: 'var(--blue-soft)' },
    ]

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1>ברוך הבא, ליאב!</h1>
                    <p>הנה סיכום הפעילות שלך ב-AutoPost</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" title="סנכרן עכשיו">
                        <RefreshCw size={14} />
                        סנכרן עכשיו
                    </button>
                </div>
            </div>

            {/* AI Tip */}
            <div className="ai-tip">
                <div className="ai-tip-header">
                    <Sparkles size={16} />
                    טיפ AI יומי
                </div>
                <p>פרסם באופן עקבי בפחות 3 פעמים בשבוע כדי לשפר את טווח ההגעה שלך.</p>
            </div>

            {/* Auto Post Banner */}
            <div className="autopost-banner">
                <div className="autopost-banner-info">
                    <h3>פרסום אוטומטי</h3>
                    <p>{pendingVideos.length} סרטונים ממתינים ב-{connectedPlatforms} פלטפורמות</p>
                </div>
                <button className="btn btn-red btn-sm">
                    <Zap size={14} />
                    הפעל הכל
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                {stats.map(s => (
                    <div className="stat-card" key={s.label}>
                        <div className="stat-card-icon" style={{ background: s.bg }}>
                            <s.icon size={20} style={{ color: s.color }} />
                        </div>
                        <div className="stat-card-value">{s.value}</div>
                        <div className="stat-card-label">{s.label}</div>
                    </div>
                ))}
            </div>
            
            <div className="card">
                <div className="card-header">
                    <span className="card-title">סטטוס פלטפורמות</span>
                    <span style={{ fontSize: 13, color: 'var(--green)' }}>{connectedPlatforms} מחוברות</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                    {PLATFORMS.map(p => {
                        const connected = settings[`${p}_connected`]
                        return (
                            <div key={p} className={`platform-card ${connected ? 'connected' : ''}`} style={{ marginBottom: 0 }}>
                                <div className="platform-card-info">
                                    <div className="platform-color-dot" style={{ background: `var(--${p === 'x' ? 'x-twitter' : p})` }} />
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 500 }}>{PLATFORM_LABELS[p]}</div>
                                        <div style={{ fontSize: 11, color: connected ? 'var(--green)' : 'var(--text-muted)' }}>
                                            {connected ? '✓ מחובר' : 'לא מחובר'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Next in Queue */}
            {nextInQueue.length > 0 && (
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">סרטונים אחרונים</span>
                        <Link to="/videos" className="card-action">
                            הצג הכל →
                        </Link>
                    </div>
                    {nextInQueue.map(video => (
                        <div className="video-compact" key={video.id}>
                            <img
                                src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                alt=""
                                onError={e => { e.target.style.background = 'var(--bg-elevated)'; e.target.src = '' }}
                            />
                            <div className="video-compact-info">
                                <div className="video-compact-title">{video.title}</div>
                                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                                    {PLATFORMS.map(p => (
                                        <span
                                            key={p}
                                            className={`platform-dot ${video[`${p}_status`]}`}
                                            title={`${PLATFORM_LABELS[p]}: ${video[`${p}_status`]}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            {video.video_type === 'short' && (
                                <span className="video-type-badge short" style={{ position: 'static' }}>Short ⚡</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {videos.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon"><Video /></div>
                    <h3>ברוך הבא ל-AutoPost!</h3>
                    <p>עבור להגדרות כדי לחבר את ערוץ היוטיוב שלך</p>
                    <Link to="/settings" className="btn btn-red">הגדרות ←</Link>
                </div>
            )}
        </div>
    )
}
