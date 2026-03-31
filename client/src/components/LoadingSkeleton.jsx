export const LoadingSkeleton = ({ rows = 5 }) => (
  <div style={{ padding: '8px 0' }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 2fr) 1fr 100px',
        gap: 16,
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="skeleton" style={{ height: 18, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 18, borderRadius: 6, width: '60%' }} />
        <div className="skeleton" style={{ height: 24, borderRadius: 12, width: 80 }} />
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
