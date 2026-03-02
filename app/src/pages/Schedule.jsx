import { useApp } from '../store'
import { CalendarDays, Zap, Clock, Save } from 'lucide-react'

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

const REC_TIMES = [
    { platform: 'x', time: '09:00' },
    { platform: 'instagram', time: '11:00' },
    { platform: 'facebook', time: '13:00' },
    { platform: 'tiktok', time: '19:00' },
    { platform: 'telegram', time: '10:00' },
    { platform: 'pinterest', time: '20:00' },
]

export default function Schedule() {
    const { schedule, updateSchedule } = useApp()

    const toggleDay = (day) => {
        const days = schedule.active_days.includes(day)
            ? schedule.active_days.filter(d => d !== day)
            : [...schedule.active_days, day]
        updateSchedule({ active_days: days })
    }

    return (
        <div>
            <div className="page-header">
                <h1>📅 לוח זמנים לפרסום</h1>
            </div>

            {/* Main toggle */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontWeight: 600 }}>פרסום אוטומטי מתוזמן</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>הפעל פרסום לפי לוח זמנים קבוע</div>
                    </div>
                    <div
                        className={`toggle ${schedule.enabled ? 'active' : ''}`}
                        onClick={() => updateSchedule({ enabled: !schedule.enabled })}
                    />
                </div>
            </div>

            {/* Frequency */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Zap size={18} color="var(--yellow)" />
                    <span className="card-title">תדירות פרסום</span>
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    {[
                        { id: 'daily', label: 'יומי' },
                        { id: 'weekly', label: 'שבועי' },
                        { id: 'custom', label: 'מותאם' },
                    ].map(f => (
                        <button
                            key={f.id}
                            className={`filter-btn ${schedule.frequency === f.id ? 'active' : ''}`}
                            style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px' }}
                            onClick={() => updateSchedule({ frequency: f.id })}
                        >{f.label}</button>
                    ))}
                </div>

                <div className="form-group">
                    <label className="form-label">פוסטים ליום</label>
                    <input
                        type="number"
                        className="form-input"
                        value={schedule.posts_per_day}
                        onChange={e => updateSchedule({ posts_per_day: parseInt(e.target.value) || 1 })}
                        min="1"
                        max="100"
                        dir="ltr"
                    />
                </div>
            </div>

            {/* Active Days */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Clock size={18} color="var(--blue)" />
                    <span className="card-title">ימים פעילים</span>
                </div>
                <div className="day-pills">
                    {DAYS.map(day => (
                        <button
                            key={day}
                            className={`day-pill ${schedule.active_days.includes(day) ? 'active' : ''}`}
                            onClick={() => toggleDay(day)}
                        >{day}</button>
                    ))}
                </div>
            </div>

            {/* Time Settings */}
            <div className="card">
                <div className="card-title" style={{ marginBottom: 16 }}>הגדרות זמן</div>

                <div className="form-group">
                    <label className="form-label">שעת פרסום ראשית</label>
                    <select
                        className="form-select"
                        value={schedule.start_time}
                        onChange={e => updateSchedule({ start_time: e.target.value })}
                    >
                        {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>פרסום כפול ביום</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>פרסם פעמיים ביום בשעות שונות</div>
                    </div>
                    <div
                        className={`toggle ${schedule.double_post ? 'active' : ''}`}
                        onClick={() => updateSchedule({ double_post: !schedule.double_post })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">מקסימום בתור</label>
                    <input
                        type="number"
                        className="form-input"
                        value={schedule.max_in_queue}
                        onChange={e => updateSchedule({ max_in_queue: parseInt(e.target.value) || 10 })}
                        dir="ltr"
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>עצור בסוף השבוע</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>לא לפרסם בשישי ושבת</div>
                    </div>
                    <div
                        className={`toggle ${schedule.stop_weekend ? 'active' : ''}`}
                        onClick={() => updateSchedule({ stop_weekend: !schedule.stop_weekend })}
                    />
                </div>
            </div>

            {/* Recommended Times */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 16 }}>ℹ️</span>
                    <span className="card-title">שעות מומלצות לפרסום</span>
                </div>
                <div className="rec-times">
                    {REC_TIMES.map(r => (
                        <div className="rec-time" key={r.platform}>
                            <span>{r.platform}</span>{' '}
                            <span style={{ fontWeight: 600 }}>{r.time}</span>
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
                    לחץ על פלטפורמה להגדיר את השעה שלה
                </p>
            </div>

            <button className="btn btn-red btn-block" style={{ marginTop: 8 }}>
                <Save size={16} />
                שמור לוח זמנים
            </button>
        </div>
    )
}
