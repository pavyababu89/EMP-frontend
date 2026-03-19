import { useState, useEffect } from 'react';
import EmployeeSidebar from '../../components/EmployeeSidebar';
import { getAttendanceAPI, markAttendanceAPI } from '../../services/api';

const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    check_in: '',
    check_out: '',
    remarks: '',
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await getAttendanceAPI();
      setAttendance(res.data);
      console.log('Attendance data:', res.data);  // ← ADD THIS
      console.log('Today:', today); 
    } catch (err) {
    console.log('Full error:', err.response?.data);  // ← ADD THIS
    setError(JSON.stringify(err.response?.data));
    fetchAttendance();
    } finally {
      setLoading(false);
    }
  };

  // Check if today's attendance already marked
  const todayMarked = attendance.find(a => a.date === today);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    try {
      // Clean data before sending
      const dataToSend = {
        date:     form.date,
        status:   form.status,
        remarks:  form.remarks,
      };

      // Only add check_in if it has a value
      if (form.check_in) {
        dataToSend.check_in = form.check_in;
      }

      // Only add check_out if it has a value
      if (form.check_out) {
        dataToSend.check_out = form.check_out;
      }

      await markAttendanceAPI(dataToSend);
      setSuccess('Attendance marked successfully!');
      fetchAttendance();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.log('Error:', err.response?.data);
      setError('Error marking attendance!');
      fetchAttendance();
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'present':  return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'absent':   return { backgroundColor: '#ffebee', color: '#c62828' };
      case 'half_day': return { backgroundColor: '#fff3e0', color: '#e65100' };
      default: return {};
    }
  };

  if (loading) return (
    <div style={{ marginLeft: '250px', padding: '40px', textAlign: 'center' }}>
      <h4>Loading...</h4>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <EmployeeSidebar />

      <div style={{ marginLeft: '250px', padding: '30px', flex: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: 0, color: '#00695c' }}>📅 My Attendance</h3>
          <p style={{ color: '#666', margin: '4px 0 0' }}>Mark and view your attendance</p>
        </div>

        {/* Messages */}
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Mark Attendance Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <h5 style={{ marginBottom: '20px', color: '#00695c' }}>
            {todayMarked ? '✅ Today\'s Attendance Marked' : '📌 Mark Today\'s Attendance'}
          </h5>

          {todayMarked ? (
            <div style={{
              backgroundColor: '#e8f5e9',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              gap: '24px',
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#666' }}>Status</div>
                <div style={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  {todayMarked.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666' }}>Check In</div>
                <div style={{ fontWeight: 'bold' }}>{todayMarked.check_in || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666' }}>Check Out</div>
                <div style={{ fontWeight: 'bold' }}>{todayMarked.check_out || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#666' }}>Remarks</div>
                <div style={{ fontWeight: 'bold' }}>{todayMarked.remarks || '—'}</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="half_day">Half Day</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Check In Time
                </label>
                <input
                  type="time"
                  name="check_in"
                  value={form.check_in}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Check Out Time
                </label>
                <input
                  type="time"
                  name="check_out"
                  value={form.check_out}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Remarks
                </label>
                <input
                  type="text"
                  name="remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Optional remarks"
                />
              </div>

              <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#00695c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  ✅ Mark Attendance
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Attendance History Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <h5 style={{ margin: 0, color: '#00695c' }}>📊 Attendance History</h5>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#00695c', color: 'white' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Check In</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Check Out</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((att, index) => (
                <tr key={att.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px' }}>{att.date}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      ...getStatusStyle(att.status)
                    }}>
                      {att.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{att.check_in || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>{att.check_out || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>{att.remarks || '—'}</td>
                </tr>
              ))}
              {attendance.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    No attendance records yet!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default MyAttendance;