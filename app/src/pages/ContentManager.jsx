import { useState } from 'react'
import { useApp } from '../store'
import { Search, ChevronDown } from 'lucide-react'

const PLATFORMS = ['tiktok', 'instagram', 'facebook', 'x', 'telegram', 'pinterest', 'dailymotion']
const PLATFORM_BADGES = { tiktok: 'TT', instagram: 'IG', facebook: 'FB', x: 'X', telegram: 'TG', pinterest: 'PT', dailymotion: 'DM' }
const PLATFORM_BADGE_COLORS = {
    tiktok: '#010101', instagram: '#e1306c', facebook: '#1877f2',
    x: '#a0a0b5', telegram: '#26a5e4', pinterest: '#e60023', dailymotion: '#0066dc'
}

export default function ContentManager() {
    const { videos, updateVideoStatus } = useApp()
    const [search, setSearch] = useState('')
    const [expandedId, setExpandedId] = useState(null)

    const filtered = videos.filter(v =>
        !search || v.title?.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => new Date(a.published_at) - new Date(b.published_at))

    const postedCount = (v) => PLATFORMS.filter(p => v[`${p}_status`] === 'posted').length

    return (
        <div>
            <div className="page-header">
                <h1>ניהול תוכן</h1>
                <p>נהל ידנית את סטטוס הפרסום של כל סרטון</p>
            </div>

            <div className="filter-bar">
                <div className="search-wrapper">
                    <Search />
                    <input
                        className="search-input"
                        placeholder="חפש סרטון..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>הכל ({filtered.length})</span>
            </div>

            <div>
                {filtered.map(video => {
                    const posted = postedCount(video)
                    const isExpanded = expandedId === video.id

                    return (
                        <div key={video.id}>
                            <div
                                className="content-row"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setExpandedId(isExpanded ? null : video.id)}
                            >
                                <img
                                    src={`https://img.youtube.com/vi/${video.youtube_id}/default.jpg`}
                                    alt=""
                                    onError={e => { e.target.style.background = 'var(--bg-elevated)' }}
                                />
                                <div className="content-row-info">
                                    <div className="content-row-title">{video.title}</div>
                                </div>
                                <div className="content-row-meta">
                                    {video.video_type === 'short' && (
                                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--pink-soft)', color: 'var(--pink)', fontWeight: 600 }}>Short</span>
                                    )}
                                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{posted}/{PLATFORMS.length}</span>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {PLATFORMS.map(p => (
                                            <span
                                                key={p}
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    padding: '2px 6px',
                                                    borderRadius: 4,
                                                    background: video[`${p}_status`] === 'posted' ? 'var(--green-soft)' :
                                                        video[`${p}_status`] === 'failed' ? 'var(--accent-red-soft)' : 'var(--bg-elevated)',
                                                    color: video[`${p}_status`] === 'posted' ? 'var(--green)' :
                                                        video[`${p}_status`] === 'failed' ? 'var(--accent-red)' :
                                                            PLATFORM_BADGE_COLORS[p]
                                                }}
                                            >
                                                {PLATFORM_BADGES[p]}{video[`${p}_status`] === 'posted' ? '✓' : video[`${p}_status`] === 'failed' ? '✗' : ''}
                                            </span>
                                        ))}
                                    </div>
                                    <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />
                                </div>
                            </div>

                            {/* Expanded: per-platform status controls */}
                            {isExpanded && (
                                <div style={{ padding: '12px 16px 16px', background: 'var(--bg-card)', borderRadius: '0 0 var(--radius-md) var(--radius-md)', marginTop: -6, marginBottom: 6, border: '1px solid var(--border-color)', borderTop: 'none' }}>
                                    {PLATFORMS.map(p => (
                                        <div key={p} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                            <span style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: PLATFORM_BADGE_COLORS[p] }} />
                                                {p.charAt(0).toUpperCase() + p.slice(1)}
                                            </span>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                {['pending', 'posted', 'failed', 'skipped'].map(status => (
                                                    <button
                                                        key={status}
                                                        onClick={() => updateVideoStatus(video.id, p, status)}
                                                        className="btn btn-sm"
                                                        style={{
                                                            padding: '4px 10px',
                                                            fontSize: 11,
                                                            background: video[`${p}_status`] === status ? (
                                                                status === 'posted' ? 'var(--green)' :
                                                                    status === 'failed' ? 'var(--accent-red)' :
                                                                        status === 'pending' ? 'var(--yellow)' : 'var(--text-muted)'
                                                            ) : 'var(--bg-elevated)',
                                                            color: video[`${p}_status`] === status ? 'white' : 'var(--text-secondary)',
                                                            borderRadius: 'var(--radius-sm)',
                                                        }}
                                                    >
                                                        {status === 'posted' ? '✓ פורסם' : status === 'pending' ? '○ ממתין' : status === 'failed' ? '✗ נכשל' : '– דלג'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
