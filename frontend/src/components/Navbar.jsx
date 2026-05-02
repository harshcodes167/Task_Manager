import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/dashboard" style={styles.logo}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <span style={styles.logoText}>TaskFlow</span>
        </Link>
        {user?.role === 'admin' && (
          <div style={styles.tabs}>
            <Link to="/dashboard" style={{ ...styles.tab, ...(location.pathname === '/dashboard' ? styles.tabActive : {}) }}>Dashboard</Link>
            <Link to="/admin" style={{ ...styles.tab, ...(location.pathname === '/admin' ? styles.tabActive : {}) }}>Admin Panel</Link>
          </div>
        )}
      </div>
      <div style={styles.right}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <div style={styles.userDetail}>
            <span style={styles.userName}>{user?.name}</span>
            <span className={`badge badge-${user?.role}`}>{user?.role}</span>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: 64, background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)' },
  left: { display: 'flex', alignItems: 'center', gap: 32 },
  logo: { display: 'flex', alignItems: 'center', gap: 8 },
  logoText: { fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700 },
  tabs: { display: 'flex', gap: 4 },
  tab: { padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: 'var(--text2)', transition: 'all 0.2s' },
  tabActive: { color: 'var(--text)', background: 'var(--bg3)' },
  right: { display: 'flex', alignItems: 'center', gap: 16 },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white' },
  userDetail: { display: 'flex', flexDirection: 'column', gap: 2 },
  userName: { fontSize: 14, fontWeight: 500, lineHeight: 1 },
};
