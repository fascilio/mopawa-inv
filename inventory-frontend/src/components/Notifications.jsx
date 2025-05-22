import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/warranty/notifications')
      .then(res => {
        setNotifications(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch notifications:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Warranty Claim Notifications</h2>

      {loading ? (
        <p style={styles.loading}>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p style={styles.noNotifications}>No notifications yet.</p>
      ) : (
        notifications.map((n, idx) => (
          <div key={idx} style={styles.notification}>
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

const styles = {
  container: {
    padding: '30px',
    maxWidth: '700px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  loading: {
    textAlign: 'center',
  },
  noNotifications: {
    textAlign: 'center',
    color: '#777',
  },
  notification: {
    background: '#f1f1f1',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  }
};

export default Notifications;
