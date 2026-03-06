import { useState, useEffect } from 'react';
import API from '../../utils/api';

const HostelStats = () => {
  const [stats, setStats] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [blockStudents, setBlockStudents] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/warden/hostel-stats');
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const viewBlockStudents = async (block) => {
    try {
      const { data } = await API.get(`/warden/students/${block}`);
      setBlockStudents(data);
      setSelectedBlock(block);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="card">
      <h2>🏢 Hostel Statistics</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#e0e7ff', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#3730a3', marginBottom: '5px' }}>Total Students</p>
          <h3 style={{ fontSize: '28px', color: '#3730a3', margin: 0 }}>{stats.totalStudents}</h3>
        </div>
        <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#991b1b', marginBottom: '5px' }}>Active Emergencies</p>
          <h3 style={{ fontSize: '28px', color: '#991b1b', margin: 0 }}>{stats.activeEmergencies}</h3>
        </div>
        <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '5px' }}>Pending Complaints</p>
          <h3 style={{ fontSize: '28px', color: '#92400e', margin: 0 }}>{stats.pendingComplaints}</h3>
        </div>
        <div style={{ background: '#d1fae5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#065f46', marginBottom: '5px' }}>Total Complaints</p>
          <h3 style={{ fontSize: '28px', color: '#065f46', margin: 0 }}>{stats.totalComplaints}</h3>
        </div>
      </div>

      <h3>Students by Hostel Block</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
        {Object.entries(stats.blockCounts).map(([block, count]) => (
          <div 
            key={block}
            onClick={() => viewBlockStudents(block)}
            style={{ 
              background: selectedBlock === block ? '#2d3748' : '#f5f7fa',
              color: selectedBlock === block ? 'white' : '#1a1a1a',
              padding: '15px 25px',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '2px solid #e8e8e8'
            }}
          >
            <strong>Block {block}</strong>: {count} students
          </div>
        ))}
      </div>

      {selectedBlock && blockStudents.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Block {selectedBlock} Students</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ background: '#f5f7fa', borderBottom: '2px solid #e8e8e8' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Room</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Department</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Year</th>
                </tr>
              </thead>
              <tbody>
                {blockStudents.map((student, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px' }}>{student.name}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#64748b' }}>{student.email}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>{student.roomNumber}</td>
                    <td style={{ padding: '12px' }}>{student.department}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{student.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelStats;
