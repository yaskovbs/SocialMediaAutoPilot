import { useApp } from '../store'
import { AlertTriangle, RefreshCw, X } from 'lucide-react'

const PLATFORMS = ['tiktok', 'instagram', 'facebook', 'x', 'telegram', 'pinterest', 'dailymotion']
const PLATFORM_LABELS = { tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', x: 'X', telegram: 'Telegram', pinterest: 'Pinterest', dailymotion: 'Dailymotion' }

export default function Errors() {
    const { videos, updateVideoStatus } = useApp()

    // Find all failed platform-video pairs
    const errors = []
    videos.forEach(v => {
        PLATFORMS.forEach(p => {
            if (v[`${p}_status`] === 'failed') {
                errors.push({ videoId: v.id, video: v, platform: p })
            }
        })
    })

    const totalPosted = videos.reduce((acc, v) => acc + PLATFORMS.filter(p => v[`${p}_status`] === 'posted').length, 0)
    const totalPending = videos.reduce((acc, v) => acc + PLATFORMS.filter(p => v[`${p}_status`] === 'pending').length, 0)

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1>🔔 שגיאות ועדכונים</h1>
                {errors.length > 0 && (
                    <button className="btn btn-ghost btn-sm">
                        <RefreshCw size={14} />
                        נסה הכל שוב
                    </button>
                )}
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                <div className="stat-card" style={{ borderColor: 'rgba(229,62,62,0.3)', background: 'var(--accent-red-soft)' }}>
                    <div className="stat-card-value" style={{ color: 'var(--accent-red)' }}>{errors.length}</div>
                    <div className="stat-card-label">שגיאות</div>
                </div>
                <div className="stat-card" style={{ borderColor: 'var(--yellow-border)', background: 'var(--yellow-soft)' }}>
                    <div className="stat-card-value" style={{ color: 'var(--yellow)' }}>{totalPending}</div>
                    <div className="stat-card-label">ממתינים</div>
                </div>
                <div className="stat-card" style={{ borderColor: 'var(--green-border)', background: 'var(--green-soft)' }}>
                    <div className="stat-card-value" style={{ color: 'var(--green)' }}>{totalPosted}</div>
                    <div className="stat-card-label">פורסמו</div>
                </div>
            </div>

            {/* Error list */}
            {errors.length > 0 ? (
                <>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
                        שגיאות לטיפול ({errors.length})
                    </p>
                    {errors.map((err, i) => (
                        <div className="error-row" key={`${err.videoId}-${err.platform}`}>
                            <div className="error-row-info">
                                <div className="error-row-title">
                                    🎬 {err.video.title}
                                </div>
                                <div className="error-row-platform">
                                    פרסום ל-{PLATFORM_LABELS[err.platform]} נכשל
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                <button
                                    className="btn btn-red btn-sm"
                                    onClick={() => updateVideoStatus(err.videoId, err.platform, 'pending')}
                                >
                                    <RefreshCw size={12} />
                                    נסה שוב
                                </button>
                                <button
                                    className="btn btn-ghost btn-sm"
                                    style={{ padding: '6px 8px' }}
                                    onClick={() => updateVideoStatus(err.videoId, err.platform, 'skipped')}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className="empty-state">
                    <div className="empty-state-icon"><AlertTriangle /></div>
                    <h3>אין שגיאות!</h3>
                    <p>כל הפרסומים עובדים כמו שצריך 🎉</p>
                </div>
            )}
        </div>
    )
}
