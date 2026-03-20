import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    localStorage.clear(); 

    try {
      // Step 1 — Get JWT tokens
      const res = await loginAPI({ username, password });
      const { access, refresh } = res.data;

      // Step 2 — Save tokens in localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Step 3 — Decode token to get role
      const payload = JSON.parse(atob(access.split('.')[1]));
      const userId = payload.user_id;

      // Step 4 — Get user role from Django
      const profileRes = await fetch('http://127.0.0.1:8000/api/employees/me/', {
        headers: { Authorization: `Bearer ${access}` }
      });
      const profileData = await profileRes.json();
      const role = profileData.role;

      // Step 5 — Save role and user info
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(profileData));

      // Step 6 — Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }

    } catch (err) {
      setError('Invalid username or password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '420px' }}>

        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">EMS</h2>
          <p className="text-muted">Employee Management System</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;