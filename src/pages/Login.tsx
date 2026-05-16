// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface)',
      display: 'flex',
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1,
        background: 'var(--surface2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        borderRight: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{
                width: '40px', height: '40px', background: 'var(--accent)',
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#111' }}>F</span>
              </div>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', color: 'var(--accent)', letterSpacing: '0.06em' }}>FitAI</span>
            </div>
            <h1 style={{ margin: '0 0 8px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px', color: 'var(--text)', letterSpacing: '0.04em', lineHeight: 1 }}>
              Welcome Back
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>Log in to continue your fitness journey</p>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px',
              marginBottom: '20px', fontSize: '13px', color: '#f87171',
            }}>{error}</div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--surface3)', border: '1px solid var(--border)',
                  borderRadius: '10px', color: 'var(--text)', fontSize: '14px',
                  outline: 'none', fontFamily: 'DM Sans, sans-serif',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: 'var(--surface3)', border: '1px solid var(--border)',
                  borderRadius: '10px', color: 'var(--text)', fontSize: '14px',
                  outline: 'none', fontFamily: 'DM Sans, sans-serif',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                padding: '13px',
                background: loading ? 'var(--surface3)' : 'var(--accent)',
                color: loading ? 'var(--muted)' : '#111',
                border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '0.1em',
                fontSize: '16px',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        background: 'var(--surface)',
      }}>
        <div style={{ maxWidth: '380px', textAlign: 'center' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>🏋️</div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: 'var(--text)', margin: '0 0 12px', letterSpacing: '0.04em' }}>
            Train Smart.<br /><span style={{ color: 'var(--accent)' }}>Eat Right.</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>
            AI-powered meal plans, workout tracking, and progress analytics — all in one place.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
            {['🍽️ AI Meals', '💪 Workouts', '📊 Analytics'].map(tag => (
              <span key={tag} style={{
                padding: '6px 14px', background: 'var(--surface2)',
                border: '1px solid var(--border)', borderRadius: '20px',
                fontSize: '12px', color: 'var(--muted)',
              }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}