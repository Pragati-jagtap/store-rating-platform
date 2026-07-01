import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storesAPI } from '../../api/services';
import { useSortableData, SortableTh } from '../../components/SortableTable';
import StarRating from '../../components/StarRating';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.email) params.email = filters.email;
      if (filters.address) params.address = filters.address;
      const res = await storesAPI.getAll(params);
      setStores(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchStores(); }, []);

  const { sorted, sort, toggle } = useSortableData(stores);
  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSearch = (e) => { e.preventDefault(); fetchStores(); };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Stores</h1>
          <p>View all registered stores with their overall ratings.</p>
        </div>
        <Link to="/admin/stores/add" className="btn btn-primary">+ Add Store</Link>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form className="search-bar" onSubmit={handleSearch}>
          <input name="name" placeholder="Filter by Name" value={filters.name} onChange={handleFilter} />
          <input name="email" placeholder="Filter by Email" value={filters.email} onChange={handleFilter} />
          <input name="address" placeholder="Filter by Address" value={filters.address} onChange={handleFilter} />
          <button className="btn btn-primary" type="submit">Search</button>
          <button className="btn btn-secondary" type="button" onClick={() => { setFilters({ name: '', email: '', address: '' }); setTimeout(fetchStores, 100); }}>Clear</button>
        </form>
      </div>

      <div className="card">
        {loading ? <div className="spinner" /> : (
          <div className="table-container">
            {sorted.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🏪</div><p>No stores found.</p></div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <SortableTh col="name" sort={sort} onToggle={toggle}>Name</SortableTh>
                    <SortableTh col="email" sort={sort} onToggle={toggle}>Email</SortableTh>
                    <SortableTh col="address" sort={sort} onToggle={toggle}>Address</SortableTh>
                    <SortableTh col="overallRating" sort={sort} onToggle={toggle}>Rating</SortableTh>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.email}</td>
                      <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</td>
                      <td>
                        {s.overallRating ? (
                          <div className="rating-display">
                            <StarRating value={Math.round(s.overallRating)} readonly size="0.9rem" />
                            <span>{s.overallRating} ({s.ratingCount})</span>
                          </div>
                        ) : <span className="text-muted text-sm">No ratings</span>}
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
