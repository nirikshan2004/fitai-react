import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const weightData = [
  { day: 'Mon', weight: 78 },
  { day: 'Tue', weight: 77.5 },
  { day: 'Wed', weight: 77.8 },
  { day: 'Thu', weight: 77 },
  { day: 'Fri', weight: 76.5 },
  { day: 'Sat', weight: 76.2 },
  { day: 'Sun', weight: 75.9 },
]

const stats = [
  { label: 'Current Weight', value: '75.9 kg', icon: '⚖️' },
  { label: 'Calories Today', value: '1,840', icon: '🔥' },
  { label: 'Workouts This Week', value: '4', icon: '💪' },
  { label: 'Streak', value: '7 days', icon: '🔥' },
]

export default function Progress() {
  return (
    <div style={{ maxWidth: '720px' }}>
      <h1 style={{ margin: '0 0 4px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: 'var(--text)' }}>
        Progress 📈
      </h1>
      <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'var(--muted)' }}>Track your fitness journey</p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px' }}>
            <p style={{ margin: '0 0 6px', fontSize: '22px' }}>{s.icon}</p>
            <p style={{ margin: '0 0 2px', fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Weight chart */}
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
        <p style={{ margin: '0 0 16px', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Weight This Week</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weightData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--muted)' }} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="weight" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}