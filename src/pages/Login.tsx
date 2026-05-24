// // src/pages/Login.tsx
// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { supabase } from '../supabase/client';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) { setError(error.message); setLoading(false); return; }
//     navigate('/dashboard');
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'var(--surface)',
//       display: 'flex',
//     }}>
//       {/* Left Panel */}
//       <div style={{
//         flex: 1,
//         background: 'var(--surface2)',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '60px',
//         borderRight: '1px solid var(--border)',
//       }}>
//         <div style={{ maxWidth: '420px', width: '100%' }}>
//           <div style={{ marginBottom: '48px' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
//               <div style={{
//                 width: '40px', height: '40px', background: 'var(--accent)',
//                 borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               }}>
//                 <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#111' }}>F</span>
//               </div>
//               <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', color: 'var(--accent)', letterSpacing: '0.06em' }}>FitAI</span>
//             </div>
//             <h1 style={{ margin: '0 0 8px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px', color: 'var(--text)', letterSpacing: '0.04em', lineHeight: 1 }}>
//               Welcome Back
//             </h1>
//             <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>Log in to continue your fitness journey</p>
//           </div>

//           {error && (
//             <div style={{
//               padding: '12px 16px', background: 'rgba(239,68,68,0.1)',
//               border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px',
//               marginBottom: '20px', fontSize: '13px', color: '#f87171',
//             }}>{error}</div>
//           )}

