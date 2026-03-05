import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import TimetableGenerator from './TimetableGenerator';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeSession, setActiveSession] = useState(null);
  const [streak, setStreak] = useState(0);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchStreak();
    fetchComplaints();
    fetchNotices();
  }, []);

  const fetchStreak = async () => {
    try {
      const { data } = await API.get('/study/streak');
      setStreak(data.streak);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints');
      setComplaints(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNotices = async () => {
    try {
      const { data } = await API.get('/notices');
      setNotices(data);
    } catch (error) {
      console.error(error);
    }
  };

  const startStudy = async () => {
    const subject = prompt('Enter subject:');
    if (!subject) return;
    try {
      const { data } = await API.post('/study/start', { subject });
      setActiveSession(data);
    } catch (error) {
      alert('Failed to start session');
    }
  };

  const endStudy = async () => {
    try {
      await API.put(`/study/end/${activeSession._id}`);
      setActiveSession(null);
      fetchStreak();
    } catch (error) {
      alert('Failed to end session');
    }
  };

  const submitComplaint = async () => {
    const category = prompt('Category (maintenance/food/cleanliness/security/other):');
    const description = prompt('Description:');
    if (!category || !description) return;
    try {
      await API.post('/complaints', { category, description });
      fetchComplaints();
    } catch (error) {
      alert('Failed to submit complaint');
    }
  };

  const triggerEmergency = async () => {
    const location = prompt('Your location:');
    const message = prompt('Emergency message:');
    try {
      await API.post('/emergency', { location, message });
      alert('Emergency alert sent to warden!');
    } catch (error) {
      alert('Failed to send emergency alert');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🎓 Student Dashboard</h1>
        <div>
          <span style={{ marginRight: '20px', color: '#667eea', fontWeight: 'bold' }}>Welcome, {user.name}!</span>
          <button onClick={logout} className="btn-danger">Logout</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2>📚 Study Bot</h2>
          <div className="streak-display">
            <p>Current Streak</p>
            <h3>🔥 {streak}</h3>
            <p>days</p>
          </div>
          {activeSession ? (
            <div>
              <p style={{ fontSize: '18px', margin: '15px 0' }}>📖 Studying: <strong>{activeSession.subject}</strong></p>
              <button onClick={endStudy} className="btn-danger" style={{ width: '100%' }}>End Session</button>
            </div>
          ) : (
            <button onClick={startStudy} className="btn-success" style={{ width: '100%' }}>Start Study Session</button>
          )}
        </div>

        <div className="card">
          <h2>🏠 Hostel Companion</h2>
          <button onClick={submitComplaint} className="btn-info" style={{ width: '100%', marginBottom: '10px' }}>Submit Complaint</button>
          <button onClick={triggerEmergency} className="btn-danger" style={{ width: '100%' }}>🚨 Emergency Alert</button>
          <h3>My Complaints</h3>
          {complaints.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No complaints yet</p>
          ) : (
            complaints.map(c => (
              <div key={c._id} className="complaint-item">
                <p><strong>{c.category.toUpperCase()}</strong>: {c.description}</p>
                <span className={`status-badge status-${c.status === 'pending' ? 'pending' : c.status === 'in-progress' ? 'in-progress' : 'resolved'}`}>
                  {c.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <TimetableGenerator />

      <div className="card">
        <h2>📢 Notices</h2>
        {notices.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>No notices available</p>
        ) : (
          notices.map(n => (
            <div key={n._id} className="notice-item">
              <h4>{n.title}</h4>
              <p>{n.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
