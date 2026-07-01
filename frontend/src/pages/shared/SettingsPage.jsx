import { useAuth } from '../../context/AuthContext';

const ROLE_LABELS = { ADMIN: 'System Administrator', USER: 'Normal User', STORE_OWNER: 'Store Owner' };
const BADGE = { ADMIN: 'badge-admin', USER: 'badge-user', STORE_OWNER: 'badge-owner' };

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Your account information and preferences.</p>
      </div>

      <div className="settings-grid">
        <div className="card">
          <div className="card-title">👤 Profile Information</div>
          <div className="form-group">
            <label>Name</label>
            <div>{user?.name}</div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div>{user?.email}</div>
          </div>
          <div className="form-group">
            <label>Role</label>
            <div><span className={`badge ${BADGE[user?.role]}`}>{ROLE_LABELS[user?.role]}</span></div>
          </div>
          <p className="text-muted text-sm mt-2">
            To change your name, email, or address, please contact an administrator.
          </p>
        </div>

        <div className="card">
          <div className="card-title">🌐 Platform Preferences</div>
          <p className="text-muted text-sm mb-2">
            Notification and appearance preferences will appear here as they become available.
          </p>
          <div className="form-group">
            <label>Email Notifications</label>
            <select disabled defaultValue="enabled">
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
