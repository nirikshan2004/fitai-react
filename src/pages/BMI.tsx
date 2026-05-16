// src/pages/BMI.tsx
import { useState } from 'react';

export default function BMI() {
  const [form, setForm] = useState({ height: '', weight: '' });
  const [bmi,  setBmi]  = useState<number | null>(null);

  const calculate = () => {
    const h = parseFloat(form.height) / 100;
    const w = parseFloat(form.weight);
    if (!h || !w) return;
    setBmi(parseFloat((w / (h * h)).toFixed(1)));
  };

  const getCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight',   color: '#3b82f6',       emoji: '🔵' };
    if (bmi < 25)   return { label: 'Normal Weight',  color: 'var(--accent)', emoji: '✅' };
    if (bmi < 30)   return { label: 'Overweight',     color: '#f97316',       emoji: '🟠' };
    return           { label: 'Obese',           color: '#ef4444',       emoji: '🔴' };
  };

  const getGaugePercent = (bmi: number) =>
    Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100);

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '12px 16px',
    background: 'var(--surface3)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    color: 'var(--text)', fontSize: '14px',
    outline: 'none', fontFamily: "'DM Sans', sans-serif",
  };

  const cat = bmi !== null ? getCategory(bmi) : null;

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
          BMI <span style={{ color: 'var(--accent)' }}>Calculator</span>
        </h1>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
          Check your Body Mass Index
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '22px',
        display: 'flex', flexDirection: 'column', gap: '14px',
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Height (cm)
          </label>
          <input
            type="number" placeholder="e.g. 175"
            value={form.height}
            onChange={e => setForm({ ...form, height: e.target.value })}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Weight (kg)
          </label>
          <input
            type="number" placeholder="e.g. 70"
            value={form.weight}
            onChange={e => setForm({ ...form, weight: e.target.value })}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <button
          onClick={calculate}
          style={{
            padding: '13px',
            background: 'var(--accent)',
            color: '#111', border: 'none',
            borderRadius: '12px',
            fontSize: '16px', fontWeight: 700,
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: '0.1em', cursor: 'pointer',
            transition: 'opacity .2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Calculate BMI
        </button>

        {bmi !== null && cat && (
          <div style={{
            marginTop: '4px', padding: '22px',
            background: 'var(--surface3)',
            borderRadius: '14px', border: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            {/* BMI number */}
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '72px', color: cat.color,
              letterSpacing: '0.02em', lineHeight: 1,
              display: 'block', marginBottom: '6px',
            }}>
              {bmi}
            </span>

            <p style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: 600, color: cat.color }}>
              {cat.emoji} {cat.label}
            </p>

            {/* Gauge */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                height: '8px', background: 'var(--surface2)',
                borderRadius: '4px', overflow: 'visible',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%',
                  background: 'linear-gradient(to right, #3b82f6 0%, #22c55e 30%, #f97316 60%, #ef4444 100%)',
                  borderRadius: '4px',
                }} />
                <div style={{
                  position: 'absolute', top: '-3px',
                  left: `${getGaugePercent(bmi)}%`,
                  transform: 'translateX(-50%)',
                  width: '14px', height: '14px',
                  background: 'white', borderRadius: '50%',
                  border: `2px solid ${cat.color}`,
                  transition: 'left .5s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: 'var(--muted)' }}>
                <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>
            </div>

            {/* Range reference */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', textAlign: 'left' }}>
              {[
                { label: 'Underweight', range: '< 18.5',      color: '#3b82f6' },
                { label: 'Normal',      range: '18.5 – 24.9', color: 'var(--accent)' },
                { label: 'Overweight',  range: '25 – 29.9',   color: '#f97316' },
                { label: 'Obese',       range: '≥ 30',        color: '#ef4444' },
              ].map(r => (
                <div key={r.label} style={{
                  padding: '8px 12px',
                  background: 'var(--surface2)',
                  borderRadius: '8px',
                  borderLeft: `3px solid ${r.color}`,
                }}>
                  <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 600, color: r.color }}>{r.label}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted)' }}>{r.range}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}