export const LoadingSkeleton = ({ rows = 5 }) => (
  <div style={{ padding: '8px 0' }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
        gap: 16,
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div className="skeleton" style={{ height: 18, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 18, borderRadius: 6, width: 80 }} />
        <div className="skeleton" style={{ height: 18, borderRadius: 6, width: 90 }} />
        <div className="skeleton" style={{ height: 18, borderRadius: 6, width: 70 }} />
        <div className="skeleton" style={{ height: 18, borderRadius: 6, width: 80 }} />
      </div>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
    <div className="skeleton" style={{ height: 14, width: 80, marginBottom: 12 }} />
    <div className="skeleton" style={{ height: 32, width: 60, marginBottom: 8 }} />
    <div className="skeleton" style={{ height: 12, width: 120 }} />
  </div>
);
