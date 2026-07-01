import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersAPI } from '../../api/services';
import StarRating from '../../components/StarRating';

const ROLE_LABELS = { ADMIN: 'System Administrator', USER: 'Normal User', STORE_OWNER: 'Store Owner' };
const BADGE = { ADMIN: 'badge-admin', USER: 'badge-user', STORE_OWNER: 'badge-owner' };

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    usersAPI.getById(id)
      .then(r => setUser(r.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load user.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <div className="page-header">
        <h1>User Details</h1>
        <p><Link to="/admin/users">&larr; Back to Users</Link></p>
      </div>

      {loading ? <div className="spinner" /> : error ? (
        <div className="alert alert-error">{error}</div>
      ) : user && (
        <div className="card" style={{ maxWidth: 560 }}>
          <div className="flex items-center gap-3 mb-2">
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#e0e7ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontWeight: 700, color: '#4f46e5'
            }}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{user.name}</h2>
              <span className={`badge ${BADGE[user.role]}`}>{ROLE_LABELS[user.role]}</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1.25rem 0' }} />

          <div className="form-group">
            <label>Email Address</label>
            <div>{user.email}</div>
          </div>
          <div className="form-group">
            <label>Address</label>
            <div>{user.address}</div>
          </div>
          <div className="form-group">
            <label>Role</label>
            <div>{ROLE_LABELS[user.role]}</div>
          </div>

          {user.role === 'STORE_OWNER' && (
            <div className="form-group">
              <label>Store Rating</label>
              {user.rating !== null && user.rating !== undefined ? (
                <div className="rating-display">
                  <StarRating value={Math.round(user.rating)} readonly />
                  <span>{user.rating.toFixed(2)} / 5</span>
                </div>
              ) : (
                <span className="text-muted text-sm">No ratings yet</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
