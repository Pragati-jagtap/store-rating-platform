import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersAPI } from '../../api/services';
import { useSortableData, SortableTh } from '../../components/SortableTable';

const ROLES = ['', 'ADMIN', 'USER', 'STORE_OWNER'];
const ROLE_LABELS = { ADMIN: 'Admin', USER: 'Normal User', STORE_OWNER: 'Store Owner' };
const BADGE = { ADMIN: 'badge-admin', USER: 'badge-user', STORE_OWNER: 'badge-owner' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.email) params.email = filters.email;
      if (filters.address) params.address = filters.address;
      if (filters.role) params.role = filters.role;
      const res = await usersAPI.getAll(params);
      setUsers(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const { sorted, sort, toggle } = useSortableData(users);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSearch = (e) => { e.preventDefault(); fetchUsers(); };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Users</h1>
          <p>Manage all platform users — filter, sort, and view details.</p>
        </div>
        <Link to="/admin/users/add" className="btn btn-primary">+ Add User</Link>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form className="search-bar" onSubmit={handleSearch}>
          <input name="name" placeholder="Filter by Name" value={filters.name} onChange={handleFilter} />
          <input name="email" placeholder="Filter by Email" value={filters.email} onChange={handleFilter} />
          <input name="address" placeholder="Filter by Address" value={filters.address} onChange={handleFilter} />
          <select name="role" value={filters.role} onChange={handleFilter}>
            {ROLES.map(r => <option key={r} value={r}>{r ? ROLE_LABELS[r] : 'All Roles'}</option>)}
          </select>
          <button className="btn btn-primary" type="submit">Search</button>
          <button className="btn btn-secondary" type="button" onClick={() => { setFilters({ name: '', email: '', address: '', role: '' }); setTimeout(fetchUsers, 100); }}>Clear</button>
        </form>
      </div>

      <div className="card">
        {loading ? <div className="spinner" /> : (
          <div className="table-container">
            {sorted.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">👥</div><p>No users found.</p></div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <SortableTh col="name" sort={sort} onToggle={toggle}>Name</SortableTh>
                    <SortableTh col="email" sort={sort} onToggle={toggle}>Email</SortableTh>
                    <SortableTh col="address" sort={sort} onToggle={toggle}>Address</SortableTh>
                    <SortableTh col="role" sort={sort} onToggle={toggle}>Role</SortableTh>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(u => (
                    <tr key={u.id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</td>
                      <td><span className={`badge ${BADGE[u.role]}`}>{ROLE_LABELS[u.role]}</span></td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/admin/users/${u.id}`)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
