import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { notificationsAPI } from '../../api/services';

const TYPE_ICON = {
  NEW_RATING: '⭐',
  RATING_UPDATED: '✏️',
  STORE_ADDED: '🏪',
  ACCOUNT_CREATED: '👤',
  SYSTEM: '🔔',
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const ctx = useOutletContext?.() || {};

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await notificationsAPI.getAll();
      setNotifs(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchNotifs(); }, []);

  const handleClick = async (n) => {
    if (!n.isRead) {
      await notificationsAPI.markAsRead(n.id);
      setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x));
      ctx.refreshUnread?.();
    }
  };

  const markAllRead = async () => {
    await notificationsAPI.markAllAsRead();
    setNotifs(prev => prev.map(x => ({ ...x, isRead: true })));
    ctx.refreshUnread?.();
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated on account and rating activity.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={markAllRead}>Mark all as read</button>
        )}
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? <div className="spinner" /> : notifs.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🔔</div><p>You have no notifications yet.</p></div>
        ) : (
          <div>
            {notifs.map(n => (
              <div key={n.id} className={`notif-item ${!n.isRead ? 'unread' : ''}`} onClick={() => handleClick(n)} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem' }}>{TYPE_ICON[n.type] || '🔔'}</span>
                <div style={{ flex: 1 }}>
                  <div className="notif-msg">{n.message}</div>
                  <div className="notif-time">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                {!n.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5', marginTop: 6 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
