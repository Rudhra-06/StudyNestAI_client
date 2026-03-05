import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👑 Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: '20px', color: '#667eea', fontWeight: 'bold' }}>Welcome, {user.name}!</span>
          <button onClick={logout} className="btn-danger">Logout</button>
        </div>
      </div>
      <div className="card">
        <h2>📊 System Analytics</h2>
        <p>Full system monitoring and analytics coming soon...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
