import { useState, useEffect } from 'react';
import EmployeeSidebar from '../../components/EmployeeSidebar';
import { getLeavesAPI, applyLeaveAPI } from '../../services/api';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    leave_type: 'sick',
    start_date: '',
    end_date: '',
    reason: '',
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!form.start_date || !form.end_date || !form.reason) {
      setError('Please fill all fields!');
      return;
    }
    if (form.end_date < form.start_date) {
      setError('End date cannot be before start date!');
      return;
    }
    try {
      await applyLeaveAPI(form);
      setSuccess('Leave applied successfully!');
      setShowForm(false);
      resetForm();
      fetchLeaves();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error applying leave!');
    }
  };

  const resetForm = () => {
    setForm({
      leave_type: 'sick',
      start_date: '',
      end_date: '',
      reason: '',
    });
  };

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
      <EmployeeSidebar />

      <div style={{ marginLeft: '250px', padding: '30px', flex: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#00695c' }}>📋 My Leaves</h3>
            <p style={{ color: '#666', margin: '4px 0 0' }}>Apply and track your leaves</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00695c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {showForm ? '✕ Cancel' : '+ Apply Leave'}
          </button>
        </div>

        {/* Messages */}
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Apply Leave Form */}
        {showForm && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <h5 style={{ marginBottom: '20px', color: '#00695c' }}>📝 Apply for Leave</h5>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Leave Type
                </label>
                <select
                  name="leave_type"
                  value={form.leave_type}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="earned">Earned Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Reason
                </label>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter reason for leave"
                  rows="3"
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => { setShowForm(false); resetForm(); }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >Cancel</button>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#00695c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >Submit Leave</button>
              </div>

            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {[
            { label: 'Total Applied', value: leaves.length, color: '#1565c0' },
            { label: 'Approved', value: leaves.filter(l => l.status === 'approved').length, color: '#2e7d32' },
            { label: 'Pending', value: leaves.filter(l => l.status === 'pending').length, color: '#e65100' },
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

        {/* Leaves Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#00695c', color: 'white' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Leave Type</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>From</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>To</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Reason</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Applied On</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave, index) => (
                <tr key={leave.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px' }}>{index + 1}</td>
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
                    {new Date(leave.applied_on).toLocaleDateString()}
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
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    No leaves applied yet!
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

export default MyLeaves;