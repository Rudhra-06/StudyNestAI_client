import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import API from '../../utils/api';

const ExpenseDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'maintenance',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAnalytics();
    fetchExpenses();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/hostel-expenses/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data } = await API.get('/hostel-expenses');
      setExpenses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await API.post('/hostel-expenses', formData);
      alert('Expense added successfully!');
      setShowForm(false);
      setFormData({
        category: 'maintenance',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchAnalytics();
      fetchExpenses();
    } catch (error) {
      alert('Failed to add expense');
    }
  };

  if (!analytics) return <div>Loading...</div>;

  const trendData = {
    labels: analytics.monthlyTrend.map(m => m.month),
    datasets: [{
      label: 'Monthly Expenses (₹)',
      data: analytics.monthlyTrend.map(m => m.total),
      backgroundColor: '#3b82f6',
      borderColor: '#2563eb',
      borderWidth: 2
    }]
  };

  const categoryData = {
    labels: Object.keys(analytics.categoryBreakdown),
    datasets: [{
      data: Object.values(analytics.categoryBreakdown),
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>💰 Hostel Expense Monitoring</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-success">
          {showForm ? '❌ Cancel' : '➕ Add Expense'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f5f7fa', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <form onSubmit={handleAddExpense}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              <div className="form-group">
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="electricity">Electricity</option>
                  <option value="water">Water</option>
                  <option value="internet">Internet</option>
                  <option value="food">Food</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <input 
                  type="number"
                  placeholder="Amount (₹)"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <input 
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Add Expense</button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: '#dbeafe', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '5px' }}>Total This Month</p>
          <h3 style={{ fontSize: '28px', color: '#1e40af', margin: 0 }}>₹{analytics.totalExpense}</h3>
        </div>
        <div style={{ background: '#d1fae5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#065f46', marginBottom: '5px' }}>Total Expenses</p>
          <h3 style={{ fontSize: '28px', color: '#065f46', margin: 0 }}>{analytics.expenseCount}</h3>
        </div>
        <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '5px' }}>Categories</p>
          <h3 style={{ fontSize: '28px', color: '#92400e', margin: 0 }}>{Object.keys(analytics.categoryBreakdown).length}</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>6-Month Trend</h3>
          <Bar data={trendData} />
        </div>
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Category Breakdown</h3>
          <Pie data={categoryData} />
        </div>
      </div>

      <h3>Recent Expenses</h3>
      {expenses.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No expenses recorded</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f7fa', borderBottom: '2px solid #e8e8e8' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Added By</th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(0, 10).map((e, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>{new Date(e.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="status-badge status-in-progress">{e.category}</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#ef4444' }}>
                    ₹{e.amount}
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#64748b' }}>{e.description}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{e.addedBy?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseDashboard;
