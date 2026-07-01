import { useEffect, useState } from 'react';
import { storesAPI, ratingsAPI } from '../../api/services';
import StarRating from '../../components/StarRating';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [submitting, setSubmitting] = useState(null); // storeId currently submitting
  const [message, setMessage] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.address) params.address = filters.address;
      const res = await storesAPI.getAll(params);
      setStores(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchStores(); }, []);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const handleSearch = (e) => { e.preventDefault(); fetchStores(); };

  const submitRating = async (storeId, value) => {
    setSubmitting(storeId);
    setMessage('');
    try {
      await ratingsAPI.submit({ storeId, value });
      setMessage('Rating submitted successfully!');
      // Optimistically update local state
      setStores(prev => prev.map(s => s.id === storeId ? { ...s, myRating: value } : s));
      setTimeout(() => fetchStores(), 400); // refresh overall rating too
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Browse Stores</h1>
        <p>Search for stores and submit or update your ratings.</p>
      </div>

      {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form className="search-bar" onSubmit={handleSearch}>
          <input name="name" placeholder="Search by Store Name" value={filters.name} onChange={handleFilter} />
          <input name="address" placeholder="Search by Address" value={filters.address} onChange={handleFilter} />
          <button className="btn btn-primary" type="submit">Search</button>
          <button className="btn btn-secondary" type="button" onClick={() => { setFilters({ name: '', address: '' }); setTimeout(fetchStores, 100); }}>Clear</button>
        </form>
      </div>

      {loading ? <div className="spinner" /> : stores.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🏪</div><p>No stores found matching your search.</p></div>
      ) : (
        <div className="store-grid">
          {stores.map(store => (
            <div key={store.id} className="store-card">
              <h3>{store.name}</h3>
              <div className="store-email">{store.email}</div>
              <div className="store-addr">📍 {store.address}</div>

              <div className="rating-display">
                {store.overallRating ? (
                  <>
                    <StarRating value={Math.round(store.overallRating)} readonly size="0.95rem" />
                    <span>{store.overallRating} overall ({store.ratingCount} ratings)</span>
                  </>
                ) : <span className="text-muted text-sm">No ratings yet</span>}
              </div>

              <div className="store-card-footer" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div className="my-rating-label">
                  {store.myRating ? 'Your Rating (click to modify):' : 'Submit your rating:'}
                </div>
                <div className="flex items-center gap-2">
                  <StarRating
                    value={store.myRating}
                    onChange={(v) => submitRating(store.id, v)}
                    size="1.4rem"
                  />
                  {submitting === store.id && <span className="text-muted text-sm">Saving…</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
