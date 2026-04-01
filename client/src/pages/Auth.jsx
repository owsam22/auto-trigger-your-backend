import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Button from '../components/button';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('All fields are required');

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, { email, password });
      login(data.user, data.token);
      toast.success(mode === 'login' ? '👋 Welcome back!' : '🎉 Account created!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex',
      flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div className="orb" style={{ width: 400, height: 400, background: '#6366f1', opacity: 0.07, top: '10%', left: '15%' }} />
      <div className="orb" style={{ width: 300, height: 300, background: '#8b5cf6', opacity: 0.07, bottom: '10%', right: '15%', animationDelay: '3s' }} />

      <div style={{ 
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', 
        padding: '40px 24px', position: 'relative', zIndex: 1 
      }}>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="glass"
          style={{
            width: '100%', maxWidth: 420, borderRadius: 24,
            padding: '40px 36px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            position: 'relative',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Back button */}
          <Link to="/" style={{ 
            display: 'flex', alignItems: 'center', gap: 6, 
            fontSize: 13, color: 'var(--text-secondary)', 
            textDecoration: 'none', marginBottom: 24,
            fontWeight: 500, transition: 'color 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, background: 'var(--gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            }}>
              <Zap size={26} color="white" fill="white" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {mode === 'login'
                ? 'Sign in to your TriggerPulse account'
                : 'Start keeping your backends alive today'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500,
                color: 'var(--text-secondary)', marginBottom: 7 }}>Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)', pointerEvents: 'none',
                }} />
                <input
                  className="input-dark"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: 36 }}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500,
                color: 'var(--text-secondary)', marginBottom: 7 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)', pointerEvents: 'none',
                }} />
                <input
                  className="input-dark"
                  type={showPass ? 'text' : 'password'}
                  placeholder={mode === 'register' ? 'Minimum 6 characters' : '••••••••'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
                }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 20,
                fontSize: 13, color: '#f87171',
              }}>
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} fullWidth variant="primary" style={{
              padding: '13px 0', borderRadius: 12, fontSize: 15,
              fontWeight: 700, opacity: loading ? 0.7 : 1,
            }}>
              {loading
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {mode === 'login' ? 'Signing in...' : 'Creating...'}</>
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={toggleMode} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#4f46e5', fontWeight: 600, fontSize: 14,
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </AnimatePresence>
      </div>
      <Footer variant="simple" />
    </div>
  );
}
