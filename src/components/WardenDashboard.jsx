import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import io from 'socket.io-client';

const WardenDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    fetchComplaints();
    fetchEmergencies();

    const socket = io('http://localhost:5001');
    socket.on('emergency-alert', (data) => {
      alert(`EMERGENCY: ${data.message} at ${data.location}`);
      fetchEmergencies();
    });

    return () => socket.disconnect();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints');
      setComplaints(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmergencies = async () => {
    try {
      const { data } = await API.get('/emergency');
      setEmergencies(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateComplaint = async (id, status) => {
    try {
      await API.put(`/complaints/${id}`, { status });
      fetchComplaints();
    } catch (error) {
      alert('Failed to update complaint');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Warden Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout} style={{ padding: '10px', background: '#dc3545', color: '#fff', border: 'none', marginBottom: '20px' }}>Logout</button>

      <div style={{ marginBottom: '20px' }}>
        <h2>Emergency Alerts</h2>
        {emergencies.map(e => (
          <div key={e._id} style={{ background: '#f8d7da', padding: '10px', margin: '5px', border: '1px solid #f5c6cb' }}>
            <p><strong>Student:</strong> {e.userId?.name}</p>
            <p><strong>Location:</strong> {e.location}</p>
            <p><strong>Message:</strong> {e.message}</p>
            <p><strong>Status:</strong> {e.status}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>Complaints</h2>
        {complaints.map(c => (
          <div key={c._id} style={{ background: '#f9f9f9', padding: '10px', margin: '5px', border: '1px solid #ddd' }}>
            <p><strong>{c.category}</strong>: {c.description}</p>
            <p>Status: {c.status}</p>
            <button onClick={() => updateComplaint(c._id, 'in-progress')} style={{ padding: '5px', margin: '2px' }}>In Progress</button>
            <button onClick={() => updateComplaint(c._id, 'resolved')} style={{ padding: '5px', margin: '2px' }}>Resolve</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardenDashboard;
