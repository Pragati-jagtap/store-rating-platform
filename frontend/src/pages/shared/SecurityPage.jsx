import { useState } from 'react';
import { authAPI } from '../../api/services';

function validate(newPassword) {
  if (newPassword.length < 8 || newPassword.length > 16) return 'Password must be 8–16 characters';
  if (!/[A-Z]/.test(newPassword)) return 'Password needs at least one uppercase letter';
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`;']/.test(newPassword)) return 'Password needs at least one special character';
  return '';
}

export default function SecurityPage() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    const pwError = validate(form.newPassword);
    if (pwError) return setError(pwError);
    if (form.newPassword !== form.confirmPassword) return setError('New passwords do not match');

    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Security</h1>
        <p>Manage your account password and security settings.</p>
      </div>

      <div className="settings-grid">
        <div className="card">
          <div className="card-title">🔒 Change Password</div>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Current Password</label>
              <input name="currentPassword" type="password" value={form.currentPassword} onChange={handle} placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label>New Password <span className="text-muted text-sm">(8–16 chars, 1 uppercase, 1 special)</span></label>
              <input name="newPassword" type="password" value={form.newPassword} onChange={handle} placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle} placeholder="••••••••" required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Updating…' : 'Update Password'}</button>
          </form>
        </div>

        <div className="card">
          <div className="card-title">🛡️ Account Protection</div>
          <ul style={{ paddingLeft: '1.1rem', color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.9 }}>
            <li>Your session is secured using JWT-based authentication.</li>
            <li>Passwords are hashed and never stored in plain text.</li>
            <li>Use a unique password not shared with other sites.</li>
            <li>Log out from shared or public devices after use.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
