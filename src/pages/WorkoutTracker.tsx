import { useState } from 'react';

const defaultExercises = [
  { name: 'Push Ups', sets: '3', reps: '15', done: false },
  { name: 'Squats', sets: '3', reps: '20', done: false },
  { name: 'Plank', sets: '3', reps: '60s', done: false },
]

export default function WorkoutTracker() {
  const [exercises, setExercises] = useState(defaultExercises)
  const [form, setForm] = useState({ name: '', sets: '', reps: '' })

  const toggleDone = (index: number) => {
    setExercises(exercises.map((e, i) =>
      i === index ? { ...e, done: !e.done } : e
    ))
  }

  const addExercise = () => {
    if (!form.name || !form.sets || !form.reps) return
    setExercises([...exercises, { ...form, done: false }])
    setForm({ name: '', sets: '', reps: '' })
  }

  const completed = exercises.filter((e) => e.done).length

  return (
    <div style={{ maxWidth: '640px' }}>
      <h1 style={{ margin: '0 0 4px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', letterSpacing: '0.04em', color: 'var(--text)' }}>
        Workout Tracker 💪
      </h1>
      <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--muted)' }}>
        {completed} / {exercises.length} exercises done
      </p>

      {/* Progress bar */}
      <div style={{ width: '100%', background: 'var(--surface3)', borderRadius: '99px', height: '6px', marginBottom: '28px' }}>
        <div style={{
          height: '6px',
          borderRadius: '99px',
          background: 'var(--accent)',
          width: `${exercises.length ? (completed / exercises.length) * 100 : 0}%`,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Exercise list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
        {exercises.map((ex, i) => (
          <div
            key={i}
            onClick={() => toggleDone(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 16px',
              borderRadius: '12px',
              border: `1px solid ${ex.done ? 'rgba(200,241,53,0.3)' : 'var(--border)'}`,
              background: ex.done ? 'rgba(200,241,53,0.06)' : 'var(--surface2)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {/* Checkbox */}
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${ex.done ? 'var(--accent)' : 'var(--border)'}`,
              background: ex.done ? 'var(--accent)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              {ex.done && <span style={{ fontSize: '11px', color: '#111', fontWeight: 700 }}>✓</span>}
            </div>
            <div>
              <p style={{
                margin: 0, fontSize: '14px', fontWeight: 600,
                color: ex.done ? 'var(--muted)' : 'var(--text)',
                textDecoration: ex.done ? 'line-through' : 'none',
              }}>{ex.name}</p>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>{ex.sets} sets × {ex.reps}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add exercise */}
      <div style={{
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '20px',
      }}>
        <p style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Add Exercise</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            placeholder="Exercise name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '9px 12px', borderRadius: '10px',
              border: '1px solid var(--border)', background: 'var(--surface3)',
              color: 'var(--text)', fontSize: '14px', outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input
              placeholder="Sets"
              value={form.sets}
              onChange={(e) => setForm({ ...form, sets: e.target.value })}
              style={{
                padding: '9px 12px', borderRadius: '10px',
                border: '1px solid var(--border)', background: 'var(--surface3)',
                color: 'var(--text)', fontSize: '14px', outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
            <input
              placeholder="Reps"
              value={form.reps}
              onChange={(e) => setForm({ ...form, reps: e.target.value })}
              style={{
                padding: '9px 12px', borderRadius: '10px',
                border: '1px solid var(--border)', background: 'var(--surface3)',
                color: 'var(--text)', fontSize: '14px', outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
          </div>
          <button
            onClick={addExercise}
            style={{
              padding: '10px', borderRadius: '10px', border: 'none',
              background: 'var(--accent)', color: '#111',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            + Add Exercise
          </button>
        </div>
      </div>
    </div>
  )
}