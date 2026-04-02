import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { StatCard } from '../components/StatCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { Shield, RefreshCw, CheckCircle, XCircle, Trash2, Search, User, AlertTriangle } from 'lucide-react';
import { Footer } from '../components/Footer';
import Button from '../components/button';
import { UniversalModal } from '../components/UniversalModal';

const fmtDate = (d) => d ? new Date(d).toLocaleString('en-US', {
  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
}) : '—';

export default function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) { setLoading(true); setLoadingStats(true); }
    else setRefreshing(true);
    try {
      const [subRes, statRes] = await Promise.all([
        api.get('/admin/submissions'),
        api.get('/admin/stats'),
      ]);
      setSubmissions(subRes.data);
      setStats(statRes.data);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
      setLoadingStats(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async (type, id) => {
    setActionId(id);
    try {
      if (type === 'approve') {
        await api.patch(`/admin/approve/${id}`);
        toast.success('✅ URL approved');
      } else if (type === 'reject') {
        await api.patch(`/admin/reject/${id}`);
        toast.success('❌ URL rejected');
      }
      fetchData(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const confirmDelete = async () => {
    if (!subToDelete) return;
    setActionId(subToDelete._id);
    try {
      await api.delete(`/admin/delete/${subToDelete._id}`);
      toast.success('🗑️ Deleted');
      setDeleteModalOpen(false);
      setSubToDelete(null);
      fetchData(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteClick = (sub) => {
    setSubToDelete(sub);
    setDeleteModalOpen(true);
  };

  const filtered = submissions.filter(s => {
    const matchSearch = s.url.toLowerCase().includes(search.toLowerCase()) ||
      s.submittedBy?.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
              flexWrap:'wrap', gap:16, marginBottom:32 }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{
                width:44, height:44, borderRadius:12,
                background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <Shield size={20} color="#6366f1" />
              </div>
              <div>
                <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:'-0.02em', marginBottom:2 }}>Admin Panel</h1>
                <p style={{ color:'var(--text-secondary)', fontSize:13 }}>Manage all URL submissions</p>
              </div>
            </div>
            <Button onClick={() => fetchData(true)} disabled={refreshing} size="small" variant="outline" style={{
              display:'flex', alignItems:'center', gap:6,
              fontSize:13, fontWeight:500,
            }}>
              <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </Button>
          </motion.div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 160px),1fr))', gap:16, marginBottom:28 }}>
            {loadingStats ? [0,1,2,3,4].map(i => <CardSkeleton key={i} />) : (
              <>
                <StatCard icon="🔗" label="Total"    value={stats?.total    || 0} color="#6366f1" delay={0}    />
                <StatCard icon="⏳" label="Pending"  value={stats?.pending  || 0} color="#fbbf24" delay={0.08} />
                <StatCard icon="✅" label="Approved" value={stats?.approved || 0} color="#4ade80" delay={0.16} />
                <StatCard icon="❌" label="Rejected" value={stats?.rejected || 0} color="#f87171" delay={0.24} />
                <StatCard icon="⚠️" label="Unstable" value={stats?.unstable || 0} color="#fb923c" delay={0.32} />
              </>
            )}
          </div>

          {/* Table card */}
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2 }}
            className="glass"
            style={{ borderRadius:20, overflow:'hidden' }}
          >
            {/* Filters bar */}
            <div style={{
              padding:'16px 20px', borderBottom:'1px solid var(--border)',
              display:'flex', alignItems:'center', gap:12, flexWrap:'wrap',
            }}>
              {/* Search */}
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <Search size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-secondary)' }} />
                <input className="input-dark" placeholder="Search URL or email..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft:30, fontSize:13, padding:'7px 10px 7px 30px' }} />
              </div>
              {/* Filter tabs */}
              <div style={{ display:'flex', gap:4 }}>
                {['all','pending','approved','rejected'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13,
                    fontWeight:500, textTransform:'capitalize', border:'1px solid',
                    transition:'all 0.2s',
                    background: filter === f ? 'rgba(79, 70, 229, 0.1)' : 'rgba(255,255,255,0.8)',
                    borderColor: filter === f ? 'rgba(79, 70, 229, 0.4)' : '#e2e8f0',
                    color: filter === f ? '#4f46e5' : '#64748b',
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX:'auto' }}>
              {loading ? <LoadingSkeleton rows={5} /> : (
                <table className="tp-table">
                  <thead>
                    <tr>
                      <th>URL</th>
                      <th><div style={{ display:'flex', alignItems:'center', gap:5 }}><User size={12} />Submitted By</div></th>
                      <th>Status</th>
                      <th>Last Triggered</th>
                      <th>Last Status</th>
                      <th>Fail Count</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign:'center', padding:'48px 0', color:'var(--text-secondary)' }}>
                          No submissions found.
                        </td>
                      </tr>
                    ) : filtered.map(sub => (
                      <tr key={sub._id}>
                        <td style={{ maxWidth:220, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          <a href={sub.url} target="_blank" rel="noopener noreferrer"
                            style={{ color:'#4f46e5', fontWeight: 500, textDecoration:'none', fontSize:13 }} title={sub.url}>
                            {sub.url}
                          </a>
                        </td>
                        <td style={{ fontSize:12, color:'var(--text-secondary)' }}>
                          {sub.submittedBy?.email || '—'}
                        </td>
                        <td><StatusBadge status={sub.isUnstable ? 'unstable' : sub.status} /></td>
                        <td style={{ fontSize:12, color:'var(--text-secondary)' }}>{fmtDate(sub.lastTriggered)}</td>
                        <td>{sub.lastStatus ? <StatusBadge status={sub.lastStatus} /> : <span style={{ color:'var(--text-secondary)', fontSize:12 }}>—</span>}</td>
                        <td style={{ fontSize:13, color: sub.failCount > 3 ? '#f87171':'var(--text-secondary)', fontWeight: sub.failCount > 3 ? 600:400 }}>
                          {sub.failCount}
                        </td>
                        <td>
                          <div style={{ display:'flex', gap:6 }}>
                            {sub.status !== 'approved' && (
                              <Button
                                onClick={() => handleAction('approve', sub._id)}
                                disabled={actionId === sub._id}
                                size="small"
                                variant="outline"
                                style={{
                                  display:'flex', alignItems:'center', gap:4,
                                  minWidth: 90, opacity: actionId === sub._id ? 0.5 : 1,
                                  color: '#22c55e', borderColor: 'rgba(34,197,94,0.3)',
                                  background: 'rgba(34,197,94,0.05)'
                                }}
                              >
                                <CheckCircle size={13} /> Approve
                              </Button>
                            )}
                            {sub.status !== 'rejected' && (
                              <Button
                                onClick={() => handleAction('reject', sub._id)}
                                disabled={actionId === sub._id}
                                size="small"
                                variant="outline"
                                style={{
                                  display:'flex', alignItems:'center', gap:4,
                                  minWidth: 90, opacity: actionId === sub._id ? 0.5 : 1,
                                  color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)',
                                  background: 'rgba(239,68,68,0.05)'
                                }}
                              >
                                <XCircle size={13} /> Reject
                              </Button>
                            )}
                            <Button
                              onClick={() => handleDeleteClick(sub)}
                              disabled={actionId === sub._id}
                              size="small"
                              style={{
                                width: 34, height: 34, padding: 0,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                opacity: actionId === sub._id ? 0.5 : 1,
                                border: '1px solid #e2e8f0',
                                background: 'rgba(239, 68, 68, 0.05)', color: '#f87171'
                              }}
                            >
                              <Trash2 size={13} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <UniversalModal 
        isOpen={deleteModalOpen} 
        onClose={() => { setDeleteModalOpen(false); setSubToDelete(null); }}
        maxWidth={420}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64, background: '#fef2f2', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 24px',
            border: '1px solid #fecaca'
          }}>
            <AlertTriangle size={32} color="#ef4444" />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>
            Admin Delete
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
            Deleting submission:
            <br />
            <span style={{ fontWeight: 600, color: '#334155', wordBreak: 'break-all' }}>{subToDelete?.url}</span>
          </p>
          
          <div style={{
            background: '#fff1f2', border: '1px solid #fda4af',
            borderRadius: 12, padding: '10px 16px', marginBottom: 32,
            fontSize: 13, color: '#e11d48', fontWeight: 600,
            maxWidth: 'fit-content', margin: '0 auto 32px'
          }}>
            ⚠️ this is irreversable
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={() => { setDeleteModalOpen(false); setSubToDelete(null); }}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 12, 
                border: '1px solid #e2e8f0', background: '#f8fafc',
                color: '#64748b', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              Cancel
            </button>
            <Button 
              onClick={confirmDelete}
              variant="primary"
              style={{ 
                flex: 1, borderRadius: 12, background: '#ef4444',
                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.2)' 
              }}
            >
              Final Delete
            </Button>
          </div>
        </div>
      </UniversalModal>

      <Footer variant="simple" />
    </div>
  );
}
