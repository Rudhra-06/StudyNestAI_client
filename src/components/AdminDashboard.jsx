import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout} style={{ padding: '10px', background: '#dc3545', color: '#fff', border: 'none' }}>Logout</button>
      <div style={{ marginTop: '20px' }}>
        <h2>System Analytics</h2>
        <p>Full system monitoring and analytics...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