//           <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
//             <div>
//               <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 placeholder="you@example.com"
//                 required
//                 style={{
//                   width: '100%', padding: '12px 16px',
//                   background: 'var(--surface3)', border: '1px solid var(--border)',
//                   borderRadius: '10px', color: 'var(--text)', fontSize: '14px',
//                   outline: 'none', fontFamily: 'DM Sans, sans-serif',
//                 }}
//                 onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
//                 onBlur={e => (e.target.style.borderColor = 'var(--border)')}
//               />
//             </div>
//             <div>
//               <label style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 required
//                 style={{
//                   width: '100%', padding: '12px 16px',
//                   background: 'var(--surface3)', border: '1px solid var(--border)',
//                   borderRadius: '10px', color: 'var(--text)', fontSize: '14px',
//                   outline: 'none', fontFamily: 'DM Sans, sans-serif',
//                 }}
//                 onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
//                 onBlur={e => (e.target.style.borderColor = 'var(--border)')}
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               style={{
//                 marginTop: '8px',
//                 padding: '13px',
//                 background: loading ? 'var(--surface3)' : 'var(--accent)',
//                 color: loading ? 'var(--muted)' : '#111',
//                 border: 'none', borderRadius: '10px',
//                 fontWeight: 700,
//                 cursor: loading ? 'not-allowed' : 'pointer',
//                 fontFamily: 'Bebas Neue, sans-serif',
//                 letterSpacing: '0.1em',
//                 fontSize: '16px',
//                 transition: 'opacity 0.2s',
//               }}
//             >
//               {loading ? 'Logging in...' : 'Log In'}
//             </button>
//           </form>

//           <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }}>
//             No account?{' '}
//             <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
//               Sign up free
//             </Link>
//           </p>
//         </div>
//       </div>

//       {/* Right Panel */}
//       <div style={{
//         flex: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: '60px',
//         background: 'var(--surface)',
//       }}>
//         <div style={{ maxWidth: '380px', textAlign: 'center' }}>
//           <div style={{ fontSize: '72px', marginBottom: '24px' }}>🏋️</div>
//           <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: 'var(--text)', margin: '0 0 12px', letterSpacing: '0.04em' }}>
//             Train Smart.<br /><span style={{ color: 'var(--accent)' }}>Eat Right.</span>
//           </h2>
//           <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7 }}>
//             AI-powered meal plans, workout tracking, and progress analytics — all in one place.
//           </p>
//           <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
//             {['🍽️ AI Meals', '💪 Workouts', '📊 Analytics'].map(tag => (
//               <span key={tag} style={{
//                 padding: '6px 14px', background: 'var(--surface2)',
//                 border: '1px solid var(--border)', borderRadius: '20px',
//                 fontSize: '12px', color: 'var(--muted)',
//               }}>{tag}</span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import loginVideo from "../assets/login-page-video.mp4";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div style={styles.root}>
      {/* ─── LEFT: Login Form ─── */}
      <div style={styles.formPanel}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>F</div>
          <span style={styles.logoText}>FITAI</span>
        </div>

        <div style={styles.formBox}>
          <h1 style={styles.heading}>WELCOME BACK</h1>
          <p style={styles.subheading}>Log in to continue your fitness journey</p>

          {error && <div style={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>EMAIL</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a2a", boxShadow: "none" })}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>PASSWORD</label>
              <div style={styles.passwordWrap}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ ...styles.input, paddingRight: "3rem" }}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a2a", boxShadow: "none" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.loginBtn}>
              {loading ? (
                <span style={styles.spinner} />
              ) : (
                "LOG IN"
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Google SSO placeholder */}
          <button style={styles.googleBtn}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <p style={styles.signupText}>
            No account?{" "}
            <Link to="/signup" style={styles.signupLink}>Sign up free</Link>
          </p>
        </div>
      </div>

      {/* ─── RIGHT: Video Panel ─── */}
      <div style={styles.videoPanel}>
        {/* Fullscreen background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={styles.video}
        >
          <source src={loginVideo} type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div style={styles.overlay} />

        {/* Noise texture overlay */}
        <div style={styles.noise} />

        {/* Content layered over video */}
        <div style={styles.videoContent}>

          {/* ── BOLD QUOTE in the middle ── */}
          <div style={styles.quoteBlock}>
            <div style={styles.quoteBar} />
            <blockquote style={styles.quote}>
              "The body achieves what the mind believes."
            </blockquote>
            <p style={styles.quoteAuthor}>— Napoleon Hill</p>
            <div style={styles.quoteBar} />
          </div>

          {/* ── Hook text below video ── */}
          <div style={styles.hookBlock}>
            <div style={styles.hookBadge}>🔒 LOGIN TO UNLOCK</div>
            <h2 style={styles.hookHeading}>
              Your personal <span style={styles.accent}>AI Coach</span> &amp; <span style={styles.accent}>Meal Planner</span> await.
            </h2>
            <p style={styles.hookSub}>
              Get a workout plan built for your body, and a daily meal guide crafted by AI — personalized, adaptive, and ready the moment you sign in.
            </p>

            {/* Feature pills */}
            <div style={styles.featurePills}>
              {[
                { icon: "🧠", label: "AI Coach", desc: "Real-time guidance" },
                { icon: "🥗", label: "Meal Planner", desc: "Custom macros daily" },
                { icon: "💪", label: "Workouts", desc: "Adaptive programs" },
                { icon: "📊", label: "Analytics", desc: "Track every gain" },
              ].map((f) => (
                <div key={f.label} style={styles.pill}>
                  <span style={styles.pillIcon}>{f.icon}</span>
                  <div>
                    <div style={styles.pillLabel}>{f.label}</div>
                    <div style={styles.pillDesc}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div style={styles.statsStrip}>
            {[
              { value: "50K+", label: "Active Users" },
              { value: "2M+", label: "Workouts Logged" },
              { value: "98%", label: "Goal Achieved" },
            ].map((s) => (
              <div key={s.label} style={styles.stat}>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }

        .fitai-quote  { animation: fadeUp .8s ease both .2s; }
        .fitai-hook   { animation: fadeUp .8s ease both .5s; }
        .fitai-stats  { animation: fadeUp .8s ease both .8s; }
        .fitai-form   { animation: fadeUp .6s ease both; }

        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #1c1c1c inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>
    </div>
  );
}

/* ─── Styles ─── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    background: "#111",
    overflow: "hidden",
  },

  /* ── Form panel ── */
  formPanel: {
    width: "42%",
    minWidth: 380,
    background: "#131313",
    display: "flex",
    flexDirection: "column",
    padding: "2.5rem 3rem",
    position: "relative",
    zIndex: 2,
    borderRight: "1px solid #222",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "2.5rem",
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: "#c8f000",
    color: "#000",
    borderRadius: 8,
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 24,
    color: "#fff",
    letterSpacing: 3,
  },
  formBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: 400,
    animation: "fadeUp .6s ease both",
  },
  heading: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2.6rem",
    color: "#fff",
    letterSpacing: 2,
    lineHeight: 1,
    marginBottom: "0.5rem",
  },
  subheading: {
    color: "#666",
    fontSize: "0.9rem",
    marginBottom: "2rem",
  },
  errorBanner: {
    background: "rgba(255,80,80,0.12)",
    border: "1px solid rgba(255,80,80,0.3)",
    color: "#ff6b6b",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    fontSize: "0.85rem",
    marginBottom: "1rem",
  },
  form: { display: "flex", flexDirection: "column", gap: "1.2rem" },
  field: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: 2,
    color: "#666",
  },
  input: {
    width: "100%",
    background: "#1c1c1c",
    border: "1.5px solid #2a2a2a",
    borderRadius: 10,
    padding: "0.85rem 1rem",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color .2s, box-shadow .2s",
  },
  inputFocus: {
    borderColor: "#c8f000",
    boxShadow: "0 0 0 3px rgba(200,240,0,0.1)",
  },
  passwordWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: "0.8rem",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    color: "#666",
  },
  loginBtn: {
    marginTop: "0.5rem",
    background: "#c8f000",
    color: "#000",
    border: "none",
    borderRadius: 10,
    padding: "0.95rem",
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.1rem",
    letterSpacing: 3,
    cursor: "pointer",
    transition: "transform .15s, box-shadow .15s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  spinner: {
    width: 20,
    height: 20,
    border: "2.5px solid rgba(0,0,0,0.2)",
    borderTop: "2.5px solid #000",
    borderRadius: "50%",
    animation: "spin .7s linear infinite",
    display: "inline-block",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    margin: "1.5rem 0",
  },
  dividerLine: { flex: 1, height: 1, background: "#272727" },
  dividerText: { color: "#555", fontSize: "0.8rem" },
  googleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    background: "transparent",
    border: "1.5px solid #2a2a2a",
    borderRadius: 10,
    padding: "0.85rem",
    color: "#ccc",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "border-color .2s, background .2s",
    marginBottom: "1.5rem",
  },
  signupText: { textAlign: "center", color: "#555", fontSize: "0.88rem" },
  signupLink: {
    color: "#c8f000",
    fontWeight: 600,
    textDecoration: "none",
  },

  /* ── Video panel ── */
  videoPanel: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  video: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.9) 100%)",
    zIndex: 1,
  },
  noise: {
    position: "absolute",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    backgroundSize: "200px",
    zIndex: 2,
    opacity: 0.4,
    pointerEvents: "none",
  },
  videoContent: {
    position: "relative",
    zIndex: 3,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "3rem 3.5rem",
    gap: "2.5rem",
  },

  /* ── Quote ── */
  quoteBlock: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
    animation: "fadeUp .8s ease both .2s",
  },
  quoteBar: {
    width: 60,
    height: 2,
    background: "#c8f000",
    borderRadius: 2,
  },
  quote: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)",
    color: "#fff",
    letterSpacing: 1.5,
    lineHeight: 1.2,
    maxWidth: 520,
    fontStyle: "normal",
  },
  quoteAuthor: {
    color: "#c8f000",
    fontSize: "0.8rem",
    letterSpacing: 3,
    fontWeight: 600,
  },

  /* ── Hook ── */
  hookBlock: {
    textAlign: "center",
    animation: "fadeUp .8s ease both .5s",
    maxWidth: 540,
  },
  hookBadge: {
    display: "inline-block",
    background: "rgba(200,240,0,0.12)",
    border: "1px solid rgba(200,240,0,0.3)",
    color: "#c8f000",
    borderRadius: 999,
    padding: "0.3rem 1rem",
    fontSize: "0.7rem",
    letterSpacing: 3,
    fontWeight: 700,
    marginBottom: "1rem",
  },
  hookHeading: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
    color: "#fff",
    letterSpacing: 1,
    lineHeight: 1.2,
    marginBottom: "0.75rem",
  },
  accent: { color: "#c8f000" },
  hookSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "0.88rem",
    lineHeight: 1.7,
    marginBottom: "1.5rem",
  },

  /* ── Feature pills ── */
  featurePills: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
  },
  pill: {
    display: "flex",
    alignItems: "center",
    gap: "0.7rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "0.7rem 1rem",
    backdropFilter: "blur(8px)",
    textAlign: "left",
  },
  pillIcon: { fontSize: "1.4rem" },
  pillLabel: {
    color: "#fff",
    fontSize: "0.82rem",
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  pillDesc: { color: "#888", fontSize: "0.72rem" },

  /* ── Stats ── */
  statsStrip: {
    display: "flex",
    gap: "2.5rem",
    animation: "fadeUp .8s ease both .8s",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    paddingTop: "1.5rem",
    width: "100%",
    justifyContent: "center",
  },
  stat: { textAlign: "center" },
  statValue: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "2rem",
    color: "#c8f000",
    letterSpacing: 2,
    lineHeight: 1,
  },
  statLabel: { color: "#666", fontSize: "0.72rem", letterSpacing: 1.5, marginTop: 4 },
};