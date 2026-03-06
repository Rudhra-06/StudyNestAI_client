import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import API from '../../utils/api';

const FeedbackAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/feedback/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!analytics) return <div>Loading...</div>;

  const chartData = {
    labels: Object.keys(analytics.categoryCounts),
    datasets: [{
      data: Object.values(analytics.categoryCounts),
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  return (
    <div className="card">
      <h2>💬 Feedback Analytics</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#dbeafe', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '5px' }}>Total Feedback</p>
          <h3 style={{ fontSize: '28px', color: '#1e40af', margin: 0 }}>{analytics.totalFeedback}</h3>
        </div>
        <div style={{ background: '#d1fae5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#065f46', marginBottom: '5px' }}>Avg Rating</p>
          <h3 style={{ fontSize: '28px', color: '#065f46', margin: 0 }}>{analytics.avgRating}/5</h3>
        </div>
        <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '5px' }}>Categories</p>
          <h3 style={{ fontSize: '28px', color: '#92400e', margin: 0 }}>{Object.keys(analytics.categoryCounts).length}</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Feedback by Category</h3>
          <Pie data={chartData} />
        </div>
        
        <div>
          <h3 style={{ marginBottom: '15px' }}>Recent Feedback</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {analytics.recentFeedback.map((f, idx) => (
              <div key={idx} style={{ background: '#f5f7fa', padding: '12px', margin: '8px 0', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <strong style={{ color: '#1a1a1a' }}>{f.category}</strong>
                  <span style={{ color: '#f59e0b' }}>⭐ {f.rating}/5</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{f.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;
