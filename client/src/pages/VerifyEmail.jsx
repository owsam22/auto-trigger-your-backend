import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, CheckCircle, RefreshCw, AlertCircle, Loader2, Zap, LogOut } from 'lucide-react';

const POLL_INTERVAL_MS = 5000; // poll every 5 seconds
const MAX_EMAILS_PER_DAY = 2;

export default function VerifyEmail() {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState('waiting'); // 'waiting' | 'verifying' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [emailsRemaining, setEmailsRemaining] = useState(MAX_EMAILS_PER_DAY - 1); // 1 already sent at register
  const [cooldown, setCooldown] = useState(0); // seconds remaining on UI cooldown
  const pollRef = useRef(null);
  const cooldownRef = useRef(null);

  // ── Handle token in URL (user clicked email link) ──────────────────────────
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (!urlToken) return;

    setStatus('verifying');

    api.get(`/auth/verify-email?token=${urlToken}`)
      .then(({ data }) => {
        updateUser(data.user, data.token);
        setStatus('success');
        setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Verification failed.';
        setErrorMsg(msg);
        setStatus('error');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Poll for verification status ────────────────────────────────────────────
  const checkVerified = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get('/auth/check-verified');
      if (data.isEmailVerified) {
        clearInterval(pollRef.current);
        updateUser(data.user, data.token);
        setStatus('success');
        setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
      }
    } catch {
      // silent — polling should not disrupt UI
    }
  }, [token, updateUser, navigate]);

  useEffect(() => {
    if (status !== 'waiting') return;
    pollRef.current = setInterval(checkVerified, POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [status, checkVerified]);

  // ── Cooldown timer ──────────────────────────────────────────────────────────
  const startCooldown = (seconds) => {
    setCooldown(seconds);
    clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          setResendDisabled(emailsRemaining <= 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(cooldownRef.current), []);

  // ── Resend handler ──────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendDisabled || resendLoading) return;
    setResendLoading(true);
    try {
      const { data } = await api.post('/auth/resend-verification');
      const remaining = data.emailsRemaining ?? 0;
      setEmailsRemaining(remaining);
      if (remaining <= 0) setResendDisabled(true);
      toast.success('Verification email sent! Check your inbox.');
      startCooldown(30); // 30s UI cooldown between clicks
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend email.';
      if (err.response?.data?.limitReached) {
        setResendDisabled(true);
        setEmailsRemaining(0);
      }
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  const maskedEmail = user?.email || '';

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '24px',
    }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 500, height: 500, background: '#6366f1', opacity: 0.06, top: '-10%', left: '-10%' }} />
      <div className="orb" style={{ width: 400, height: 400, background: '#8b5cf6', opacity: 0.06, bottom: '-5%', right: '-5%', animationDelay: '3s' }} />

      <AnimatePresence mode="wait">

        {/* ── VERIFYING state ── */}
        {status === 'verifying' && (
          <motion.div key="verifying"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              border: '3px solid rgba(99,102,241,0.2)',
              borderTopColor: '#6366f1',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 24px',
            }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Verifying your email…
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Just a moment, please wait.</p>
          </motion.div>
        )}

        {/* ── SUCCESS state ── */}
        {status === 'success' && (
          <motion.div key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
              style={{
                width: 96, height: 96, borderRadius: '50%',
                background: 'rgba(34,197,94,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 28px',
              }}
            >
              <CheckCircle size={52} color="#22c55e" strokeWidth={1.5} />
            </motion.div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.02em' }}>
              Email Verified! 🎉
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
              Redirecting you to your dashboard…
            </p>
          </motion.div>
        )}

        {/* ── ERROR state ── */}
        {status === 'error' && (
          <motion.div key="error"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{
              width: '100%', maxWidth: 440,
              borderRadius: 24, padding: '40px 36px',
              background: '#ffffff', border: '1px solid #e2e8f0',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <AlertCircle size={36} color="#ef4444" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
              Verification Failed
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
              {errorMsg}
            </p>
            <button
              onClick={() => { setStatus('waiting'); navigate('/verify-email', { replace: true }); }}
              style={{
                width: '100%', padding: '13px 0', borderRadius: 12, border: 'none',
                background: 'var(--gradient)', color: 'white',
                fontWeight: 700, fontSize: 15, cursor: 'pointer',
              }}
            >
              Request a New Link
            </button>
            <button onClick={handleLogout} style={{
              marginTop: 14, background: 'none', border: 'none',
              color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}>
              Back to Login
            </button>
          </motion.div>
        )}

        {/* ── WAITING state (main view) ── */}
        {status === 'waiting' && (
          <motion.div key="waiting"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%', maxWidth: 480 }}
          >
            {/* Card */}
            <div className="glass" style={{
              borderRadius: 24, padding: '44px 40px',
              background: '#ffffff', border: '1px solid #e2e8f0',
              boxShadow: '0 20px 60px rgba(0,0,0,0.07)',
              textAlign: 'center',
            }}>
              {/* Animated envelope */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 88, height: 88, borderRadius: 24,
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 28px',
                  boxShadow: '0 12px 36px rgba(99,102,241,0.35)',
                }}
              >
                <Mail size={40} color="white" strokeWidth={1.5} />
              </motion.div>

              {/* Brand */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, marginBottom: 20,
              }}>
                <Zap size={16} color="#6366f1" fill="#6366f1" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  TriggerPulse
                </span>
              </div>

              <h1 style={{
                fontSize: 26, fontWeight: 800, color: 'var(--text-primary)',
                letterSpacing: '-0.02em', marginBottom: 12,
              }}>
                Check your inbox
              </h1>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 6 }}>
                We sent a verification link to
              </p>
              <p style={{
                fontSize: 15, fontWeight: 700,
                color: '#4f46e5', marginBottom: 28,
                wordBreak: 'break-all',
              }}>
                {maskedEmail}
              </p>

              {/* Step list */}
              <div style={{
                background: 'rgba(99,102,241,0.05)',
                border: '1px solid rgba(99,102,241,0.12)',
                borderRadius: 14, padding: '18px 20px',
                marginBottom: 28, textAlign: 'left',
              }}>
                {[
                  { num: '1', text: 'Open the email from TriggerPulse⚡' },
                  { num: '2', text: 'Click the "Verify My Email" button' },
                  { num: '3', text: 'This page will automatically update' },
                ].map(({ num, text }) => (
                  <div key={num} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    ...(num !== '3' ? { marginBottom: 12 } : {}),
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      background: 'var(--gradient)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: 'white',
                    }}>
                      {num}
                    </div>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Polling indicator */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, marginBottom: 28,
                fontSize: 13, color: 'var(--text-secondary)',
              }}>
                <Loader2 size={13} style={{ animation: 'spin 1.5s linear infinite', color: '#6366f1' }} />
                Waiting for verification…
              </div>

              {/* Resend button */}
              <div>
                {emailsRemaining <= 0 ? (
                  <div style={{
                    padding: '12px 16px', borderRadius: 12,
                    background: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    fontSize: 13, color: '#f87171', lineHeight: 1.5,
                  }}>
                    Daily resend limit reached (2/2). Try again tomorrow.
                  </div>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resendLoading || resendDisabled || cooldown > 0}
                    style={{
                      width: '100%', padding: '13px 0', borderRadius: 12,
                      border: '2px solid rgba(99,102,241,0.25)',
                      background: 'transparent',
                      color: cooldown > 0 || resendDisabled ? 'var(--text-secondary)' : '#4f46e5',
                      fontWeight: 600, fontSize: 14, cursor: cooldown > 0 || resendLoading ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.2s',
                      opacity: cooldown > 0 ? 0.6 : 1,
                    }}
                    onMouseEnter={e => { if (cooldown === 0) e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {resendLoading
                      ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Sending…</>
                      : cooldown > 0
                        ? <><RefreshCw size={14} /> Resend in {cooldown}s</>
                        : <><RefreshCw size={14} /> Resend Email ({emailsRemaining} left today)</>
                    }
                  </button>
                )}

                <p style={{
                  marginTop: 10, fontSize: 12,
                  color: 'var(--text-secondary)', lineHeight: 1.5,
                }}>
                  ⏱️ The link expires in <strong>10 minutes</strong>. Check your spam folder too.
                </p>
              </div>
            </div>

            {/* Logout link */}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <LogOut size={13} /> Wrong account? Sign out
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
