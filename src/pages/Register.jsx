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

  const isStudent = formData.role === 'student';

  return (
    <div className="auth-container">
      <h2>Register - StudyNestAI</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input name="name" placeholder="Name" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <select name="role" onChange={handleChange}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="warden">Warden</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <input name="department" placeholder="Department" onChange={handleChange} />
        </div>
        {isStudent && (
          <>
            <div className="form-group">
              <input name="year" type="number" placeholder="Year" onChange={handleChange} />
            </div>
            <div className="form-group">
              <input name="hostelBlock" placeholder="Hostel Block" onChange={handleChange} />
            </div>
            <div className="form-group">
              <input name="roomNumber" placeholder="Room Number" onChange={handleChange} />
            </div>
          </>
        )}
        <button type="submit" className="btn-primary">
          Register
        </button>
      </form>
      <p className="auth-link">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register;
