import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useApp } from '../store'
import { useAuth } from '../store'
import {
    LayoutDashboard, Video, Bot, CalendarDays, TrendingUp,
    AlertTriangle, Layers, Settings, Zap, Menu, X,
    Shield, FileText
} from 'lucide-react'

const navItems = [
    { to: '/', label: 'דשבורד', icon: LayoutDashboard },
    { to: '/videos', label: 'סרטונים', icon: Video },
    { to: '/automation', label: 'אוטומציה', icon: Bot },
    { to: '/schedule', label: 'לוח זמנים', icon: CalendarDays },
    { to: '/analytics', label: 'אנליטיקס', icon: TrendingUp },
    { to: '/errors', label: 'שגיאות', icon: AlertTriangle },
    { to: '/content', label: 'ניהול תוכן', icon: Layers },
    { to: '/settings', label: 'הגדרות', icon: Settings },
]

export default function Layout() {
    const { userPhoto, settings } = useApp()
    const { logout, user } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
                {/* Brand */}
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h1>AutoPost</h1>
                        <p>פרסום אוטומטי</p>
                    </div>
                </div>

                {/* Profile */}
                <div className="sidebar-profile">
                    <div style={{ position: 'relative' }}>
                        <img src={userPhoto} alt="Profile" />
                        <div className="profile-online-dot"></div>
                    </div>
                    <div className="profile-info">
                        <p>Liav Ben Salomon</p>
                        <p>kovbs2502@gmail.com</p>
                    </div>
                    <button onClick={logout} className="logout-btn" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        התנתק
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <item.icon />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <p>מופעל על ידי</p>
                    <a href="https://getlate.dev" target="_blank" rel="noopener noreferrer" className="getlate-badge">
                        <Zap size={12} />
                        Late API
                    </a>
                </div>
            </aside>

            {/* Mobile overlay */}
            <div
                className={`mobile-overlay ${mobileOpen ? 'show' : ''}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Main area */}
            <div className="main-content">
                {/* Mobile header */}
                <div className="mobile-header">
                    <img src={userPhoto} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-red)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 24, height: 24, background: 'var(--accent-red)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={14} color="white" />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>AutoPost</span>
                    </div>
                    <button onClick={() => setMobileOpen(true)}>
                        <Menu size={20} />
                    </button>
                </div>

                {/* Page content */}
                <div className="page-container animate-in">
                    <Outlet />

                    {/* Footer links */}
                    <div className="footer-links">
                        <Link to="/privacy">
                            <Shield size={12} />
                            פרטיות
                        </Link>
                        <span>·</span>
                        <Link to="/terms">
                            <FileText size={12} />
                            תנאי שימוש
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
