import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSkeleton, CardSkeleton } from '../components/LoadingSkeleton';
import { SubmitModal } from '../components/SubmitModal';
import { PlusCircle, RefreshCw, Search, Link2, Clock, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const PIE_COLORS = ['#6366f1', '#4ade80', '#f87171'];

const fmtDate = (d) => d ? new Date(d).toLocaleString('en-US', {
  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
}) : '—';

export default function Dashboard() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const fetchSubmissions = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const { data } = await api.get('/submissions/mine');
      setSubmissions(data);
    } catch {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const filtered = submissions.filter(s =>
    s.url.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: submissions.length,
    active: submissions.filter(s => s.status === 'approved').length,
    failed: submissions.filter(s => s.lastStatus === 'fail').length,
    pending: submissions.filter(s => s.status === 'pending').length,
  };

  const pieData = [
    { name: 'Pending', value: stats.pending },
    { name: 'Active',  value: stats.active  },
    { name: 'Failed',  value: stats.failed  },
  ].filter(d => d.value > 0);

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16, marginBottom: 32 }}
        >
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>
              My Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Welcome back, <span style={{ color: '#a5b4fc' }}>{user?.email}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => fetchSubmissions(true)} disabled={refreshing} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
              background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
            }}>
              <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
            <button onClick={() => setModalOpen(true)} className="btn-gradient" style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            }}>
              <PlusCircle size={15} /> Submit URL
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {loading ? (
            [0,1].map(i => <CardSkeleton key={i} />)
          ) : (
            <>
              <StatCard icon="🔗" label="Total URLs"   value={stats.total}   color="#6366f1" delay={0}    />
              <StatCard icon="✅" label="Active"        value={stats.active}  color="#4ade80" delay={0.1}  />
            </>
          )}
        </div>

        {/* Chart + Table layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, alignItems: 'start' }}>
          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass"
            style={{ borderRadius: 20, overflow: 'hidden' }}
          >
            {/* Table header bar */}
            <div style={{
              padding: '18px 20px', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link2 size={15} color="#6366f1" /> My Submissions
              </h2>
              <div style={{ position: 'relative', width: 220 }}>
                <Search size={14} style={{
                  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)',
                }} />
                <input
                  className="input-dark"
                  placeholder="Search URLs..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: 30, fontSize: 13, padding: '7px 10px 7px 30px' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              {loading ? <LoadingSkeleton rows={4} /> : (
                <table className="tp-table">
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th><div style={{ display:'flex', alignItems:'center', gap:5 }}><Clock size={12} />Last Triggered</div></th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
                          {search ? 'No URLs match your search.' : 'No submissions yet. Submit your first URL!'}
                        </td>
                      </tr>
                    ) : filtered.map(sub => (
                      <tr key={sub._id}>
                        <td style={{ maxWidth: 400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          <a href={sub.url} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#4f46e5', fontWeight: 500, textDecoration: 'none', fontSize: 14 }}
                            title={sub.url}>
                            {sub.url}
                          </a>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{fmtDate(sub.lastTriggered)}</td>
                        <td><StatusBadge status={sub.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>

        </div>
      </div>

      <SubmitModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={() => fetchSubmissions(true)} />
    </div>
  );
}
