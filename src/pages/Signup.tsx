// src/pages/Signup.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase/client';

const STATS = [
  { value: '50K+', label: 'Active Users' },
  { value: '2M+', label: 'Workouts Logged' },
  { value: '98%', label: 'Goal Achieved' },
];

const FEATURES = [
  { icon: '🧠', title: 'AI Coach', desc: 'Real-time personalized guidance' },
  { icon: '🥗', title: 'Meal Planner', desc: 'Custom macros crafted daily' },
  { icon: '💪', title: 'Workouts', desc: 'Adaptive training programs' },
  { icon: '📊', title: 'Analytics', desc: 'Track every gain you make' },
];

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    alert('Account created! Please check your email to confirm, then login.');
    navigate('/login');
  };

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* ── LEFT: Hero Panel ── */}
      <div style={s.hero}>
        {/* Animated gradient orbs */}
        <div style={s.orb1} className="orb" />
        <div style={s.orb2} className="orb2" />
        <div style={s.orb3} className="orb3" />

        {/* Grid overlay */}
        <div style={s.grid} />

        {/* Content */}
        <div style={{ ...s.heroContent, opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease' }}>

          {/* Badge */}
          <div style={s.badge} className="fadeUp delay1">
            <span style={s.badgeDot} />
            FREE FOREVER · NO CREDIT CARD
          </div>

          {/* Big headline */}
          <div style={s.headline} className="fadeUp delay2">
            <div style={s.headlineLine1}>TRAIN</div>
            <div style={s.headlineLine2}>
              SMART<span style={s.dot}>.</span>
            </div>
            <div style={s.headlineLine3}>
              <span style={s.accentText}>EAT RIGHT</span>
              <span style={s.dot}>.</span>
            </div>
          </div>

          {/* Sub */}
          <p style={s.sub} className="fadeUp delay3">
            AI-powered meal tracking, workout planning, and progress analytics — all in one place.
          </p>

          {/* Feature grid */}
          <div style={s.featureGrid} className="fadeUp delay4">
            {FEATURES.map(f => (
              <div key={f.title} style={s.featureCard}>
                <div style={s.featureIcon}>{f.icon}</div>
                <div>
                  <div style={s.featureTitle}>{f.title}</div>
                  <div style={s.featureDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={s.statsRow} className="fadeUp delay5">
            {STATS.map((st, i) => (
              <>
                <div key={st.label} style={s.stat}>
                  <div style={s.statVal}>{st.value}</div>
                  <div style={s.statLabel}>{st.label}</div>
                </div>
                {i < STATS.length - 1 && <div style={s.statDivider} />}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form Panel ── */}
      <div style={s.formPanel}>
        <div style={{ ...s.formBox, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 0.2s' }}>

          {/* Logo */}
          <div style={s.logo}>
            <div style={s.logoIcon}>F</div>
            <span style={s.logoText}>FITAI</span>
          </div>

          <h1 style={s.formHeading}>CREATE ACCOUNT</h1>
          <p style={s.formSub}>Start your fitness journey today</p>

          {error && (
            <div style={s.errorBanner}>{error}</div>
          )}

          <form onSubmit={handleSignup} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={s.input}
                onFocus={e => Object.assign(e.target.style, { borderColor: '#c8f000', boxShadow: '0 0 0 3px rgba(200,240,0,0.1)' })}
                onBlur={e => Object.assign(e.target.style, { borderColor: '#2a2a2a', boxShadow: 'none' })}
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                minLength={6}
                required
                style={s.input}
                onFocus={e => Object.assign(e.target.style, { borderColor: '#c8f000', boxShadow: '0 0 0 3px rgba(200,240,0,0.1)' })}
                onBlur={e => Object.assign(e.target.style, { borderColor: '#2a2a2a', boxShadow: 'none' })}
              />
            </div>

            <button type="submit" disabled={loading} style={s.submitBtn}>
              {loading ? <span style={s.spinner} /> : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div style={s.divider}>
            <div style={s.dividerLine} />
            <span style={s.dividerText}>or</span>
            <div style={s.dividerLine} />
          </div>

          <button style={s.googleBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p style={s.loginText}>
            Already have an account?{' '}
            <Link to="/login" style={s.loginLink}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── CSS ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -40px) scale(1.08); }
    66%       { transform: translate(-20px, 20px) scale(0.95); }
  }
  @keyframes orbFloat2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50%       { transform: translate(-40px, 30px) scale(1.1); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fadeUp { animation: fadeUp 0.75s ease both; }
  .delay1 { animation-delay: 0.1s; }
  .delay2 { animation-delay: 0.2s; }
  .delay3 { animation-delay: 0.35s; }
  .delay4 { animation-delay: 0.5s; }
  .delay5 { animation-delay: 0.65s; }

  .orb  { animation: orbFloat  10s ease-in-out infinite; }
  .orb2 { animation: orbFloat2 14s ease-in-out infinite; }
  .orb3 { animation: orbFloat  18s ease-in-out infinite reverse; }

  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #1c1c1c inset !important;
    -webkit-text-fill-color: #fff !important;
  }
`;

/* ─── Styles ─── */
const s: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'DM Sans', sans-serif",
    background: '#0e0e0e',
    overflow: 'hidden',
  },

  /* Hero */
  hero: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    padding: '3rem 3.5rem',
  },
  orb1: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(200,240,0,0.18) 0%, transparent 70%)',
    top: '-100px',
    left: '-100px',
    pointerEvents: 'none',
  },
  orb2: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(200,240,0,0.1) 0%, transparent 70%)',
    bottom: '-80px',
    right: '-60px',
    pointerEvents: 'none',
  },
  orb3: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100,200,100,0.08) 0%, transparent 70%)',
    top: '40%',
    left: '40%',
    pointerEvents: 'none',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(200,240,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(200,240,0,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 520,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(200,240,0,0.08)',
    border: '1px solid rgba(200,240,0,0.2)',
    color: '#c8f000',
    borderRadius: 999,
    padding: '0.35rem 1rem',
    fontSize: '0.65rem',
    letterSpacing: 3,
    fontWeight: 700,
    width: 'fit-content',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#c8f000',
    boxShadow: '0 0 6px #c8f000',
  },

  headline: {
    lineHeight: 0.95,
    letterSpacing: 2,
  },
  headlineLine1: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
    color: '#fff',
  },
  headlineLine2: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
    color: '#fff',
  },
  headlineLine3: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
    color: '#fff',
  },
  accentText: { color: '#c8f000' },
  dot: { color: '#c8f000' },

  sub: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: '0.92rem',
    lineHeight: 1.8,
    maxWidth: 420,
  },

  featureGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  featureCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: '0.9rem 1rem',
    backdropFilter: 'blur(10px)',
  },
  featureIcon: { fontSize: '1.5rem' },
  featureTitle: {
    color: '#fff',
    fontSize: '0.82rem',
    fontWeight: 600,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  featureDesc: { color: '#555', fontSize: '0.72rem' },

  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.07)',
  },
  stat: { textAlign: 'center' as const },
  statVal: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2rem',
    color: '#c8f000',
    letterSpacing: 2,
    lineHeight: 1,
  },
  statLabel: {
    color: '#555',
    fontSize: '0.68rem',
    letterSpacing: 1.5,
    marginTop: 4,
    textTransform: 'uppercase' as const,
  },
  statDivider: {
    width: 1,
    height: 36,
    background: 'rgba(255,255,255,0.08)',
  },

  /* Form panel */
  formPanel: {
    width: '42%',
    minWidth: 380,
    background: '#131313',
    borderLeft: '1px solid #1e1e1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5rem 3rem',
  },
  formBox: {
    width: '100%',
    maxWidth: 400,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '2.5rem',
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: '#c8f000',
    color: '#000',
    borderRadius: 8,
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 24,
    color: '#fff',
    letterSpacing: 3,
  },
  formHeading: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '2.6rem',
    color: '#fff',
    letterSpacing: 2,
    lineHeight: 1,
    marginBottom: '0.5rem',
  },
  formSub: {
    color: '#555',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  errorBanner: {
    background: 'rgba(255,80,80,0.12)',
    border: '1px solid rgba(255,80,80,0.3)',
    color: '#ff6b6b',
    borderRadius: 8,
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '1.2rem' },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '0.4rem' },
  label: {
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: 2,
    color: '#555',
  },
  input: {
    width: '100%',
    background: '#1c1c1c',
    border: '1.5px solid #2a2a2a',
    borderRadius: 10,
    padding: '0.85rem 1rem',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color .2s, box-shadow .2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  submitBtn: {
    marginTop: '0.5rem',
    background: '#c8f000',
    color: '#000',
    border: 'none',
    borderRadius: 10,
    padding: '0.95rem',
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '1.1rem',
    letterSpacing: 3,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  spinner: {
    width: 20,
    height: 20,
    border: '2.5px solid rgba(0,0,0,0.2)',
    borderTop: '2.5px solid #000',
    borderRadius: '50%',
    animation: 'spin .7s linear infinite',
    display: 'inline-block',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: '1.5rem 0',
  },
  dividerLine: { flex: 1, height: 1, background: '#272727' },
  dividerText: { color: '#555', fontSize: '0.8rem' },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    background: 'transparent',
    border: '1.5px solid #2a2a2a',
    borderRadius: 10,
    padding: '0.85rem',
    color: '#ccc',
    fontSize: '0.9rem',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '1.5rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  loginText: {
    textAlign: 'center' as const,
    color: '#555',
    fontSize: '0.88rem',
  },
  loginLink: {
    color: '#c8f000',
    fontWeight: 600,
    textDecoration: 'none',
  },
};