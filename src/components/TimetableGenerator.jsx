import { useState } from 'react';
import API from '../utils/api';

const TimetableGenerator = () => {
  const [timetable, setTimetable] = useState(null);
  const [academicSchedule, setAcademicSchedule] = useState('');

  const handleGenerate = async () => {
    try {
      let parsedSchedule = {};
      if (academicSchedule) {
        parsedSchedule = JSON.parse(academicSchedule);
      }
      
      const { data } = await API.post('/timetable/generate', { academicSchedule: parsedSchedule });
      setTimetable(data);
      alert('Timetable generated successfully!');
    } catch (error) {
      alert('Failed to generate timetable');
    }
  };

  const fetchTimetable = async () => {
    try {
      const { data } = await API.get('/timetable');
      setTimetable(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card">
      <h2>📅 AI Timetable Generator</h2>
      
      <div className="file-upload">
        <p>📤 Upload Academic Schedule (JSON format)</p>
        <textarea
          placeholder='{"Monday": [{"subject": "Math", "startTime": "09:00", "endTime": "10:00"}]}'
          value={academicSchedule}
          onChange={(e) => setAcademicSchedule(e.target.value)}
          style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />
      </div>

      <button onClick={handleGenerate} className="btn-success" style={{ marginRight: '10px' }}>
        Generate Timetable
      </button>
      <button onClick={fetchTimetable} className="btn-info">
        View Current Timetable
      </button>

      {timetable && timetable.schedule && timetable.schedule.length > 0 && (
        <div className="timetable-display">
          <h3>📚 Your Weekly Study Schedule</h3>
          <p><strong>Total Workload:</strong> {timetable.workload} hours/week</p>
          
          {timetable.schedule.map((day, idx) => (
            <div key={idx} className={`timetable-day priority-${day.slots[0]?.priority || 'medium'}`}>
              <h4>{day.day}</h4>
              {day.slots.map((slot, i) => (
                <div key={i} className="timetable-slot">
                  <span><strong>{slot.subject}</strong></span>
                  <span>{slot.startTime} - {slot.endTime}</span>
                  <span className={`status-badge status-${slot.priority === 'high' ? 'active' : slot.priority === 'medium' ? 'in-progress' : 'resolved'}`}>
                    {slot.priority}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimetableGenerator;
