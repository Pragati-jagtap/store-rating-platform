import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function validate(form) {
  const errors = {};
  if (form.name.length < 20) errors.name = 'Name must be at least 20 characters';
  if (form.name.length > 60) errors.name = 'Name must be at most 60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address';
  if (form.address.length > 400) errors.address = 'Address must be at most 400 characters';
  const pw = form.password;
  if (pw.length < 8 || pw.length > 16) errors.password = 'Password must be 8–16 characters';
  else if (!/[A-Z]/.test(pw)) errors.password = 'Password needs at least one uppercase letter';
  else if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`;']/.test(pw)) errors.password = 'Password needs at least one special character';
  return errors;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setApiError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/stores');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join the Store Rating Platform</p>
        {apiError && <div className="alert alert-error">{apiError}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>(20–60 characters)</span></label>
            <input name="name" value={form.name} onChange={handle} placeholder="Your full name (min 20 chars)" />
            {errors.name && <div className="error-msg">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" />
            {errors.email && <div className="error-msg">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Address <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>(max 400 characters)</span></label>
            <textarea name="address" value={form.address} onChange={handle} placeholder="Your full address" rows={2} style={{ resize: 'vertical' }} />
            {errors.address && <div className="error-msg">{errors.address}</div>}
          </div>
          <div className="form-group">
            <label>Password <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>(8–16 chars, 1 uppercase, 1 special)</span></label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 8 chars, uppercase + special char" />
            {errors.password && <div className="error-msg">{errors.password}</div>}
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }} type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
