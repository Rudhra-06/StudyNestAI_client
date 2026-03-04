import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import io from 'socket.io-client';

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
    <div style={{ padding: '20px' }}>
      <h1>Student Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout} style={{ padding: '10px', background: '#dc3545', color: '#fff', border: 'none', marginBottom: '20px' }}>Logout</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h2>Study Bot</h2>
          <p>Current Streak: {streak} days</p>
          {activeSession ? (
            <div>
              <p>Studying: {activeSession.subject}</p>
              <button onClick={endStudy} style={{ padding: '10px', background: '#dc3545', color: '#fff', border: 'none' }}>End Session</button>
            </div>
          ) : (
            <button onClick={startStudy} style={{ padding: '10px', background: '#28a745', color: '#fff', border: 'none' }}>Start Study</button>
          )}
        </div>

        <div style={{ border: '1px solid #ccc', padding: '20px' }}>
          <h2>Hostel Companion</h2>
          <button onClick={submitComplaint} style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', margin: '5px' }}>Submit Complaint</button>
          <button onClick={triggerEmergency} style={{ padding: '10px', background: '#ff0000', color: '#fff', border: 'none', margin: '5px' }}>Emergency Alert</button>
          <h3>My Complaints</h3>
          {complaints.map(c => (
            <div key={c._id} style={{ background: '#f9f9f9', padding: '10px', margin: '5px' }}>
              <p><strong>{c.category}</strong>: {c.description}</p>
              <p>Status: {c.status}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px' }}>
        <h2>Notices</h2>
        {notices.map(n => (
          <div key={n._id} style={{ background: '#fff3cd', padding: '10px', margin: '5px' }}>
            <h4>{n.title}</h4>
            <p>{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
