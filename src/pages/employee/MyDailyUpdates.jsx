import { useState, useEffect } from 'react';
import EmployeeSidebar from '../../components/EmployeeSidebar';
import { getDailyUpdatesAPI, submitDailyUpdateAPI } from '../../services/api';

const MyDailyUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    project_name: '',
    task_done: '',
    status: 'in_progress',
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!form.project_name || !form.task_done) {
      setError('Please fill all fields!');
      return;
    }
    try {
      await submitDailyUpdateAPI(form);
      setSuccess('Daily update submitted successfully!');
      setShowForm(false);
      resetForm();
      fetchUpdates();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error submitting daily update!');
    }
  };

  const resetForm = () => {
    setForm({
      project_name: '',
      task_done: '',
      status: 'in_progress',
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':   return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'in_progress': return { backgroundColor: '#e3f2fd', color: '#1565c0' };
      case 'blocked':     return { backgroundColor: '#ffebee', color: '#c62828' };
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
            <h3 style={{ margin: 0, color: '#00695c' }}>📝 My Daily Updates</h3>
            <p style={{ color: '#666', margin: '4px 0 0' }}>Submit and track your daily work</p>
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
            {showForm ? '✕ Cancel' : '+ Add Update'}
          </button>
        </div>

        {/* Messages */}
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Submit Form */}
        {showForm && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <h5 style={{ marginBottom: '20px', color: '#00695c' }}>📌 Submit Daily Update</h5>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={form.project_name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter project name"
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
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Task Done
                </label>
                <textarea
                  name="task_done"
                  value={form.task_done}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Describe what you did today..."
                  rows="4"
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
                >Submit Update</button>
              </div>

            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {[
            { label: 'Completed',   value: updates.filter(u => u.status === 'completed').length,   color: '#2e7d32' },
            { label: 'In Progress', value: updates.filter(u => u.status === 'in_progress').length, color: '#1565c0' },
            { label: 'Blocked',     value: updates.filter(u => u.status === 'blocked').length,     color: '#c62828' },
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

        {/* Updates Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#00695c', color: 'white' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Project</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Task Done</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((update, index) => (
                <tr key={update.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '500' }}>
                    {update.project_name}
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '250px' }}>
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
              {updates.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    No daily updates yet!
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

export default MyDailyUpdates;