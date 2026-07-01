import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usersAPI } from '../../api/services';

function validate(form) {
  const errors = {};
  if (form.name.length < 20) errors.name = 'Name must be at least 20 characters';
  if (form.name.length > 60) errors.name = 'Name must be at most 60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';
  if (form.address.length > 400) errors.address = 'Max 400 characters';
  const pw = form.password;
  if (pw.length < 8 || pw.length > 16) errors.password = 'Password must be 8–16 characters';
  else if (!/[A-Z]/.test(pw)) errors.password = 'Need at least one uppercase letter';
  else if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\]/.test(pw)) errors.password = 'Need at least one special character';
  return errors;
}

export default function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setApiError('');
    try {
      await usersAPI.create(form);
      setSuccess(`User "${form.name}" created successfully!`);
      setForm({ name: '', email: '', password: '', address: '', role: 'USER' });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create user.');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Add New User</h1>
        <p>Create a new Normal User, Admin, or Store Owner account.</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {apiError && <div className="alert alert-error">{apiError}</div>}
        {success && (
          <div className="alert alert-success">
            {success} <Link to="/admin/users" style={{ color: 'inherit', fontWeight: 600 }}>View all users →</Link>
          </div>
        )}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name <span className="text-muted text-sm">(20–60 chars)</span></label>
            <input name="name" value={form.name} onChange={handle} placeholder="Full name (min 20 characters)" />
            {errors.name && <div className="error-msg">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="user@example.com" />
            {errors.email && <div className="error-msg">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password <span className="text-muted text-sm">(8–16 chars, uppercase + special)</span></label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" />
            {errors.password && <div className="error-msg">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label>Address <span className="text-muted text-sm">(max 400 chars)</span></label>
            <textarea name="address" value={form.address} onChange={handle} rows={3} placeholder="Full address" style={{ resize: 'vertical' }} />
            {errors.address && <div className="error-msg">{errors.address}</div>}
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handle}>
              <option value="USER">Normal User</option>
              <option value="ADMIN">System Administrator</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create User'}</button>
            <Link to="/admin/users" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
