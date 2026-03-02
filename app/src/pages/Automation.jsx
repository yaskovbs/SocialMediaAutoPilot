import { useApp } from '../store'
import { Bot, RefreshCw, Sparkles, Bell, Save } from 'lucide-react'

export default function Automation() {
    const { automation, updateAutomation } = useApp()

    return (
        <div>
            <div className="page-header">
                <h1>אוטומציה לפרסום</h1>
                <p>הגדר מתי ואיך הסרטונים מתפרסמים אוטומטית</p>
            </div>

            {/* Connection status */}
            <div className="card" style={{ background: 'var(--green-soft)', borderColor: 'var(--green-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontWeight: 600, color: 'var(--green)' }}>7 פלטפורמות מחוברות</div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>האוטומציה פועלת</div>
                    </div>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />
                </div>
            </div>

            {/* AI Caption Generator */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sparkles size={18} color="var(--purple)" />
                        <span className="card-title">AI Caption Generator</span>
                    </div>
                    <div
                        className={`toggle ${automation.ai_captions ? 'active' : ''}`}
                        onClick={() => updateAutomation({ ai_captions: !automation.ai_captions })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">סגנון כיתוב</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {[
                            { id: 'engaging', label: '🔥 מושך ומעורר סקרנות' },
                            { id: 'professional', label: '💼 אינפורמטיבי ומקצועי' },
                            { id: 'short', label: '😊 קצר ופשוט' },
                            { id: 'viral', label: '🚀 ויראלי עם הרבה hashtags' },
                        ].map(s => (
                            <button
                                key={s.id}
                                className={`filter-btn ${automation.caption_style === s.id ? 'active' : ''}`}
                                style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '8px 16px' }}
                                onClick={() => updateAutomation({ caption_style: s.id })}
                            >{s.label}</button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">שפה</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[
                            { id: 'he_en', label: '🌍 עברית + אנגלית' },
                            { id: 'en', label: 'EN אנגלית' },
                            { id: 'he', label: 'IL עברית' },
                        ].map(l => (
                            <button
                                key={l.id}
                                className={`filter-btn ${automation.caption_lang === l.id ? 'active' : ''}`}
                                style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '8px 16px' }}
                                onClick={() => updateAutomation({ caption_lang: l.id })}
                            >{l.label}</button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <input type="checkbox" checked={automation.include_hashtags} onChange={e => updateAutomation({ include_hashtags: e.target.checked })} />
                        #hashtags ✅
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                        <input type="checkbox" checked={automation.include_emojis} onChange={e => updateAutomation({ include_emojis: e.target.checked })} />
                        Emojis 😊 ✅
                    </label>
                </div>
            </div>

            {/* Publishing Rules */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <RefreshCw size={18} color="var(--accent-red)" />
                    <span className="card-title">כללי פרסום</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                        { key: 'auto_post_new', label: 'פרסם סרטונים חדשים אוטומטית', desc: 'כל סרטון חדש ביוטיוב יתפרסם מיד' },
                        { key: 'auto_post_old', label: 'פרסם סרטונים ישנים', desc: 'פרסם בהדרגה סרטונים שטרם פורסמו' },
                        { key: 'retry_on_fail', label: 'נסה שוב כשיש כשל', desc: 'ניסיון חוזר אוטומטי אם הפרסום נכשל' },
                    ].map(rule => (
                        <div key={rule.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 600 }}>{rule.label}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rule.desc}</div>
                            </div>
                            <div
                                className={`toggle ${automation[rule.key] ? 'active' : ''}`}
                                onClick={() => updateAutomation({ [rule.key]: !automation[rule.key] })}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Timing */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <span style={{ fontSize: 18 }}>⏱</span>
                    <span className="card-title">תזמון</span>
                </div>

                <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span className="form-label">מרווח בין פרסומים: {automation.interval_hours} שעות</span>
                    </div>
                    <input
                        type="range"
                        className="range-slider"
                        min="1"
                        max="24"
                        value={automation.interval_hours}
                        onChange={e => updateAutomation({ interval_hours: parseInt(e.target.value) })}
                    />
                </div>

                <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span className="form-label">מקסימום ביום: {automation.max_per_day} פרסומים</span>
                    </div>
                    <input
                        type="range"
                        className="range-slider"
                        min="1"
                        max="50"
                        value={automation.max_per_day}
                        onChange={e => updateAutomation({ max_per_day: parseInt(e.target.value) })}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">סדר פרסום</label>
                    <select
                        className="form-select"
                        value={automation.post_order}
                        onChange={e => updateAutomation({ post_order: e.target.value })}
                    >
                        <option value="oldest_first">מהישן לחדש ✓ (מומלץ)</option>
                        <option value="newest_first">מהחדש לישן</option>
                    </select>
                </div>
            </div>

            {/* Notifications */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Bell size={18} color="var(--yellow)" />
                        <div>
                            <div className="card-title">התראות</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>הודעה על כל פרסום</div>
                        </div>
                    </div>
                    <div
                        className={`toggle ${automation.notifications ? 'active' : ''}`}
                        onClick={() => updateAutomation({ notifications: !automation.notifications })}
                    />
                </div>
            </div>

            <button className="btn btn-red btn-block" style={{ marginTop: 8 }}>
                <Save size={16} />
                שמור הגדרות אוטומציה
            </button>
        </div>
    )
}
