import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { getAttendanceAPI } from '../../services/api';

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await getAttendanceAPI();
      setAttendance(res.data);
    } catch (err) {
      console.error('Error fetching attendance', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter attendance based on date and status
  const filteredAttendance = attendance.filter((a) => {
    const matchDate = filterDate ? a.date === filterDate : true;
    const matchStatus = filterStatus ? a.status === filterStatus : true;
    return matchDate && matchStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'present': return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'absent': return { backgroundColor: '#ffebee', color: '#c62828' };
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
      <AdminSidebar />

      <div style={{ marginLeft: '250px', padding: '30px', flex: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: 0, color: '#1a237e' }}>📅 Attendance Records</h3>
          <p style={{ color: '#666', margin: '4px 0 0' }}>View all employee attendance</p>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
              Filter by Date
            </label>
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ width: '200px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
              Filter by Status
            </label>
            <select
              className="form-control"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half_day">Half Day</option>
            </select>
          </div>

          <button
            onClick={() => { setFilterDate(''); setFilterStatus(''); }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >Clear Filters</button>

        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {[
            { label: 'Total Records', value: filteredAttendance.length, color: '#1565c0', bg: '#e3f2fd' },
            { label: 'Present', value: filteredAttendance.filter(a => a.status === 'present').length, color: '#2e7d32', bg: '#e8f5e9' },
            { label: 'Absent', value: filteredAttendance.filter(a => a.status === 'absent').length, color: '#c62828', bg: '#ffebee' },
          ].map((card) => (
            <div key={card.label} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${card.color}`,
            }}>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>{card.label}</p>
              <h3 style={{ margin: '4px 0 0', color: card.color }}>{card.value}</h3>
            </div>
          ))}
        </div>

        {/* Attendance Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a237e', color: 'white' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Employee</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Check In</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Check Out</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((att, index) => (
                <tr key={att.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>
                    {att.employee_name}
                  </td>
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
              {filteredAttendance.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    No attendance records found!
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

export default AdminAttendance;