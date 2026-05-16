// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { Check } from 'lucide-react';

export default function Profile() {
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({ name: '', age: '', weight: '', goal: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || '');
    });
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--surface3)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text)', fontSize: '14px',
    outline: 'none', fontFamily: 'DM Sans, sans-serif',
  };

  const initial = email.charAt(0).toUpperCase() || 'U';
  const username = email.split('@')[0] || 'Your Name';

  return (
    <div style={{ maxWidth: '500px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: '0 0 4px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '40px', letterSpacing: '0.04em', color: 'var(--text)' }}>
          Your <span style={{ color: 'var(--accent)' }}>Profile</span>
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>Manage your personal info</p>
      </div>

      {/* Avatar Card */}
      <div style={{
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '24px',
        display: 'flex', alignItems: 'center', gap: '16px',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: 700, color: '#111',
          fontFamily: 'Bebas Neue, sans-serif', flexShrink: 0,
        }}>{initial}</div>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
            {form.name || username}
          </p>
          <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--muted)' }}>{email}</p>
          <span style={{
            fontSize: '11px', padding: '3px 10px',
            background: 'rgba(200,241,53,0.1)',
            border: '1px solid rgba(200,241,53,0.2)',
            borderRadius: '20px', color: 'var(--accent)',
          }}>
            {form.goal || 'No goal set'}
          </span>
        </div>
      </div>

      {/* Form */}
      <div style={{
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '28px',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        {[
          { label: 'Full Name', key: 'name', placeholder: 'Enter your name', type: 'text' },
          { label: 'Age', key: 'age', placeholder: 'e.g. 22', type: 'number' },
          { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 70', type: 'number' },
        ].map(field => (
          <div key={field.key}>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key as keyof typeof form]}
              onChange={e => setForm({ ...form, [field.key]: e.target.value })}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
        ))}

        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Fitness Goal
          </label>
          <select
            value={form.goal}
            onChange={e => setForm({ ...form, goal: e.target.value })}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          >
            <option value="">Select goal</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Maintain">Maintain</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          style={{
            marginTop: '4px', padding: '13px',
            background: saved ? 'rgba(200,241,53,0.15)' : 'var(--accent)',
            color: saved ? 'var(--accent)' : '#111',
            border: saved ? '1px solid rgba(200,241,53,0.3)' : 'none',
            borderRadius: '10px',
            fontSize: '16px', fontWeight: 700,
            fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em',
            cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}