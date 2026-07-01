import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI } from '../api/services';

const navByRole = {
  ADMIN: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/admin/stores', label: 'Stores', icon: '🏪' },
    { to: '/admin/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/admin/security', label: 'Security', icon: '🔒' },
    { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ],
  USER: [
    { to: '/stores', label: 'Browse Stores', icon: '🏪' },
    { to: '/user/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/user/security', label: 'Security', icon: '🔒' },
    { to: '/user/settings', label: 'Settings', icon: '⚙️' },
  ],
  STORE_OWNER: [
    { to: '/owner/dashboard', label: 'My Store', icon: '📈' },
    { to: '/owner/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/owner/security', label: 'Security', icon: '🔒' },
    { to: '/owner/settings', label: 'Settings', icon: '⚙️' },
  ],
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await notificationsAPI.getUnreadCount();
      setUnreadCount(res.data.count);
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const nav = navByRole[user?.role] || [];
  const roleBadgeClass = user?.role === 'ADMIN' ? 'badge-admin' : user?.role === 'STORE_OWNER' ? 'badge-owner' : 'badge-user';
  const roleLabel = user?.role === 'ADMIN' ? 'Admin' : user?.role === 'STORE_OWNER' ? 'Store Owner' : 'User';

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">Store<span>Rating</span> Platform</div>
        <nav className="sidebar-nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', borderRadius: '99px', fontSize: '0.68rem', padding: '0.1rem 0.45rem', fontWeight: 700 }}>
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <strong>{user?.name}</strong>
            {user?.email}
          </div>
          <span className={`badge ${roleBadgeClass}`} style={{ marginBottom: '0.75rem', display: 'inline-block' }}>{roleLabel}</span>
          <br />
          <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '0.5rem', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', border: 'none' }} onClick={handleLogout}>
            🚪 Log Out
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet context={{ refreshUnread: fetchUnread }} />
      </main>
    </div>
  );
}
