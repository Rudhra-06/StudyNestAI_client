import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import API from '../../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeeklyChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchWeeklyStats();
  }, []);

  const fetchWeeklyStats = async () => {
    try {
      const { data } = await API.get('/productivity/weekly');
      
      setChartData({
        labels: data.labels,
        datasets: [
          {
            label: 'Study Hours',
            data: data.data,
            backgroundColor: '#10b981',
            borderColor: '#059669',
            borderWidth: 2,
            borderRadius: 8
          }
        ]
      });
    } catch (error) {
      console.error(error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Weekly Study Hours',
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

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div className="card">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default WeeklyChart;
