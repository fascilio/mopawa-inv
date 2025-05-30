// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/warranty/notifications')
//       .then(res => {
//         setNotifications(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Failed to fetch notifications:', err);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Warranty Claim Notifications</h2>

//       {loading ? (
//         <p style={styles.loading}>Loading notifications...</p>
//       ) : notifications.length === 0 ? (
//         <p style={styles.noNotifications}>No notifications yet.</p>
//       ) : (
//         notifications.map((n, idx) => (
//           <div key={idx} style={styles.notification}>
//             <p><strong>📞 Phone:</strong> {n.phoneNumber}</p>
//             <p><strong>🔢 Product:</strong> {n.serialNumber}</p>
//             <p><strong>📝 Message:</strong> {n.message}</p>
//             <p><strong>⏰ Time:</strong> {new Date(n.createdAt).toLocaleString()}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: '30px',
//     maxWidth: '700px',
//     margin: 'auto',
//     fontFamily: 'Arial, sans-serif',
//   },
//   heading: {
//     textAlign: 'center',
//     marginBottom: '20px',
//   },
//   loading: {
//     textAlign: 'center',
//   },
//   noNotifications: {
//     textAlign: 'center',
//     color: '#777',
//   },
//   notification: {
//     background: '#f1f1f1',
//     borderRadius: '10px',
//     padding: '15px',
//     marginBottom: '15px',
//     boxShadow: '0 0 5px rgba(0,0,0,0.1)',
//   }
// };

// export default Notifications;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all'); // 'all', 'claims', 'registrations'

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/warranty/notifications')
//       .then(res => {
//         setNotifications(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('Failed to fetch notifications:', err);
//         setLoading(false);
//       });
//   }, []);

//   const filteredNotifications = notifications.filter(n => {
//     if (filter === 'claims') return n.message === 'New Claim Request';
//     if (filter === 'registrations') return n.message === 'New Warranty Registration';
//     return true;
//   });

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.heading}>Warranty Notifications</h2>

//       <div style={styles.buttonGroup}>
//         <button
//           style={filter === 'registrations' ? styles.activeButton : styles.button}
//           onClick={() => setFilter('registrations')}
//         >
//           Registrations
//         </button>
//         <button
//           style={filter === 'claims' ? styles.activeButton : styles.button}
//           onClick={() => setFilter('claims')}
//         >
//           Claims
//         </button>
//       </div>

//       {loading ? (
//         <p style={styles.loading}>Loading notifications...</p>
//       ) : filteredNotifications.length === 0 ? (
//         <p style={styles.noNotifications}>No notifications for this category.</p>
//       ) : (
//         filteredNotifications.map((n, idx) => (
//           <div key={idx} style={styles.notification}>
//             <p><strong>📞 Phone:</strong> {n.phoneNumber}</p>
//             <p><strong>🔢 Product:</strong> {n.serialNumber}</p>
//             <p><strong>📝 Message:</strong> {n.message}</p>
//             <p><strong>⏰ Time:</strong> {new Date(n.createdAt).toLocaleString()}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     padding: '30px',
//     maxWidth: '700px',
//     margin: 'auto',
//     fontFamily: 'Arial, sans-serif',
//   },
//   heading: {
//     textAlign: 'center',
//     marginBottom: '20px',
//   },
//   buttonGroup: {
//     display: 'flex',
//     justifyContent: 'center',
//     gap: '10px',
//     marginBottom: '20px',
//   },
//   button: {
//     padding: '10px 20px',
//     border: '1px solid #007bff',
//     backgroundColor: '#fff',
//     color: '#007bff',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
//   activeButton: {
//     padding: '10px 20px',
//     border: '1px solid #007bff',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     borderRadius: '5px',
//     cursor: 'pointer',
//   },
//   loading: {
//     textAlign: 'center',
//   },
//   noNotifications: {
//     textAlign: 'center',
//     color: '#777',
//   },
//   notification: {
//     background: '#f1f1f1',
//     borderRadius: '10px',
//     padding: '15px',
//     marginBottom: '15px',
//     boxShadow: '0 0 5px rgba(0,0,0,0.1)',
//   }
// };

// export default Notifications;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    axios.get(`${process.env.BASE_URL}/api/warranty/notifications`)
    //('http://localhost:5000/api/warranty/notifications')
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
    <div style={styles.container}>
      <h2 style={styles.heading}>Warranty Notifications</h2>

      <div style={styles.buttonContainer}>
        <button onClick={() => setFilter('all')} style={filter === 'all' ? styles.activeButton : styles.button}>All</button>
        <button onClick={() => setFilter('registration')} style={filter === 'registration' ? styles.activeButton : styles.button}>Registrations</button>
        <button onClick={() => setFilter('claim')} style={filter === 'claim' ? styles.activeButton : styles.button}>Claims</button>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading notifications...</p>
      ) : filteredNotifications.length === 0 ? (
        <p style={styles.noNotifications}>No notifications found for this filter.</p>
      ) : (
        filteredNotifications.map((n, idx) => (
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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 15px',
    background: '#eee',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  activeButton: {
    padding: '10px 15px',
    background: '#007bff',
    color: '#fff',
    border: '1px solid #007bff',
    borderRadius: '5px',
    cursor: 'pointer',
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
