import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const FacultyDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Faculty Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout} style={{ padding: '10px', background: '#dc3545', color: '#fff', border: 'none' }}>Logout</button>
      <div style={{ marginTop: '20px' }}>
        <h2>Student Analytics</h2>
        <p>View student productivity reports here...</p>
      </div>
    </div>
  );
};

export default FacultyDashboard;
