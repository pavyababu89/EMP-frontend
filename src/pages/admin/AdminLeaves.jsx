import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { getLeavesAPI, updateLeaveStatusAPI } from '../../services/api';

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await getLeavesAPI();
      setLeaves(res.data);
    } catch (err) {
      setError('Error fetching leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeaveStatusAPI(id, { status: newStatus });
      setSuccess(`Leave ${newStatus} successfully!`);
      fetchLeaves();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error updating leave status');
    }
  };

  const filteredLeaves = leaves.filter((l) => {
    return filterStatus ? l.status === filterStatus : true;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'rejected': return { backgroundColor: '#ffebee', color: '#c62828' };
      case 'pending':  return { backgroundColor: '#fff3e0', color: '#e65100' };
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
          <h3 style={{ margin: 0, color: '#1a237e' }}>📋 Leave Management</h3>
          <p style={{ color: '#666', margin: '4px 0 0' }}>View and approve/reject employee leaves</p>
        </div>

        {/* Messages */}
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {[
            { label: 'Pending', value: leaves.filter(l => l.status === 'pending').length, color: '#e65100' },
            { label: 'Approved', value: leaves.filter(l => l.status === 'approved').length, color: '#2e7d32' },
            { label: 'Rejected', value: leaves.filter(l => l.status === 'rejected').length, color: '#c62828' },
          ].map((card) => (
            <div key={card.label} style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${card.color}`,
            }}>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>{card.label} Leaves</p>
              <h3 style={{ margin: '4px 0 0', color: card.color }}>{card.value}</h3>
            </div>
          ))}
        </div>

        {/* Filter */}
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
              Filter by Status
            </label>
            <select
              className="form-control"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="">All Leaves</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            onClick={() => setFilterStatus('')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >Clear</button>
        </div>

        {/* Leaves Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a237e', color: 'white' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Employee</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Leave Type</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>From</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>To</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Reason</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave, index) => (
                <tr key={leave.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>
                    {leave.employee_name}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {leave.leave_type.replace('_', ' ').toUpperCase()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{leave.start_date}</td>
                  <td style={{ padding: '12px 16px' }}>{leave.end_date}</td>
                  <td style={{ padding: '12px 16px', maxWidth: '150px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {leave.reason}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      ...getStatusStyle(leave.status)
                    }}>
                      {leave.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {leave.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleStatusChange(leave.id, 'approved')}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#2e7d32',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >✅ Approve</button>
                        <button
                          onClick={() => handleStatusChange(leave.id, 'rejected')}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#c62828',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >❌ Reject</button>
                      </div>
                    )}
                    {leave.status !== 'pending' && (
                      <span style={{ color: '#999', fontSize: '12px' }}>Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    No leave records found!
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

export default AdminLeaves;