import { useEffect, useState } from 'react';
import { storesAPI } from '../../api/services';
import { useSortableData, SortableTh } from '../../components/SortableTable';
import StarRating from '../../components/StarRating';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storesAPI.getOwnerDashboard()
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  const { sorted, sort, toggle } = useSortableData(data?.raters, { key: 'ratedAt', dir: 'DESC' });

  if (loading) return <div className="spinner" />;

  const hasStore = data?.stores?.length > 0;

  return (
    <div>
      <div className="page-header">
        <h1>My Store Dashboard</h1>
        <p>View your store's average rating and who has rated it.</p>
      </div>

      {!hasStore ? (
        <div className="empty-state">
          <div className="empty-icon">🏪</div>
          <p>No store is currently linked to your account. Please contact an administrator.</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">🏪</span>
              <div className="stat-label">Your Store</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>{data.stores.map(s => s.name).join(', ')}</div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <div className="stat-label">Average Rating</div>
              <div className="stat-value">{data.averageRating ?? '–'}</div>
              {data.averageRating && <StarRating value={Math.round(data.averageRating)} readonly size="0.9rem" />}
            </div>
            <div className="stat-card">
              <span className="stat-icon">📝</span>
              <div className="stat-label">Total Ratings</div>
              <div className="stat-value">{data.raters.length}</div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Ratings Received</div>
            <div className="table-container">
              {sorted.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">⭐</div><p>No ratings submitted yet.</p></div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <SortableTh col="userName" sort={sort} onToggle={toggle}>User Name</SortableTh>
                      <SortableTh col="userEmail" sort={sort} onToggle={toggle}>Email</SortableTh>
                      <SortableTh col="storeName" sort={sort} onToggle={toggle}>Store</SortableTh>
                      <SortableTh col="value" sort={sort} onToggle={toggle}>Rating</SortableTh>
                      <SortableTh col="ratedAt" sort={sort} onToggle={toggle}>Date</SortableTh>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(r => (
                      <tr key={r.ratingId}>
                        <td><strong>{r.userName}</strong></td>
                        <td>{r.userEmail}</td>
                        <td>{r.storeName}</td>
                        <td><StarRating value={r.value} readonly size="0.9rem" /></td>
                        <td className="text-muted text-sm">{new Date(r.ratedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
