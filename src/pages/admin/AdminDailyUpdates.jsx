import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { getDailyUpdatesAPI } from '../../services/api';

const AdminDailyUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await getDailyUpdatesAPI();
      setUpdates(res.data);
    } catch (err) {
      setError('Error fetching daily updates');
    } finally {
      setLoading(false);
    }
  };

  // Filter updates
  const filteredUpdates = updates.filter((u) => {
    const matchStatus = filterStatus ? u.status === filterStatus : true;
    const matchDate = filterDate ? u.date === filterDate : true;
    return matchStatus && matchDate;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':  return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'in_progress': return { backgroundColor: '#e3f2fd', color: '#1565c0' };
      case 'blocked':    return { backgroundColor: '#ffebee', color: '#c62828' };
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
          <h3 style={{ margin: 0, color: '#1a237e' }}>📝 Daily Updates</h3>
          <p style={{ color: '#666', margin: '4px 0 0' }}>View all employee daily updates</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {[
            { label: 'Completed', value: updates.filter(u => u.status === 'completed').length, color: '#2e7d32' },
            { label: 'In Progress', value: updates.filter(u => u.status === 'in_progress').length, color: '#1565c0' },
            { label: 'Blocked', value: updates.filter(u => u.status === 'blocked').length, color: '#c62828' },
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

        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '16px 20px',
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
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="blocked">Blocked</option>
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

        {/* Updates Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a237e', color: 'white' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Employee</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Project</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Task Done</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUpdates.map((update, index) => (
                <tr key={update.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>
                    {update.employee_name}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{update.project_name}</td>
                  <td style={{ padding: '12px 16px', maxWidth: '200px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {update.task_done}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      ...getStatusStyle(update.status)
                    }}>
                      {update.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{update.date}</td>
                </tr>
              ))}
              {filteredUpdates.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    No daily updates found!
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

export default AdminDailyUpdates;