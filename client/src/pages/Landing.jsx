import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Shield, BarChart3, Clock, CheckCircle, ArrowRight, Globe } from 'lucide-react';

const features = [
  {
    icon: <Zap size={24} color="#6366f1" />,
    bg: 'rgba(99,102,241,0.1)',
    border: 'rgba(99,102,241,0.2)',
    title: 'Auto-Triggering',
    desc: 'Your backend URLs are pinged every 10 minutes automatically, keeping free-tier servers warm and responsive.',
  },
  {
    icon: <BarChart3 size={24} color="#8b5cf6" />,
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.2)',
    title: 'Uptime Monitoring',
    desc: 'Track success/failure rates, last trigger time, and detect unstable endpoints before they impact your users.',
  },
  {
    icon: <Shield size={24} color="#06b6d4" />,
    bg: 'rgba(6,182,212,0.1)',
    border: 'rgba(6,182,212,0.2)',
    title: 'Admin Approval',
    desc: 'Every URL goes through a manual review process, ensuring only legitimate backends are monitored.',
  },
];

const steps = [
  { num: '01', title: 'Submit Your URL', desc: 'Register and submit your backend endpoint URL for monitoring.' },
  { num: '02', title: 'Admin Reviews',    desc: 'Our admin verifies the submission and approves it.' },
  { num: '03', title: 'Auto-Triggered',   desc: 'The system pings your URL every 10 minutes, 24/7.' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div className="orb" style={{ width: 500, height: 500, background: '#6366f1', opacity: 0.06, top: -100, left: '10%' }} />
        <div className="orb" style={{ width: 400, height: 400, background: '#8b5cf6', opacity: 0.06, top: -50, right: '10%', animationDelay: '2s' }} />
        <div className="orb" style={{ width: 300, height: 300, background: '#06b6d4', opacity: 0.05, bottom: -50, left: '40%', animationDelay: '4s' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 999, padding: '6px 18px', marginBottom: 32,
              fontSize: 13, color: '#a5b4fc', fontWeight: 500,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1',
              boxShadow: '0 0 8px #6366f1', animation: 'float 2s ease-in-out infinite' }} />
            Live monitoring system · Zero downtime
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{ fontSize: 'clamp(36px,5vw,72px)', fontWeight: 900, lineHeight: 1.08,
              letterSpacing: '-0.03em', marginBottom: 24, color: 'var(--text-primary)' }}
          >
            Keep Your Backend<br />
            <span className="gradient-text">Alive Automatically</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 540,
              margin: '0 auto 40px', lineHeight: 1.7 }}
          >
            TriggerPulse automatically pings your backend APIs every 10 minutes so they never go cold.
            Submit, get approved, and stay online—effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              to={user ? '/dashboard' : '/auth'}
              className="btn-gradient"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 12, fontSize: 15,
                fontWeight: 700, textDecoration: 'none', color: 'white',
              }}
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/auth"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                textDecoration: 'none', color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Sign In
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              display: 'flex', gap: 32, justifyContent: 'center', marginTop: 60,
              flexWrap: 'wrap',
            }}
          >
            {[['10min', 'Trigger Interval'], ['99.9%', 'Uptime Target'], ['5s', 'Request Timeout']].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{lbl}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Everything you need to stay <span className="gradient-text">online</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
            Purpose-built for developers on free-tier hosting platforms.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass"
              style={{ borderRadius: 20, padding: 28, transition: 'transform 0.2s, border-color 0.2s' }}
              whileHover={{ y: -4 }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: f.bg, border: `1px solid ${f.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
              How it <span className="gradient-text">works</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Up and running in under 2 minutes.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{ textAlign: 'center', padding: '28px 20px' }}
              >
                <div className="gradient-text" style={{
                  fontSize: 42, fontWeight: 900, marginBottom: 12, display: 'block',
                }}>{s.num}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass"
          style={{
            maxWidth: 640, margin: '0 auto', borderRadius: 24,
            padding: '56px 40px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <Globe size={36} color="#6366f1" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>
            Start monitoring today
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, lineHeight: 1.7 }}>
            Never let your backend fall asleep again. Free to use, no credit card required.
          </p>
          <Link
            to={user ? '/dashboard' : '/auth'}
            className="btn-gradient"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 36px', borderRadius: 12, fontSize: 15,
              fontWeight: 700, textDecoration: 'none', color: 'white',
            }}
          >
            {user ? 'Go to Dashboard' : 'Create Free Account'}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '24px',
        textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13,
      }}>
        © {new Date().getFullYear()} TriggerPulse · Built to keep backends alive
      </footer>
    </div>
  );
}
