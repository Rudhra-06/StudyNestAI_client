import API from '../../utils/api';

const QuickActions = ({ onRefresh }) => {
  
  const publishNotice = async () => {
    const title = prompt('Notice Title:');
    const content = prompt('Notice Content:');
    if (!title || !content) return;
    
    try {
      await API.post('/notices', {
        title,
        content,
        targetRole: ['student'],
        priority: 'high'
      });
      alert('Notice published successfully!');
      onRefresh && onRefresh();
    } catch (error) {
      alert('Failed to publish notice');
    }
  };

  const viewFeedback = async () => {
    try {
      const { data } = await API.get('/feedback');
      if (data.length === 0) {
        alert('No feedback available');
        return;
      }
      
      let feedbackText = 'Recent Feedback:\n\n';
      data.slice(0, 5).forEach((f, i) => {
        feedbackText += `${i + 1}. [${f.category}] ${f.content} - Rating: ${f.rating}/5\n\n`;
      });
      alert(feedbackText);
    } catch (error) {
      alert('Failed to fetch feedback');
    }
  };

  return (
    <div className="card">
      <h2>⚡ Quick Actions</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '20px' }}>
        <button 
          onClick={publishNotice}
          className="btn-success"
          style={{ width: '100%', padding: '20px', fontSize: '16px' }}
        >
          📢 Publish Notice
        </button>
        
        <button 
          onClick={viewFeedback}
          className="btn-info"
          style={{ width: '100%', padding: '20px', fontSize: '16px' }}
        >
          💬 View Feedback
        </button>
        
        <button 
          onClick={onRefresh}
          className="btn-secondary"
          style={{ width: '100%', padding: '20px', fontSize: '16px' }}
        >
          🔄 Refresh Data
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          className="btn-secondary"
          style={{ width: '100%', padding: '20px', fontSize: '16px' }}
        >
          🏠 Reload Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
