// src/pages/Signup.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase/client';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    alert('Account created! Please check your email to confirm, then login.');
    navigate('/login');
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--surface3)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text)', fontSize: '14px',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)', display: 'flex' }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, background: 'var(--surface)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: '60px',
      }}>
        <div style={{ maxWidth: '380px', textAlign: 'center' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>🚀</div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: 'var(--text)', margin: '0 0 12px', letterSpacing: '0.04em' }}>
            Start Your<br /><span style={{ color: 'var(--accent)' }}>Fitness Journey</span>
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>
            Join thousands of people hitting their goals with AI-powered guidance.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '28px', textAlign: 'left' }}>
            {['✅ Personalized AI meal plans', '✅ Smart workout tracking', '✅ Real-time progress analytics'].map(item => (
              <span key={item} style={{ fontSize: '13px', color: 'var(--muted)' }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, background: 'var(--surface2)',
        borderLeft: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: '60px',
      }}>
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#111' }}>F</span>
              </div>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', color: 'var(--accent)', letterSpacing: '0.06em' }}>FitAI</span>
            </div>
            <h1 style={{ margin: '0 0 8px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '38px', color: 'var(--text)', letterSpacing: '0.04em', lineHeight: 1 }}>
              Create Account
            </h1>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>Free forever. No credit card needed.</p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} required style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px', padding: '13px',
                background: loading ? 'var(--surface3)' : 'var(--accent)',
                color: loading ? 'var(--muted)' : '#111',
                border: 'none', borderRadius: '10px',
                fontSize: '16px', fontWeight: 700,
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '0.1em',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}