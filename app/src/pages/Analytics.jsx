import { useState } from 'react'
import { useApp } from '../store'
import { TrendingUp, Video, Zap } from 'lucide-react'

const PLATFORMS = ['tiktok', 'instagram', 'facebook', 'x', 'telegram', 'pinterest', 'dailymotion']
const PLATFORM_LABELS = { tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', x: 'X', telegram: 'Telegram', pinterest: 'Pinterest', dailymotion: 'Dailymotion' }
const PLATFORM_COLORS = { tiktok: '#010101', instagram: '#e1306c', facebook: '#1877f2', x: '#a0a0b5', telegram: '#26a5e4', pinterest: '#e60023', dailymotion: '#0066dc' }

export default function Analytics() {
    const { videos } = useApp()
    const [activeTab, setActiveTab] = useState('overview')

    const totalVideos = videos.length
    const totalPosted = videos.filter(v => PLATFORMS.every(p => v[`${p}_status`] === 'posted')).length
    const totalPending = videos.filter(v => PLATFORMS.some(p => v[`${p}_status`] === 'pending')).length
    const totalSlots = totalVideos * PLATFORMS.length
    const postedSlots = videos.reduce((acc, v) => acc + PLATFORMS.filter(p => v[`${p}_status`] === 'posted').length, 0)
    const successRate = totalSlots > 0 ? Math.round((postedSlots / totalSlots) * 100) : 0

    const platformStats = PLATFORMS.map(p => {
        const posted = videos.filter(v => v[`${p}_status`] === 'posted').length
        const pending = videos.filter(v => v[`${p}_status`] === 'pending').length
        const failed = videos.filter(v => v[`${p}_status`] === 'failed').length
        return { platform: p, posted, pending, failed, total: videos.length }
    })

    const maxPosted = Math.max(...platformStats.map(s => s.total), 1)

    const stats = [
        { label: 'סה"כ סרטונים', value: totalVideos, icon: Video, color: 'var(--accent-red)', bg: 'var(--accent-red-soft)' },
        { label: 'פורסמו', value: totalPosted, icon: null, color: 'var(--green)', bg: 'var(--green-soft)', emoji: '✓' },
        { label: 'ממתינים', value: totalPending, icon: null, color: 'var(--yellow)', bg: 'var(--yellow-soft)', emoji: '⏱' },
        { label: 'אחוז הצלחה', value: `${successRate}%`, icon: Zap, color: 'var(--purple)', bg: 'var(--purple-soft)' },
    ]

    const tabs = [
        { id: 'overview', label: 'סקירה' },
        { id: 'platforms', label: 'פלטפורמות' },
        { id: 'videos', label: 'סרטונים' },
        { id: 'trends', label: 'מגמות' },
    ]

    return (
        <div>
            <div className="page-header">
                <h1>📈 אנליטיקס מתקדם</h1>
            </div>

            <div className="stats-grid">
                {stats.map(s => (
                    <div className="stat-card" key={s.label}>
                        <div className="stat-card-icon" style={{ background: s.bg }}>
                            {s.icon
                                ? <s.icon size={20} style={{ color: s.color }} />
                                : <span style={{ fontSize: 18, color: s.color }}>{s.emoji}</span>}
                        </div>
                        <div className="stat-card-value">{s.value}</div>
                        <div className="stat-card-label">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="filter-bar" style={{ marginBottom: 20 }}>
                <div className="filter-group">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            className={`filter-btn ${activeTab === t.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(t.id)}
                        >{t.label}</button>
                    ))}
                </div>
            </div>

            {(activeTab === 'overview' || activeTab === 'platforms') && (
                <div className="card">
                    <div className="card-title" style={{ marginBottom: 20 }}>פרסומים לפי פלטפורמה</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {platformStats.map(ps => (
                            <div key={ps.platform} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ width: 80, fontSize: 12, fontWeight: 500, textAlign: 'left' }}>
                                    {PLATFORM_LABELS[ps.platform]}
                                </span>
                                <div style={{ flex: 1, display: 'flex', gap: 2, height: 28, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(ps.posted / maxPosted) * 100}%`,
                                        background: 'var(--green)',
                                        borderRadius: '4px 0 0 4px',
                                        minWidth: ps.posted > 0 ? 4 : 0,
                                        transition: 'width 0.5s ease'
                                    }} />
                                    <div style={{
                                        width: `${(ps.pending / maxPosted) * 100}%`,
                                        background: 'var(--yellow)',
                                        minWidth: ps.pending > 0 ? 4 : 0,
                                        transition: 'width 0.5s ease'
                                    }} />
                                    <div style={{
                                        width: `${(ps.failed / maxPosted) * 100}%`,
                                        background: 'var(--accent-red)',
                                        borderRadius: '0 4px 4px 0',
                                        minWidth: ps.failed > 0 ? 4 : 0,
                                        transition: 'width 0.5s ease'
                                    }} />
                                </div>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 40, textAlign: 'center' }}>
                                    {ps.posted}/{ps.total}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 16 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--green)' }} /> פורסם
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--yellow)' }} /> ממתין
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent-red)' }} /> נכשל
                        </span>
                    </div>
                </div>
            )}

            {(activeTab === 'overview' || activeTab === 'platforms') && (
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <Zap size={18} color="var(--yellow)" />
                        <span className="card-title">אחוז הצלחה לפי פלטפורמה</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {platformStats.map(ps => {
                            const rate = ps.total > 0 ? Math.round((ps.posted / ps.total) * 100) : 0
                            return (
                                <div key={ps.platform} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ width: 90, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: PLATFORM_COLORS[ps.platform] }} />
                                        {PLATFORM_LABELS[ps.platform]}
                                    </span>
                                    <div style={{ flex: 1, height: 8, background: 'var(--bg-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${rate}%`,
                                            height: '100%',
                                            background: PLATFORM_COLORS[ps.platform],
                                            borderRadius: 4,
                                            transition: 'width 0.5s ease'
                                        }} />
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 600, width: 36 }}>{rate}%</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="card" style={{ background: 'linear-gradient(135deg, var(--purple-soft), transparent)', borderColor: 'rgba(128,90,213,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>✨</span>
                    <span className="card-title" style={{ color: '#b794f4' }}>תובנות AI</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    הפלטפורמות עם הביצועים הטובים ביותר הן {[...platformStats].sort((a, b) => b.posted - a.posted).slice(0, 2).map(p => PLATFORM_LABELS[p.platform]).join(' ו-')}.
                    המשך לפרסם באופן עקבי לשיפור הכיסוי.
                </p>
            </div>
        </div>
    )
}
