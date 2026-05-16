// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { Check } from 'lucide-react';

interface ProfileForm {
  name:   string;
  age:    string;
  weight: string;
  goal:   string;
}

export default function Profile() {
  const [email,   setEmail]   = useState('');
  const [userId,  setUserId]  = useState('');
  const [form,    setForm]    = useState<ProfileForm>({ name: '', age: '', weight: '', goal: '' });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email || '');
      setUserId(user.id);

      const { data } = await supabase
        .from('profiles')
        .select('full_name, age, weight_kg, goal')
        .eq('id', user.id)
        .single();

      if (data) {
        setForm({
          name:   data.full_name  ?? '',
          age:    data.age        ? String(data.age)        : '',
          weight: data.weight_kg  ? String(data.weight_kg)  : '',
          goal:   data.goal       ?? '',
        });
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    if (!userId || saving) return;
    setError('');
    setSaving(true);
    const { error: err } = await supabase
      .from('profiles')
      .upsert({
        id:         userId,
        full_name:  form.name   || null,
        age:        form.age    ? Number(form.age)    : null,
        weight_kg:  form.weight ? Number(form.weight) : null,
        goal:       form.goal   || null,
      });
    setSaving(false);
    if (err) {
      setError('Failed to save. Try again.');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '12px 16px',
    background: 'var(--surface3)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text)', fontSize: '14px',
    outline: 'none', fontFamily: "'DM Sans', sans-serif",
  };

  const initial  = (form.name || email).charAt(0).toUpperCase() || 'U';
  const username = form.name || email.split('@')[0] || 'Your Name';

  return (
    <div style={{ padding: '28px 24px', maxWidth: 520, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          margin: '0 0 4px',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '36px', letterSpacing: '0.04em',
          color: 'var(--text)', lineHeight: 1,
        }}>
          Your <span style={{ color: 'var(--accent)' }}>Profile</span>
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
          Manage your personal info
        </p>
      </div>

      {/* Avatar card */}
      <div style={{
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '22px',
        display: 'flex', alignItems: 'center', gap: '16px',
        marginBottom: '14px',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: 700, color: '#111',
          fontFamily: "'Bebas Neue', sans-serif", flexShrink: 0,
        }}>
          {initial}
        </div>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
            {loading ? '—' : username}
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

      {/* Form card */}
      <div style={{
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '22px',
        display: 'flex', flexDirection: 'column', gap: '14px',
      }}>
        {([
          { label: 'Full Name',   key: 'name',   placeholder: 'Enter your name', type: 'text'   },
          { label: 'Age',         key: 'age',    placeholder: 'e.g. 22',         type: 'number' },
          { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 70',         type: 'number' },
        ] as const).map(field => (
          <div key={field.key}>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key]}
              disabled={loading}
              onChange={e => setForm({ ...form, [field.key]: e.target.value })}
              style={{ ...inputStyle, opacity: loading ? 0.5 : 1 }}
              onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
            />
          </div>
        ))}

        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Fitness Goal
          </label>
          <select
            value={form.goal}
            disabled={loading}
            onChange={e => setForm({ ...form, goal: e.target.value })}
            style={{ ...inputStyle, opacity: loading ? 0.5 : 1 }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
          >
            <option value="">Select goal</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Maintain">Maintain</option>
          </select>
        </div>

        {error && (
          <p style={{
            margin: 0, fontSize: '13px', color: '#f87171',
            padding: '10px 14px', background: 'rgba(239,68,68,0.08)',
            borderRadius: '8px', border: '1px solid rgba(239,68,68,0.15)',
          }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={loading || saving}
          style={{
            marginTop: '4px', padding: '13px',
            background: saved ? 'rgba(200,241,53,0.15)' : 'var(--accent)',
            color:      saved ? 'var(--accent)' : '#111',
            border:     saved ? '1px solid rgba(200,241,53,0.3)' : 'none',
            borderRadius: '12px',
            fontSize: '16px', fontWeight: 700,
            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em',
            cursor: loading || saving ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s', opacity: loading ? 0.5 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {saving ? 'Saving…' : saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}