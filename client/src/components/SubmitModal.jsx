import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const SubmitModal = ({ isOpen, onClose, onSuccess }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidUrl = (str) => {
    try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; }
    catch { return false; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!url.trim()) return setError('URL is required');
    if (!isValidUrl(url.trim())) return setError('Please enter a valid HTTP/HTTPS URL');

    setLoading(true);
    try {
      await api.post('/submissions/create', { url: url.trim() });
      toast.success('🚀 URL submitted! Once approved, it will be triggered every 10 minutes.');
      setUrl('');
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setUrl(''); setError(''); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            }}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 201, width: '90%', maxWidth: 480,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 20, padding: 32,
              boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Link2 size={15} color="#6366f1" />
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Submit a URL</h2>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 42 }}>
                  Your URL will be reviewed before activation.
                </p>
              </div>
              <button onClick={handleClose} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                borderRadius: 8, padding: 6, cursor: 'pointer', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              }}>
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500,
                color: 'var(--text-secondary)', marginBottom: 8 }}>
                Backend URL
              </label>
              <input
                className="input-dark"
                type="text"
                placeholder="https://your-backend.onrender.com"
                value={url}
                onChange={e => { setUrl(e.target.value); setError(''); }}
                autoFocus
              />
              {error && (
                <p style={{ marginTop: 8, fontSize: 13, color: '#f87171' }}>{error}</p>
              )}

              <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
                <button type="button" onClick={handleClose} style={{
                  flex: 1, padding: '11px 0', borderRadius: 10, border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-gradient" style={{
                  flex: 2, padding: '11px 0', borderRadius: 10, fontSize: 14,
                  fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: loading ? 0.7 : 1,
                }}>
                  {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : '🚀 Submit URL'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
