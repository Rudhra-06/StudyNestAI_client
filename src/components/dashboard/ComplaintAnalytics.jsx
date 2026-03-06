import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import API from '../../utils/api';

ChartJS.register(ArcElement, Tooltip, Legend);

const ComplaintAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/warden/complaint-analytics');
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!analytics) return <div>Loading...</div>;

  const statusData = {
    labels: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    datasets: [{
      data: [
        analytics.statusCounts.pending,
        analytics.statusCounts.inProgress,
        analytics.statusCounts.resolved,
        analytics.statusCounts.rejected
      ],
      backgroundColor: ['#fbbf24', '#3b82f6', '#10b981', '#ef4444'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const categoryData = {
    labels: Object.keys(analytics.categoryCounts),
    datasets: [{
      data: Object.values(analytics.categoryCounts),
      backgroundColor: ['#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6', '#6366f1'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  return (
    <div className="card">
      <h2>📊 Complaint Analytics</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#dbeafe', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '5px' }}>Total</p>
          <h3 style={{ fontSize: '28px', color: '#1e40af', margin: 0 }}>{analytics.total}</h3>
        </div>
        <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '5px' }}>Pending</p>
          <h3 style={{ fontSize: '28px', color: '#92400e', margin: 0 }}>{analytics.statusCounts.pending}</h3>
        </div>
        <div style={{ background: '#d1fae5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#065f46', marginBottom: '5px' }}>Resolved</p>
          <h3 style={{ fontSize: '28px', color: '#065f46', margin: 0 }}>{analytics.statusCounts.resolved}</h3>
        </div>
        <div style={{ background: '#fce7f3', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#9f1239', marginBottom: '5px' }}>Avg Time</p>
          <h3 style={{ fontSize: '28px', color: '#9f1239', margin: 0 }}>{analytics.avgResolutionTime}h</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>By Status</h3>
          <Pie data={statusData} />
        </div>
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>By Category</h3>
          <Pie data={categoryData} />
        </div>
      </div>
    </div>
  );
};

export default ComplaintAnalytics;
