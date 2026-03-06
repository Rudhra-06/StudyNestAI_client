import { useState, useEffect } from 'react';
import API from '../../utils/api';

const AttendanceTracker = () => {
  const [stats, setStats] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    status: 'Present',
    entryTime: ''
  });

  useEffect(() => {
    fetchStats();
    fetchTodayAttendance();
    fetchStudents();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/attendance/stats');
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const { data } = await API.get('/attendance/today');
      setTodayAttendance(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await API.get('/warden/hostel-stats');
      // Fetch all students from all blocks
      const allStudents = [];
      for (const block of Object.keys(data.blockCounts)) {
        const { data: blockStudents } = await API.get(`/warden/students/${block}`);
        allStudents.push(...blockStudents);
      }
      setStudents(allStudents);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      await API.post('/attendance/mark', formData);
      alert('Attendance marked successfully!');
      setShowMarkForm(false);
      fetchStats();
      fetchTodayAttendance();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📅 Attendance Tracker</h2>
        <button onClick={() => setShowMarkForm(!showMarkForm)} className="btn-success">
          {showMarkForm ? '❌ Cancel' : '✅ Mark Attendance'}
        </button>
      </div>

      {showMarkForm && (
        <div style={{ background: '#f5f7fa', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <form onSubmit={handleMarkAttendance}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              <div className="form-group">
                <select 
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name} - {s.roomNumber}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late Entry">Late Entry</option>
                </select>
              </div>
              <div className="form-group">
                <input 
                  type="time"
                  value={formData.entryTime}
                  onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Submit</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#dbeafe', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '5px' }}>Total</p>
          <h3 style={{ fontSize: '28px', color: '#1e40af', margin: 0 }}>{stats.totalStudents}</h3>
        </div>
        <div style={{ background: '#d1fae5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#065f46', marginBottom: '5px' }}>Present</p>
          <h3 style={{ fontSize: '28px', color: '#065f46', margin: 0 }}>{stats.present}</h3>
        </div>
        <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#991b1b', marginBottom: '5px' }}>Absent</p>
          <h3 style={{ fontSize: '28px', color: '#991b1b', margin: 0 }}>{stats.absent}</h3>
        </div>
        <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '5px' }}>Late Entry</p>
          <h3 style={{ fontSize: '28px', color: '#92400e', margin: 0 }}>{stats.lateEntry}</h3>
        </div>
        <div style={{ background: '#e0e7ff', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#3730a3', marginBottom: '5px' }}>Attendance %</p>
          <h3 style={{ fontSize: '28px', color: '#3730a3', margin: 0 }}>{stats.attendancePercentage}%</h3>
        </div>
      </div>

      <h3>Today's Attendance</h3>
      {todayAttendance.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No attendance marked yet</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f7fa', borderBottom: '2px solid #e8e8e8' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Student</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Block</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Room</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Entry Time</th>
              </tr>
            </thead>
            <tbody>
              {todayAttendance.map((a, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>{a.studentId?.name}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{a.studentId?.hostelBlock}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{a.studentId?.roomNumber}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span className={`status-badge status-${a.status === 'Present' ? 'resolved' : a.status === 'Absent' ? 'active' : 'pending'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {a.entryTime ? new Date(a.entryTime).toLocaleTimeString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;
