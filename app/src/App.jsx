import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Videos from './pages/Videos'
import Automation from './pages/Automation'
import Schedule from './pages/Schedule'
import Analytics from './pages/Analytics'
import Errors from './pages/Errors'
import ContentManager from './pages/ContentManager'
import Settings from './pages/Settings'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

export default function App() {
    return (
        <Routes>
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/automation" element={<Automation />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/errors" element={<Errors />} />
                <Route path="/content" element={<ContentManager />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    )
}
