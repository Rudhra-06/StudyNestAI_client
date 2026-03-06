import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import API from '../../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DailyProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [todayData, setTodayData] = useState(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchProgress();
    fetchToday();
  }, [days]);

  const fetchProgress = async () => {
    try {
      const { data } = await API.get(`/progress/daily?days=${days}`);
      setProgressData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchToday = async () => {
    try {
      const { data } = await API.get('/progress/today');
      setTodayData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const chartData = {
    labels: progressData.map(d => {
      const date = new Date(d.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Study Hours',
        data: progressData.map(d => d.totalHours),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Last ${days} Days Study Progress`,
        font: {
          size: 18,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        }
      }
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📈 Daily Progress Tracker</h2>
        <select 
          value={days} 
          onChange={(e) => setDays(e.target.value)}
          style={{ padding: '8px 15px', borderRadius: '8px', border: '2px solid #e8e8e8' }}
        >
          <option value="7">Last 7 Days</option>
          <option value="14">Last 14 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      {todayData && (
        <div style={{ 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '25px',
          borderRadius: '12px',
          color: 'white',
          marginBottom: '25px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px' }}>📅 Today's Progress</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Total Hours</p>
              <h2 style={{ margin: '5px 0 0 0', fontSize: '32px' }}>{todayData.totalHours}</h2>
            </div>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Sessions</p>
              <h2 style={{ margin: '5px 0 0 0', fontSize: '32px' }}>{todayData.sessions}</h2>
            </div>
            <div>
              <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Subjects</p>
              <h2 style={{ margin: '5px 0 0 0', fontSize: '32px' }}>{todayData.subjects.length}</h2>
            </div>
          </div>
          {todayData.subjects.length > 0 && (
            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>Subjects:</strong> {todayData.subjects.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      <Line data={chartData} options={options} />

      <div style={{ marginTop: '25px' }}>
        <h3>📊 Detailed Breakdown</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr style={{ background: '#f5f7fa', borderBottom: '2px solid #e8e8e8' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Hours</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Sessions</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Subjects</th>
              </tr>
            </thead>
            <tbody>
              {progressData.slice().reverse().map((day, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#10b981' }}>
                    {day.totalHours}h
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {day.sessions}
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#64748b' }}>
                    {day.subjects.length > 0 ? day.subjects.join(', ') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyProgress;
