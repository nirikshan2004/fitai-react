import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabase/client';
import Footer from './Footer';
import {
  Brain, LayoutDashboard, Utensils, Dumbbell, User,
  Activity, LogOut, Scale, Menu, X, Bell, ChevronRight,
} from 'lucide-react';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email || '');
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/meal-planner', icon: Utensils, label: 'Meal Planner' },
    { path: '/workout-tracker', icon: Dumbbell, label: 'Workout Tracker' },
    { path: '/progress', icon: Activity, label: 'Progress' },
    { path: '/bmi', icon: Scale, label: 'BMI' },
    { path: '/ai-coach', icon: Brain, label: 'AI Coach' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const username = userEmail.split('@')[0] || 'User';
  const initial = username.charAt(0).toUpperCase();
  const currentLabel = navItems.find(i => i.path === location.pathname)?.label || 'Dashboard';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '240px' : '72px',
        minHeight: '100vh',
        background: 'var(--surface2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s ease',
        position: 'fixed',
        top: 0, left: 0, zIndex: 50,
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', borderBottom: '1px solid var(--border)', minHeight: '64px',
        }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#111' }}>F</span>
              </div>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: 'var(--accent)', letterSpacing: '0.06em' }}>FitAI</span>
            </div>
          ) : (
            <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#111' }}>F</span>
            </div>
          )}
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Toggle when collapsed */}
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '16px', display: 'flex', justifyContent: 'center' }}>
            <Menu size={18} />
          </button>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                title={!sidebarOpen ? label : undefined}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: sidebarOpen ? '10px 14px' : '10px',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  borderRadius: '10px', border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(200,241,53,0.1)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--muted)',
                  transition: 'all 0.15s', fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface3)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'; }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'; } }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>}
                {sidebarOpen && active && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
          {sidebarOpen ? (
            <div style={{ marginBottom: '8px', padding: '10px 14px', background: 'var(--surface3)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#111', flexShrink: 0 }}>{initial}</div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{username}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>Member</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#111' }}>{initial}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : undefined}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: 'transparent', color: '#ef4444',
              fontSize: '14px', fontFamily: 'DM Sans, sans-serif', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: sidebarOpen ? '240px' : '72px', flex: 1, transition: 'margin-left 0.25s ease', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{
          height: '64px', background: 'var(--surface2)', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', position: 'sticky', top: 0, zIndex: 40,
        }}>
          <h2 style={{ margin: 0, fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '0.06em', color: 'var(--text)' }}>
            {currentLabel}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--muted)', position: 'relative' }}>
              <Bell size={16} />
              <span style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#111' }}>{initial}</div>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{username}</p>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>Member</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}