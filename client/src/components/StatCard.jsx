import { motion } from 'framer-motion';

export const StatCard = ({ icon, label, value, color = '#6366f1', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass"
    style={{
      borderRadius: 16,
      padding: '24px 28px',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
    }}
  >
    {/* Glow accent */}
    <div style={{
      position: 'absolute', top: -30, right: -30,
      width: 100, height: 100, borderRadius: '50%',
      background: color, opacity: 0.08, filter: 'blur(20px)',
    }} />

    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
          {label}
        </p>
        <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
          {value}
        </p>
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `${color}20`,
        border: `1px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>
        {icon}
      </div>
    </div>
  </motion.div>
);
