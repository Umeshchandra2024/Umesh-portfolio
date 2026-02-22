import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessages, markMessageRead, deleteMessage } from '../store/messageSlice.js';

export function ManageMessages() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(getMessages());
  }, [dispatch]);

  const handleMarkRead = (id) => {
    dispatch(markMessageRead(id));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this message?')) return;
    dispatch(deleteMessage(id));
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Messages</h1>
        <p className="page-subtitle">Contact form submissions from your portfolio.</p>
      </header>

      <section className="section-card">
        {loading && <p className="loading-text">Loading messages...</p>}
        {error && <p className="auth-error">{error}</p>}
        {items.length === 0 && !loading ? (
          <p className="empty-state">No messages yet.</p>
        ) : (
          <ul className="list">
            {items.map((msg) => (
              <li key={msg._id} className="list-item">
                <div style={{ flex: 1 }}>
                  <strong>{msg.name}</strong>
                  <p className="list-item-desc">
                    <span>{msg.email}</span>
                    <br />
                    <strong>Subject:</strong> {msg.subject}
                    <br />
                    <strong>Message:</strong> {msg.message}
                  </p>
                  <p className="list-item-desc">
                    <strong>Received:</strong>{' '}
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <div className="timeline-item-actions">
                  {!msg.read && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleMarkRead(msg._id)}
                    >
                      Mark as read
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-danger"
                    onClick={() => handleDelete(msg._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

