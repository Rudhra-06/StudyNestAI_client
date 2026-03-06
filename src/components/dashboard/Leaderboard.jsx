import { useState, useEffect } from 'react';
import API from '../../utils/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await API.get('/leaderboard');
      setLeaderboard(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  return (
    <div className="card">
      <h2>🏆 Leaderboard - Top Students</h2>
      
      {leaderboard.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No data available</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ background: '#f5f7fa', borderBottom: '2px solid #e8e8e8' }}>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Rank</th>
                <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Score</th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Hours</th>
                <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Streak</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((student, index) => (
                <tr 
                  key={index} 
                  style={{ 
                    borderBottom: '1px solid #f0f0f0',
                    background: index < 3 ? '#fafafa' : 'white',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f7fa'}
                  onMouseLeave={(e) => e.currentTarget.style.background = index < 3 ? '#fafafa' : 'white'}
                >
                  <td style={{ padding: '15px', fontSize: '20px', fontWeight: 'bold' }}>
                    {getMedalEmoji(index + 1)}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{student.name}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>{student.email}</div>
                    </div>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#10b981', fontSize: '18px' }}>
                    {student.score}
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center', color: '#64748b' }}>
                    {student.totalHours}h
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center', color: '#64748b' }}>
                    🔥 {student.streak}
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

export default Leaderboard;
