import { useState, useEffect } from 'react';
import API from '../../utils/api';

const ProductivityCard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchProductivity();
  }, []);

  const fetchProductivity = async () => {
    try {
      const { data } = await API.get('/productivity/user');
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="card">
      <h2>📊 Productivity Analysis</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>Total Study Hours</p>
          <h3 style={{ color: '#1e40af', fontSize: '32px', margin: 0 }}>{data.totalStudyHours}</h3>
        </div>

        <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>Weekly Hours</p>
          <h3 style={{ color: '#16a34a', fontSize: '32px', margin: 0 }}>{data.weeklyStudyHours}</h3>
        </div>

        <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>Current Streak</p>
          <h3 style={{ color: '#ca8a04', fontSize: '32px', margin: 0 }}>{data.streak} days</h3>
        </div>

        <div style={{ background: '#fce7f3', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>Productivity Score</p>
          <h3 style={{ color: '#be185d', fontSize: '32px', margin: 0 }}>{data.productivityScore}</h3>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#fafafa', borderRadius: '10px' }}>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          <strong>Weekly Consistency:</strong> {data.weeklyConsistency}% | 
          <strong> Total Sessions:</strong> {data.totalSessions}
        </p>
      </div>
    </div>
  );
};

export default ProductivityCard;
