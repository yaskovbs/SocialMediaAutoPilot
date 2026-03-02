import { useState } from 'react'
import { useApp } from '../store'
import { Search } from 'lucide-react'

const PLATFORMS = ['tiktok', 'instagram', 'facebook', 'x', 'telegram', 'pinterest', 'dailymotion']
const PLATFORM_LABELS = { tiktok: 'TT', instagram: 'IG', facebook: 'FB', x: 'X', telegram: 'TG', pinterest: 'PT', dailymotion: 'DM' }

export default function Videos() {
    const { videos } = useApp()
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [search, setSearch] = useState('')

    const filtered = videos.filter(v => {
        if (typeFilter !== 'all' && v.video_type !== typeFilter) return false
        if (statusFilter === 'pending' && !PLATFORMS.some(p => v[`${p}_status`] === 'pending')) return false
        if (statusFilter === 'posted' && !PLATFORMS.every(p => v[`${p}_status`] === 'posted')) return false
        if (statusFilter === 'failed' && !PLATFORMS.some(p => v[`${p}_status`] === 'failed')) return false
        if (search && !v.title?.toLowerCase().includes(search.toLowerCase())) return false
        return true
    }).sort((a, b) => new Date(a.published_at) - new Date(b.published_at))

    const postedCount = (v) => PLATFORMS.filter(p => v[`${p}_status`] === 'posted').length
    const totalPlatforms = PLATFORMS.length

    return (
        <div>
            <div className="page-header">
                <h1>כל הסרטונים</h1>
                <p>{filtered.length} סרטונים</p>
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

                <div className="filter-group">
                    {[
                        { id: 'all', label: 'כל הסוגים' },
                        { id: 'video', label: 'סרטונים' },
                        { id: 'short', label: 'Shorts' },
                    ].map(f => (
                        <button
                            key={f.id}
                            className={`filter-btn ${typeFilter === f.id ? 'active' : ''}`}
                            onClick={() => setTypeFilter(f.id)}
                        >{f.label}</button>
                    ))}
                </div>

                <div className="filter-group">
                    {[
                        { id: 'all', label: 'כל הסטטוסים' },
                        { id: 'pending', label: 'ממתינים' },
                        { id: 'posted', label: 'פורסם' },
                        { id: 'failed', label: 'נכשל' },
                    ].map(f => (
                        <button
                            key={f.id}
                            className={`filter-btn ${statusFilter === f.id ? 'active' : ''}`}
                            onClick={() => setStatusFilter(f.id)}
                        >{f.label}</button>
                    ))}
                </div>
            </div>

            {filtered.length > 0 ? (
                <div className="video-grid">
                    {filtered.map(video => {
                        const posted = postedCount(video)
                        return (
                            <div className="video-card" key={video.id}>
                                <div className="video-card-thumb">
                                    <img
                                        src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                        alt={video.title}
                                        onError={e => { e.target.style.background = 'var(--bg-elevated)' }}
                                    />
                                    <span className={`video-type-badge ${video.video_type}`}>
                                        {video.video_type === 'short' ? 'Short ⚡' : 'Video ▶'}
                                    </span>
                                    <span className="video-progress-badge">
                                        פורסם {Math.round((posted / totalPlatforms) * 100)}%
                                    </span>
                                </div>
                                <div className="video-card-info">
                                    <div className="video-card-title">{video.title}</div>
                                    <div className="video-card-date">
                                        {new Date(video.published_at).toLocaleDateString('he-IL')}
                                    </div>
                                    <div className="platform-dots">
                                        {PLATFORMS.map(p => (
                                            <span
                                                key={p}
                                                className={`platform-dot ${video[`${p}_status`]}`}
                                                title={`${PLATFORM_LABELS[p]}: ${video[`${p}_status`]}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <h3>לא נמצאו סרטונים</h3>
                    <p>סנכרן את הערוץ בהגדרות כדי להוסיף סרטונים</p>
                </div>
            )}
        </div>
    )
}
