import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('stats');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats'),
      ]);
      setUsers(usersRes.data.data.users);
      setStats(statsRes.data.data);
    } catch (err) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Delete user "${name}" and all their tasks?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const statusColors = { todo: 'var(--blue)', 'in-progress': 'var(--yellow)', done: 'var(--green)' };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Panel</h1>
          <span style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--yellow)', padding: '4px 12px', borderRadius: 100, fontSize: 13, fontWeight: 600 }}>
            🛡 Admin Access
          </span>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['stats', 'users'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
              {t === 'stats' ? '📊 Statistics' : '👥 Users'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={styles.center}><div className="spinner" style={{width:32,height:32}} /></div>
        ) : tab === 'stats' ? (
          <div className="fade-in">
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={{ ...styles.statVal, color: 'var(--accent)' }}>{stats?.totalUsers ?? 0}</div>
                <div style={styles.statLbl}>Total Users</div>
              </div>
              <div style={styles.statCard}>
                <div style={{ ...styles.statVal, color: 'var(--green)' }}>{stats?.totalTasks ?? 0}</div>
                <div style={styles.statLbl}>Total Tasks</div>
              </div>
            </div>

            <h2 style={styles.sectionTitle}>Tasks by Status</h2>
            <div style={styles.statusGrid}>
              {(stats?.tasksByStatus || []).map(item => (
                <div key={item._id} style={styles.statusCard}>
                  <div style={{ ...styles.statusVal, color: statusColors[item._id] || 'var(--text)' }}>{item.count}</div>
                  <div style={styles.statusLbl}>{item._id}</div>
                  <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, marginTop: 12 }}>
                    <div style={{ width: `${Math.min(100, (item.count / (stats.totalTasks || 1)) * 100)}%`, height: '100%', background: statusColors[item._id] || 'var(--accent)', borderRadius: 2, transition: 'width 0.6s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="fade-in">
            <h2 style={styles.sectionTitle}>All Users ({users.length})</h2>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Joined</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>
                          {user.name}
                        </div>
                      </td>
                      <td style={{ ...styles.td, color: 'var(--text2)' }}>{user.email}</td>
                      <td style={styles.td}>
                        <span className={`badge badge-${user.role}`}>{user.role}</span>
                      </td>
                      <td style={{ ...styles.td, color: 'var(--text2)' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        {user.role !== 'admin' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user._id, user.name)}>Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  main: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  title: { fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 700 },
  tabs: { display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, width: 'fit-content' },
  tab: { padding: '8px 18px', borderRadius: 7, fontSize: 14, fontWeight: 500, color: 'var(--text2)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
  tabActive: { background: 'var(--bg3)', color: 'var(--text)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' },
  center: { display: 'flex', justifyContent: 'center', padding: '60px 0' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32, maxWidth: 500 },
  statCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px' },
  statVal: { fontSize: 36, fontFamily: 'var(--font-head)', fontWeight: 700, lineHeight: 1 },
  statLbl: { fontSize: 13, color: 'var(--text2)', marginTop: 6 },
  sectionTitle: { fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, marginBottom: 16 },
  statusGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 },
  statusCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' },
  statusVal: { fontSize: 28, fontFamily: 'var(--font-head)', fontWeight: 700 },
  statusLbl: { fontSize: 13, color: 'var(--text2)', marginTop: 4, textTransform: 'capitalize' },
  tableWrap: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: 'var(--bg3)' },
  th: { textAlign: 'left', padding: '14px 16px', fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border)' },
  tr: { borderBottom: '1px solid var(--border)', transition: 'background 0.15s' },
  td: { padding: '14px 16px', fontSize: 14 },
  userCell: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'white', flexShrink: 0 },
};
