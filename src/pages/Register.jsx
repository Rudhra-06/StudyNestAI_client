import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    year: '',
    hostelBlock: '',
    roomNumber: ''
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', formData);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Register - StudyNestAI</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        <select name="role" onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '10px 0' }}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="warden">Warden</option>
          <option value="admin">Admin</option>
        </select>
        <input name="department" placeholder="Department" onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        <input name="year" type="number" placeholder="Year" onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        <input name="hostelBlock" placeholder="Hostel Block" onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        <input name="roomNumber" placeholder="Room Number" onChange={handleChange} style={{ width: '100%', padding: '10px', margin: '10px 0' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none' }}>
          Register
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register;
