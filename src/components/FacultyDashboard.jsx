import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const FacultyDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👨‍🏫 Faculty Dashboard</h1>
        <div>
          <span style={{ marginRight: '20px', color: '#667eea', fontWeight: 'bold' }}>Welcome, {user.name}!</span>
          <button onClick={logout} className="btn-danger">Logout</button>
        </div>
      </div>
      <div className="card">
        <h2>📊 Student Analytics</h2>
        <p>View student productivity reports here...</p>
      </div>
    </div>
  );
};

export default FacultyDashboard;
