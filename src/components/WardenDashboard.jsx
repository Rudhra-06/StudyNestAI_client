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
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👮 Warden Dashboard</h1>
        <div>
          <span style={{ marginRight: '20px', color: '#667eea', fontWeight: 'bold' }}>Welcome, {user.name}!</span>
          <button onClick={logout} className="btn-danger">Logout</button>
        </div>
      </div>

      <div className="card">
        <h2>🚨 Emergency Alerts</h2>
        {emergencies.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No emergency alerts</p>
        ) : (
          emergencies.map(e => (
            <div key={e._id} className="emergency-item">
              <p><strong>👨‍🎓 Student:</strong> {e.userId?.name}</p>
              <p><strong>📍 Location:</strong> {e.location}</p>
              <p><strong>💬 Message:</strong> {e.message}</p>
              <span className="status-badge status-active">{e.status}</span>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h2>📢 Complaints Management</h2>
        {complaints.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No complaints</p>
        ) : (
          complaints.map(c => (
            <div key={c._id} className="complaint-item">
              <p><strong>{c.category.toUpperCase()}</strong>: {c.description}</p>
              <p><strong>Student:</strong> {c.userId?.name}</p>
              <span className={`status-badge status-${c.status === 'pending' ? 'pending' : c.status === 'in-progress' ? 'in-progress' : 'resolved'}`}>
                {c.status}
              </span>
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => updateComplaint(c._id, 'in-progress')} className="btn-info">In Progress</button>
                <button onClick={() => updateComplaint(c._id, 'resolved')} className="btn-success">Resolve</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WardenDashboard;
