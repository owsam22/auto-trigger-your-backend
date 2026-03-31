import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { StatCard } from '../components/StatCard';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { Shield, RefreshCw, CheckCircle, XCircle, Trash2, Search, User } from 'lucide-react';

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
      } else if (type === 'delete') {
        if (!window.confirm('Delete this submission?')) { setActionId(null); return; }
        await api.delete(`/admin/delete/${id}`);
        toast.success('🗑️ Deleted');
      }
      fetchData(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionId(null);
    }
  };

  const filtered = submissions.filter(s => {
    const matchSearch = s.url.toLowerCase().includes(search.toLowerCase()) ||
      s.submittedBy?.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '32px 24px' }}>
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
          <button onClick={() => fetchData(true)} disabled={refreshing} style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'9px 16px', borderRadius:10, cursor:'pointer',
            background:'#ffffff', border:'1px solid #e2e8f0',
            color:'#64748b', fontSize:13, fontWeight:500, transition:'all 0.2s',
          }}>
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </motion.div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:16, marginBottom:28 }}>
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
                            <button
                              onClick={() => handleAction('approve', sub._id)}
                              disabled={actionId === sub._id}
                              title="Approve"
                              style={{
                                display:'flex', alignItems:'center', gap:4,
                                padding:'5px 10px', borderRadius:7, cursor:'pointer', fontSize:12,
                                fontWeight:500, border:'1px solid rgba(74,222,128,0.3)',
                                background:'rgba(74,222,128,0.1)', color:'#4ade80', transition:'all 0.2s',
                                opacity: actionId === sub._id ? 0.5 : 1,
                              }}
                            >
                              <CheckCircle size={13} /> Approve
                            </button>
                          )}
                          {sub.status !== 'rejected' && (
                            <button
                              onClick={() => handleAction('reject', sub._id)}
                              disabled={actionId === sub._id}
                              title="Reject"
                              style={{
                                display:'flex', alignItems:'center', gap:4,
                                padding:'5px 10px', borderRadius:7, cursor:'pointer', fontSize:12,
                                fontWeight:500, border:'1px solid rgba(248,113,113,0.3)',
                                background:'rgba(248,113,113,0.1)', color:'#f87171', transition:'all 0.2s',
                                opacity: actionId === sub._id ? 0.5 : 1,
                              }}
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          )}
                          <button
                            onClick={() => handleAction('delete', sub._id)}
                            disabled={actionId === sub._id}
                            title="Delete"
                            style={{
                              display:'flex', alignItems:'center', justifyContent:'center',
                              width:30, height:30, borderRadius:7, cursor:'pointer',
                              border:'1px solid #e2e8f0',
                              background:'#ffffff', color:'#64748b',
                              transition:'all 0.2s', opacity: actionId === sub._id ? 0.5 : 1,
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
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
  );
}
