import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storesAPI, usersAPI } from '../../api/services';

function validate(form) {
  const errors = {};
  if (!form.name || form.name.length > 60) errors.name = 'Name is required (max 60 chars)';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';
  if (form.address.length > 400) errors.address = 'Max 400 characters';
  return errors;
}

export default function AddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    // Fetch store-owner users to allow linking a store to an owner account
    usersAPI.getAll({ role: 'STORE_OWNER' }).then(r => setOwners(r.data)).catch(() => {});
  }, []);

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
      const payload = { ...form };
      if (payload.ownerId) payload.ownerId = Number(payload.ownerId);
      else delete payload.ownerId;
      await storesAPI.create(payload);
      setSuccess(`Store "${form.name}" created successfully!`);
      setForm({ name: '', email: '', address: '', ownerId: '' });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create store.');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Add New Store</h1>
        <p>Register a new store on the platform.</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {apiError && <div className="alert alert-error">{apiError}</div>}
        {success && (
          <div className="alert alert-success">
            {success} <Link to="/admin/stores" style={{ color: 'inherit', fontWeight: 600 }}>View all stores →</Link>
          </div>
        )}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Store Name</label>
            <input name="name" value={form.name} onChange={handle} placeholder="Store name" />
            {errors.name && <div className="error-msg">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="store@example.com" />
            {errors.email && <div className="error-msg">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Address <span className="text-muted text-sm">(max 400 chars)</span></label>
            <textarea name="address" value={form.address} onChange={handle} rows={3} placeholder="Store address" style={{ resize: 'vertical' }} />
            {errors.address && <div className="error-msg">{errors.address}</div>}
          </div>
          <div className="form-group">
            <label>Store Owner <span className="text-muted text-sm">(optional)</span></label>
            <select name="ownerId" value={form.ownerId} onChange={handle}>
              <option value="">— No owner assigned —</option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
            </select>
            <div className="text-muted text-sm mt-1">
              Only users with the "Store Owner" role appear here. Create one from Users → Add User first if needed.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Store'}</button>
            <Link to="/admin/stores" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
