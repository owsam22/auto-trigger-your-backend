export const StatusBadge = ({ status }) => {
  const map = {
    pending:  { label: 'Pending',  cls: 'badge-pending'  },
    approved: { label: 'Approved', cls: 'badge-approved' },
    rejected: { label: 'Rejected', cls: 'badge-rejected' },
    unstable: { label: 'Unstable', cls: 'badge-unstable' },
    success:  { label: 'Success',  cls: 'badge-success'  },
    fail:     { label: 'Failed',   cls: 'badge-fail'     },
  };
  const { label, cls } = map[status] || { label: status || '—', cls: 'badge-pending' };
  return (
    <span
      className={cls}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: 'currentColor', opacity: 0.8, flexShrink: 0
      }} />
      {label}
    </span>
  );
};
