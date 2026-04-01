import { useState } from 'react';
import { Link2, Loader2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Button from './button';
import { UniversalModal } from './UniversalModal';

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
    <UniversalModal isOpen={isOpen} onClose={handleClose}>
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
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 42, marginBottom: 24 }}>
          Your URL will be reviewed before activation.
        </p>

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
            <Button type="submit" disabled={loading} style={{
              flex: 2, padding: '11px 0', borderRadius: 10, fontSize: 14,
              fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : '🚀 Submit URL'}
            </Button>
          </div>
        </form>
      </div>
    </UniversalModal>
  );
};
