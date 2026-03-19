import { useState, useEffect } from 'react';
import EmployeeSidebar from '../../components/EmployeeSidebar';
import { getAttendanceAPI, getLeavesAPI, getDailyUpdatesAPI } from '../../services/api';

const EmployeeDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [attRes, leaveRes, updateRes] = await Promise.all([
        getAttendanceAPI(),
        getLeavesAPI(),
        getDailyUpdatesAPI(),
      ]);
      setAttendance(attRes.data);
      setLeaves(leaveRes.data);
      setDailyUpdates(updateRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  // Today's date
  const today = new Date().toISOString().split('T')[0];

  // Check if already marked today
  const todayAttendance = attendance.find(a => a.date === today);

  // Count leaves by status
  const pendingLeaves  = leaves.filter(l => l.status === 'pending').length;
  const approvedLeaves = leaves.filter(l => l.status === 'approved').length;

  const cards = [
    { label: 'Total Attendance', value: attendance.length, icon: '📅', color: '#1565c0' },
    { label: 'Pending Leaves',   value: pendingLeaves,     icon: '⏳', color: '#e65100' },
    { label: 'Approved Leaves',  value: approvedLeaves,    icon: '✅', color: '#2e7d32' },
    { label: 'Daily Updates',    value: dailyUpdates.length, icon: '📝', color: '#6a1b9a' },
  ];

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
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: 0, color: '#00695c' }}>
            Welcome, {user?.user?.first_name}! 👋
          </h3>
          <p style={{ color: '#666', margin: '4px 0 0' }}>
            Here's your summary for today — {today}
          </p>
        </div>

        {/* Today's Attendance Status */}
        <div style={{
          backgroundColor: todayAttendance ? '#e8f5e9' : '#fff3e0',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '24px',
          borderLeft: `4px solid ${todayAttendance ? '#2e7d32' : '#e65100'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ fontSize: '24px' }}>
            {todayAttendance ? '✅' : '⚠️'}
          </span>
          <div>
            <div style={{ fontWeight: 'bold', color: todayAttendance ? '#2e7d32' : '#e65100' }}>
              {todayAttendance
                ? `Attendance marked — ${todayAttendance.status.replace('_', ' ').toUpperCase()}`
                : 'Attendance not marked today!'}
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              {todayAttendance
                ? `Check in: ${todayAttendance.check_in || 'N/A'}`
                : 'Go to My Attendance to mark your attendance'}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          {cards.map((card) => (
            <div key={card.label} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${card.color}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>{card.label}</p>
                  <h2 style={{ margin: '4px 0 0', color: card.color }}>{card.value}</h2>
                </div>
                <span style={{ fontSize: '32px' }}>{card.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Recent Leaves */}
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h5 style={{ marginBottom: '16px', color: '#00695c' }}>📋 Recent Leaves</h5>
            {leaves.slice(0, 5).map((leave) => (
              <div key={leave.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>
                    {leave.leave_type.replace('_', ' ').toUpperCase()}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {leave.start_date} → {leave.end_date}
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  backgroundColor:
                    leave.status === 'approved' ? '#e8f5e9' :
                    leave.status === 'rejected' ? '#ffebee' : '#fff3e0',
                  color:
                    leave.status === 'approved' ? '#2e7d32' :
                    leave.status === 'rejected' ? '#c62828' : '#e65100',
                }}>
                  {leave.status.toUpperCase()}
                </span>
              </div>
            ))}
            {leaves.length === 0 && (
              <p style={{ color: '#666', textAlign: 'center' }}>No leaves applied yet</p>
            )}
          </div>

          {/* Recent Daily Updates */}
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h5 style={{ marginBottom: '16px', color: '#00695c' }}>📝 Recent Daily Updates</h5>
            {dailyUpdates.slice(0, 5).map((update) => (
              <div key={update.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>
                    {update.project_name}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {update.date}
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  backgroundColor:
                    update.status === 'completed'  ? '#e8f5e9' :
                    update.status === 'in_progress' ? '#e3f2fd' : '#ffebee',
                  color:
                    update.status === 'completed'  ? '#2e7d32' :
                    update.status === 'in_progress' ? '#1565c0' : '#c62828',
                }}>
                  {update.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            ))}
            {dailyUpdates.length === 0 && (
              <p style={{ color: '#666', textAlign: 'center' }}>No daily updates yet</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;