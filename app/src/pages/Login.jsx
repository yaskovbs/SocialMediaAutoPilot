import { useState } from 'react';
import { useAuth } from '../store';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Globe } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, loginWithEmail, registerWithEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="auth-card" style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 60, height: 60, background: 'var(--accent-red)', borderRadius: 'var(--radius-full)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{isRegister ? 'הרשמה' : 'התחברות'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>כניסה ל-Social Media Auto Pilot</p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="btn"
          style={{ background: 'var(--bg-secondary)', color: 'white', width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}
        >
          <Globe size={20} />
          התחבר עם Google
        </button>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>שם משתמש</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} />
                <input
                  type="text"
                  placeholder="שם משתמש"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
                  dir="rtl"
                />
              </div>
            </div>
          )}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>אימייל</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={18} />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
                dir="ltr"
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>סיסמה</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} />
              <input
                type="password"
                placeholder="סיסמה חזקה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}
                dir="rtl"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-red"
            style={{ width: '100%', padding: '1rem' }}
          >
            {loading ? 'טוען...' : (isRegister ? 'הירשם' : 'התחבר')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{ background: 'none', color: 'var(--accent-red)', border: 'none', fontSize: '0.875rem' }}
          >
            {isRegister ? 'יש לך חשבון? התחבר כאן' : 'אין לך חשבון? הרשם כאן'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Link to="/privacy" style={{ color: 'var(--text-secondary)' }}>פרטיות</Link> | 
          <Link to="/terms" style={{ color: 'var(--text-secondary)' }}>תנאי שימוש</Link>
        </div>
      </div>
    </div>
  );
}
