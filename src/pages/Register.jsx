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
    const { name, value } = e.target;
    
    // Auto-detect role based on email
    if (name === 'email') {
      let detectedRole = 'student';
      if (value.includes('.admin@sece.ac.in')) {
        detectedRole = 'admin';
      } else if (value.includes('warden.') && value.includes('@sece.ac.in')) {
        detectedRole = 'warden';
      } else if (value.includes('.faculty@sece.ac.in')) {
        detectedRole = 'faculty';
      } else if (value.includes('@sece.ac.in')) {
        detectedRole = 'student';
      }
      setFormData({ ...formData, [name]: value, role: detectedRole });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email format
    if (!formData.email.includes('@sece.ac.in')) {
      alert('Please use your SECE email address (@sece.ac.in)');
      return;
    }
    
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
          <input 
            name="email" 
            type="email" 
            placeholder="Email (e.g., name.s2024csbs@sece.ac.in, name.admin@sece.ac.in)" 
            onChange={handleChange} 
            required 
          />
          {formData.email && (
            <small style={{ color: '#10b981', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              Role detected: <strong>{formData.role.toUpperCase()}</strong>
            </small>
          )}
        </div>
        <div className="form-group">
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
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
