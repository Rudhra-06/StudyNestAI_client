import { useState, useEffect } from 'react';
import API from '../../utils/api';

const RoomMaintenance = () => {
  const [inspections, setInspections] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    cleanlinessScore: 5,
    organizationScore: 5,
    hygieneScore: 5,
    remarks: ''
  });

  useEffect(() => {
    fetchInspections();
  }, [selectedBlock]);

  const fetchInspections = async () => {
    try {
      const url = selectedBlock ? `/warden/room-inspections?block=${selectedBlock}` : '/warden/room-inspections';
      const { data } = await API.get(url);
      setInspections(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudentsByBlock = async (block) => {
    try {
      const { data } = await API.get(`/warden/students/${block}`);
      setStudents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddInspection = async (e) => {
    e.preventDefault();
    try {
      await API.post('/warden/room-inspection', formData);
      alert('Room inspection added successfully!');
      setShowForm(false);
      setFormData({
        studentId: '',
        cleanlinessScore: 5,
        organizationScore: 5,
        hygieneScore: 5,
        remarks: ''
      });
      fetchInspections();
    } catch (error) {
      alert('Failed to add inspection');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🏠 Room Maintenance Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-success">
          {showForm ? '❌ Cancel' : '➕ Add Inspection'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f5f7fa', padding: '25px', borderRadius: '12px', marginBottom: '25px' }}>
          <h3 style={{ marginBottom: '20px' }}>New Room Inspection</h3>
          <form onSubmit={handleAddInspection}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Select Block</label>
                <select 
                  onChange={(e) => {
                    fetchStudentsByBlock(e.target.value);
                    setFormData({ ...formData, studentId: '' });
                  }}
                  required
                >
                  <option value="">Choose Block</option>
                  <option value="A">Block A</option>
                  <option value="B">Block B</option>
                  <option value="C">Block C</option>
                  <option value="D">Block D</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Select Student</label>
                <select 
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                >
                  <option value="">Choose Student</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} - Room {s.roomNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Cleanliness Score: {formData.cleanlinessScore}/10
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={formData.cleanlinessScore}
                  onChange={(e) => setFormData({ ...formData, cleanlinessScore: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Organization Score: {formData.organizationScore}/10
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={formData.organizationScore}
                  onChange={(e) => setFormData({ ...formData, organizationScore: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Hygiene Score: {formData.hygieneScore}/10
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={formData.hygieneScore}
                  onChange={(e) => setFormData({ ...formData, hygieneScore: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Remarks</label>
                <input 
                  type="text"
                  placeholder="Optional remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '15px' }}>
              Submit Inspection
            </button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: '600' }}>Filter by Block:</label>
        <select 
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          style={{ padding: '8px 15px', borderRadius: '8px', border: '2px solid #e8e8e8' }}
        >
          <option value="">All Blocks</option>
          <option value="A">Block A</option>
          <option value="B">Block B</option>
          <option value="C">Block C</option>
          <option value="D">Block D</option>
        </select>
      </div>

      {inspections.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No inspections recorded</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f7fa', borderBottom: '2px solid #e8e8e8' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Student</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Block</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Room</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Overall</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Cleanliness</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Organization</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Hygiene</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Remarks</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((inspection, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '600' }}>{inspection.studentId?.name}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{inspection.studentId?.email}</div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                    {inspection.hostelBlock}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {inspection.roomNumber}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ 
                      background: getScoreColor(inspection.overallScore),
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {inspection.overallScore}/10
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: getScoreColor(inspection.cleanlinessScore) }}>
                    {inspection.cleanlinessScore}/10
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: getScoreColor(inspection.organizationScore) }}>
                    {inspection.organizationScore}/10
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: getScoreColor(inspection.hygieneScore) }}>
                    {inspection.hygieneScore}/10
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#64748b' }}>
                    {inspection.remarks || '-'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    {new Date(inspection.inspectionDate).toLocaleDateString()}
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

export default RoomMaintenance;
