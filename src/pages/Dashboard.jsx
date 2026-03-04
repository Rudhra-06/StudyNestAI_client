import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import FacultyDashboard from '../components/FacultyDashboard';
import WardenDashboard from '../components/WardenDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Loading...</div>;

  const dashboards = {
    student: <StudentDashboard />,
    faculty: <FacultyDashboard />,
    warden: <WardenDashboard />,
    admin: <AdminDashboard />
  };

  return dashboards[user.role] || <div>Invalid role</div>;
};

export default Dashboard;
