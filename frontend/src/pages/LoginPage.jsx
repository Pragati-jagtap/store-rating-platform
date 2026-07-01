import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'STORE_OWNER') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Welcome back 👋</h1>
        <p>Sign in to access your account</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.7rem' }} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.78rem', color: '#64748b' }}>
          <strong>Demo credentials:</strong><br />
          Admin: admin@storerating.com / Admin@1234
        </div>
      </div>
    </div>
  );
}
