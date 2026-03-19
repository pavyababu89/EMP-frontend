import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { getEmployeesAPI, getAttendanceAPI, getLeavesAPI, getDailyUpdatesAPI } from '../../services/api';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [empRes, attRes, leaveRes, updateRes] = await Promise.all([
        getEmployeesAPI(),
        getAttendanceAPI(),
        getLeavesAPI(),
        getDailyUpdatesAPI(),
      ]);
      setEmployees(empRes.data);
      setAttendance(attRes.data);
      setLeaves(leaveRes.data);
      setDailyUpdates(updateRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  // Count pending leaves
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;

  // Count today's attendance
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today).length;

  const cards = [
    { label: 'Total Employees', value: employees.length, icon: '👥', color: '#1565c0' },
    { label: 'Present Today', value: todayAttendance, icon: '📅', color: '#2e7d32' },
    { label: 'Pending Leaves', value: pendingLeaves, icon: '📋', color: '#e65100' },
    { label: 'Daily Updates', value: dailyUpdates.length, icon: '📝', color: '#6a1b9a' },
  ];

  if (loading) {
    return (
      <div style={{ marginLeft: '250px', padding: '40px', textAlign: 'center' }}>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ marginLeft: '250px', padding: '30px', flex: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: 0, color: '#1a237e' }}>Admin Dashboard</h3>
          <p style={{ color: '#666', margin: '4px 0 0' }}>Welcome back, Admin!</p>
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

          {/* Recent Employees */}
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h5 style={{ marginBottom: '16px', color: '#1a237e' }}>👥 Recent Employees</h5>
            {employees.slice(0, 5).map((emp) => (
              <div key={emp.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#e3f2fd',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px'
                }}>👤</div>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>
                    {emp.user?.first_name} {emp.user?.last_name}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {emp.department?.name || 'No Department'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Leaves */}
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h5 style={{ marginBottom: '16px', color: '#e65100' }}>📋 Pending Leaves</h5>
            {leaves.filter(l => l.status === 'pending').slice(0, 5).map((leave) => (
              <div key={leave.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>
                    {leave.employee_name}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>
                    {leave.leave_type} • {leave.start_date}
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px',
                  backgroundColor: '#fff3e0',
                  color: '#e65100',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>Pending</span>
              </div>
            ))}
            {leaves.filter(l => l.status === 'pending').length === 0 && (
              <p style={{ color: '#666', textAlign: 'center' }}>No pending leaves ✅</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;