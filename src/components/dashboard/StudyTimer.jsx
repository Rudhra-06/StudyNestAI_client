import { useState, useEffect } from 'react';
import API from '../../utils/api';

const StudyTimer = ({ onSessionEnd }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [subject, setSubject] = useState('');
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = async () => {
    const subjectName = prompt('Enter subject name:');
    if (!subjectName) return;

    try {
      const { data } = await API.post('/study/start', { subject: subjectName });
      setSessionId(data._id);
      setSubject(subjectName);
      setIsRunning(true);
      setSeconds(0);
    } catch (error) {
      alert('Failed to start timer');
    }
  };

  const stopTimer = async () => {
    if (!sessionId) return;

    try {
      await API.put(`/study/end/${sessionId}`);
      setIsRunning(false);
      alert(`Session completed! You studied ${subject} for ${formatTime(seconds)}`);
      setSeconds(0);
      setSubject('');
      setSessionId(null);
      onSessionEnd && onSessionEnd();
    } catch (error) {
      alert('Failed to stop timer');
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    setIsRunning(true);
  };

  return (
    <div className="card">
      <h2>⏱️ Study Timer</h2>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
        padding: '40px',
        borderRadius: '15px',
        textAlign: 'center',
        margin: '20px 0'
      }}>
        <div style={{ fontSize: '56px', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
          {formatTime(seconds)}
        </div>
        {subject && (
          <div style={{ color: '#10b981', fontSize: '18px', fontWeight: '600' }}>
            📚 {subject}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {!sessionId ? (
          <button 
            onClick={startTimer}
            className="btn-success"
            style={{ padding: '15px 40px', fontSize: '16px' }}
          >
            ▶️ Start Timer
          </button>
        ) : (
          <>
            {isRunning ? (
              <button 
                onClick={pauseTimer}
                className="btn-secondary"
                style={{ padding: '15px 40px', fontSize: '16px' }}
              >
                ⏸️ Pause
              </button>
            ) : (
              <button 
                onClick={resumeTimer}
                className="btn-info"
                style={{ padding: '15px 40px', fontSize: '16px' }}
              >
                ▶️ Resume
              </button>
            )}
            <button 
              onClick={stopTimer}
              className="btn-danger"
              style={{ padding: '15px 40px', fontSize: '16px' }}
            >
              ⏹️ Stop & Save
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f5f7fa', borderRadius: '10px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          💡 Tip: Take a 5-minute break every 25 minutes for better focus!
        </p>
      </div>
    </div>
  );
};

export default StudyTimer;
