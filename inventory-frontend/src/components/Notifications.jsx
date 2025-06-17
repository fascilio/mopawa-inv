import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    axios.get(`${process.env.BASE_URL}/api/warranty/notifications`)
      .then(res => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch notifications:', err);
        setLoading(false);
      });
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'claim') return n.type === 'warranty-claim';
    if (filter === 'registration') return n.type === 'warranty-registration';
    return true;
  });

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">Warranty Notifications</h2>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('registration')} className={filter === 'registration' ? 'active' : ''}>Registrations</button>
        <button onClick={() => setFilter('claim')} className={filter === 'claim' ? 'active' : ''}>Claims</button>
      </div>

      {loading ? (
        <p className="status-message">Loading notifications...</p>
      ) : filteredNotifications.length === 0 ? (
        <p className="status-message">No notifications found for this filter.</p>
      ) : (
        filteredNotifications.map((n, idx) => (
          <div key={idx} className="notification-card">
            <p><strong>📞 Phone:</strong> {n.phoneNumber}</p>
            <p><strong>🔢 Product:</strong> {n.serialNumber}</p>
            <p><strong>📝 Message:</strong> {n.message}</p>
            <p><strong>⏰ Time:</strong> {new Date(n.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;

