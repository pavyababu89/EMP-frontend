import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import {
  getEmployeesAPI,
  createEmployeeAPI,
  updateEmployeeAPI,
  deleteEmployeeAPI,
  getDepartmentsAPI
} from '../../services/api';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    role: 'employee',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, deptRes] = await Promise.all([
        getEmployeesAPI(),
        getDepartmentsAPI(),
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      setError('Error fetching data');
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
    try {
      if (editEmployee) {
        await updateEmployeeAPI(editEmployee.id, form);
        setSuccess('Employee updated successfully!');
      } else {
        await createEmployeeAPI(form);
        setSuccess('Employee created successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError('Error saving employee. Please check all fields.');
    }
  };

  const handleEdit = (emp) => {
    setEditEmployee(emp);
    setForm({
      username: emp.user?.username || '',
      password: '',
      first_name: emp.user?.first_name || '',
      last_name: emp.user?.last_name || '',
      email: emp.user?.email || '',
      phone: emp.phone || '',
      address: emp.address || '',
      department: emp.department?.id || '',
      role: emp.role || 'employee',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployeeAPI(id);
        setSuccess('Employee deleted successfully!');
        fetchData();
      } catch (err) {
        setError('Error deleting employee');
      }
    }
  };

  const resetForm = () => {
    setForm({
      username: '',
      password: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      department: '',
      role: 'employee',
    });
    setEditEmployee(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#1a237e' }}>👥 Manage Employees</h3>
            <p style={{ color: '#666', margin: '4px 0 0' }}>Add, edit or remove employees</p>
          </div>
          <button
            onClick={openAddModal}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1a237e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            + Add Employee
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Employee Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a237e', color: 'white' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Username</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Department</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Phone</th>
                <th style={{ padding: '14px 16px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '12px 16px' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '500' }}>
                      {emp.user?.first_name} {emp.user?.last_name}
                    </div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{emp.user?.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{emp.user?.username}</td>
                  <td style={{ padding: '12px 16px' }}>{emp.department?.name || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      backgroundColor: emp.role === 'admin' ? '#e3f2fd' : '#e8f5e9',
                      color: emp.role === 'admin' ? '#1565c0' : '#2e7d32',
                    }}>
                      {emp.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{emp.phone || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button
                      onClick={() => handleEdit(emp)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#1565c0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '8px',
                        fontSize: '12px',
                      }}
                    >✏️ Edit</button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#c62828',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >🗑️ Delete</button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                    No employees found. Add your first employee!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '30px',
              width: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}>
              <h5 style={{ marginBottom: '20px', color: '#1a237e' }}>
                {editEmployee ? '✏️ Edit Employee' : '➕ Add Employee'}
              </h5>

              {/* Form */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>First Name</label>
                  <input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Last Name</label>
                  <input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Last name"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Username</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Username"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>
                    Password {editEmployee && <span style={{ color: '#999', fontWeight: 'normal' }}>(leave blank to keep)</span>}
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Password"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Phone"
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Address</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Address"
                    rows="2"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Department</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: '600' }}>Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

              </div>

              {error && <div className="alert alert-danger mt-3">{error}</div>}

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
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
                    backgroundColor: '#1a237e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >{editEmployee ? 'Update' : 'Create'}</button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageEmployees;