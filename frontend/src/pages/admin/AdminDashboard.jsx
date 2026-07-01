import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.adminStats().then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}. Here's your platform overview.</p>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats?.totalUsers ?? '–'}</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏪</span>
            <div className="stat-label">Total Stores</div>
            <div className="stat-value">{stats?.totalStores ?? '–'}</div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <div className="stat-label">Total Ratings</div>
            <div className="stat-value">{stats?.totalRatings ?? '–'}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #4f46e5' }}>
          <div className="card-title">👥 Manage Users</div>
          <p className="text-muted text-sm" style={{ marginBottom: '1rem' }}>View, filter, and manage all platform users.</p>
          <Link to="/admin/users" className="btn btn-primary btn-sm">View Users</Link>
          <Link to="/admin/users/add" className="btn btn-secondary btn-sm" style={{ marginLeft: '0.5rem' }}>+ Add User</Link>
        </div>
        <div className="card" style={{ borderLeft: '4px solid #06b6d4' }}>
          <div className="card-title">🏪 Manage Stores</div>
          <p className="text-muted text-sm" style={{ marginBottom: '1rem' }}>Browse all registered stores and their ratings.</p>
          <Link to="/admin/stores" className="btn btn-primary btn-sm">View Stores</Link>
          <Link to="/admin/stores/add" className="btn btn-secondary btn-sm" style={{ marginLeft: '0.5rem' }}>+ Add Store</Link>
        </div>
      </div>
    </div>
  );
}
