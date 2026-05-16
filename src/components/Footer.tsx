export default function Footer() {
  return (
    <footer style={{
      padding: '16px 28px',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '22px', height: '22px',
          background: 'var(--accent)',
          borderRadius: '6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '13px', color: '#111' }}>F</span>
        </div>
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: 'var(--accent)', letterSpacing: '0.06em' }}>FitAI</span>
      </div>
      <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
        © {new Date().getFullYear()} FitAI.Powered By Nani All rights reserved.
      </p>
      <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
        Built for your best self 💪
      </p>
    </footer>
  )
}