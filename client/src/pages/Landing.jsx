import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Shield, BarChart3, Clock, CheckCircle, ArrowRight, Globe, AlertCircle } from 'lucide-react';
import Button from '../components/button';
import { Footer } from '../components/Footer';

const features = [
  {
    icon: <Zap size={24} color="#6366f1" />,
    bg: 'rgba(99,102,241,0.1)',
    border: 'rgba(99,102,241,0.2)',
    title: 'Keep it Warm',
    desc: 'Never let your backend fall asleep. Use regular pulses to bypass free-tier inactivity limits and eliminate cold starts.',
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

const FeatureTicker = () => (
  <div className="ticker-wrap">
    <div className="ticker-content">
      {[ 'Auto-Triggering', 'Uptime monitoring', 'Fraud detection', 'Real-time approval', 'Zero Manual error', 'Admin Dashboard', 'Instant pings', '24/7 Monitoring' ].map((item, i) => (
        <div key={i} className="ticker-item">
          <div className="ticker-dot" />
          {item}
        </div>
      ))}
      {[ 'Auto-Triggering', 'Uptime monitoring', 'Fraud detection', 'Real-time approval', 'Zero Manual error', 'Admin Dashboard', 'Instant pings', '24/7 Monitoring' ].map((item, i) => (
        <div key={`d-${i}`} className="ticker-item">
          <div className="ticker-dot" />
          {item}
        </div>
      ))}
    </div>
  </div>
);

const DashboardPreview = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.8 }}
    className="glass"
    style={{
      padding: 'clamp(20px, 5vw, 32px)',
      borderRadius: 32,
      width: '100%',
      maxWidth: 500,
      background: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      boxShadow: '0 25px 50px -12px rgba(139, 92, 246, 0.15)',
      position: 'relative'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: 'var(--accent-purple)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={16} color="white" fill="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Pulse AI</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1,2,3].map(i => <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i===3 ? '#8b5cf6' : '#ddd', opacity: i===3 ? 1 : 0.4 }} />)}
      </div>
    </div>

    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>120</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>requests today</div>
    </div>

    {/* Mock Graph */}
    <div style={{ position: 'relative', height: 120, marginBottom: 20 }}>
      <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,80 Q50,75 100,60 T200,40 T300,70 T400,30" fill="transparent" stroke="#8b5cf6" strokeWidth="3" />
        <path d="M0,80 Q50,75 100,60 T200,40 T300,70 T400,30 L400,100 L0,100 Z" fill="url(#lineGrad)" />
        <circle cx="400" cy="30" r="4" fill="#8b5cf6" />
      </svg>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: '#8b5cf6', opacity: 0.2 + (i*0.2) }} />)}
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }} />
        Requests IA  30:43 +0
      </div>
    </div>
  </motion.div>
);


const StatusPulse = () => {
  const [hasError, setHasError] = useState(false);
  const gifUrl = "https://i.pinimg.com/originals/71/65/88/71658839bb2fea95bdbc036076e9324b.gif";

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {!hasError ? (
        <img 
          src={gifUrl} 
          alt="Live" 
          style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
          onError={() => setHasError(true)}
        />
      ) : (
        <>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-purple)', zIndex: 2 }} />
          {[0, 1, 2].map(i => (
            <motion.div 
              key={i}
              animate={{ scale: [1, 3], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: i * 0.6 }}
              style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-purple)', zIndex: 1 }} 
            />
          ))}
        </>
      )}
    </div>
  );
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section style={{ 
        position: 'relative', 
        padding: '20px 24px 10px', 
        overflow: 'hidden',
        /* Grid Stroke Pattern */
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center'
      }}>
        {/* Background Blobs (Softened) */}
        <div className="orb" style={{ width: 600, height: 600, background: 'rgba(139, 92, 246, 0.05)', top: -200, right: '-10%', filter: 'blur(140px)' }} />
        <div className="orb" style={{ width: 400, height: 400, background: 'rgba(99, 102, 241, 0.05)', bottom: 30, left: '-5%', filter: 'blur(120px)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 40, alignItems: 'center' }}>
          
          {/* Left Column */}
          <div style={{ textAlign: 'left' }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: 999, padding: '6px 18px', marginBottom: 28,
                fontSize: 13, color: 'var(--accent-purple)', fontWeight: 600,
              }}
            >
              <StatusPulse />
              Active Monitoring · Always Awake
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              style={{ fontSize: 'clamp(36px, 8vw, 84px)', fontWeight: 900, lineHeight: 1.1,
                letterSpacing: '-0.04em', marginBottom: 32, color: 'var(--text-primary)' }}
            >
              Keep Your Backend<br />
              <span style={{ color: 'var(--accent-purple)' }}>Alive Automatically</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 540,
                marginBottom: 32, lineHeight: 1.6 }}
            >
              Transform your free-tier backend experience with automated pulse verification, 
              real-time notifications, and zero downtime triggers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
            >
              <Button
                as={Link}
                to={user ? '/dashboard' : '/auth'}
                style={{
                  borderRadius: 100, padding: '16px 40px', fontSize: 16,
                  background: 'white', color: 'var(--accent-purple)',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}
              >
                {user ? 'Dashboard' : 'Sign In Now'}
                <ArrowRight size={18} />
              </Button>
              <Button
                as={Link}
                to="/auth"
                variant="primary"
                style={{
                  borderRadius: 100, padding: '16px 40px', fontSize: 16,
                }}
              >
                Get Started Free
              </Button>
            </motion.div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <DashboardPreview />
          </div>
        </div>
      </section>

      <FeatureTicker />

      {/* Features */}
      <section style={{ padding: '120px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 80 }}
        >
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 40px)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Everything you need to stay <span style={{ color: 'var(--accent-purple)' }}>Online</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18 }}>
            Purpose-built for developers on free-tier hosting platforms.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 32 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass"
              style={{ borderRadius: 24, padding: 40, background: 'rgba(255,255,255,0.4)', transition: 'all 0.3s' }}
              whileHover={{ y: -8, background: 'rgba(255,255,255,0.7)' }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: f.bg, border: `1px solid ${f.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '100px 24px', background: 'rgba(139, 92, 246, 0.02)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 40px)', fontWeight: 900, letterSpacing: '-0.02em' }}>
              How it <span style={{ color: 'var(--accent-purple)' }}>works</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 40 }}>
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  fontSize: 64, fontWeight: 900, color: 'var(--accent-purple)', opacity: 0.1, marginBottom: -40,
                }}>{s.num}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, position: 'relative' }}>{s.title}</h3>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass"
          style={{
            maxWidth: 800, margin: '0 auto', borderRadius: 40,
            padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 40px)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
          }}
        >
          <Globe size={48} color="#8b5cf6" style={{ marginBottom: 24, opacity: 0.8 }} />
          <h2 style={{ fontSize: 'clamp(32px, 6vw, 42px)', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.03em' }}>
            Start monitoring today
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 40, fontSize: 18, maxWidth: 500, margin: '0 auto 40px' }}>
            Never let your backend fall asleep again. Free to use, no credit card required.
          </p>
          <Button
            as={Link}
            to={user ? '/dashboard' : '/auth'}
            variant="primary"
            style={{
              padding: '18px 60px', borderRadius: 100, fontSize: 18,
            }}
          >
            {user ? 'Go to Dashboard' : 'Create Free Account'}
            <ArrowRight size={20} />
          </Button>
        </motion.div>
      </section>

      <Footer variant="detailed" />
    </div>
  );
}
