import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEmployees from './pages/admin/ManageEmployees';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminLeaves from './pages/admin/AdminLeaves';
import AdminDailyUpdates from './pages/admin/AdminDailyUpdates';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyAttendance from './pages/employee/MyAttendance';
import MyLeaves from './pages/employee/MyLeaves';
import MyDailyUpdates from './pages/employee/MyDailyUpdates';
import MyProfile from './pages/employee/MyProfile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('access_token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/employees" element={
          <ProtectedRoute allowedRole="admin">
            <ManageEmployees />
          </ProtectedRoute>
        } />
        <Route path="/admin/attendance" element={
          <ProtectedRoute allowedRole="admin">
            <AdminAttendance />
          </ProtectedRoute>
        } />
        <Route path="/admin/leaves" element={
          <ProtectedRoute allowedRole="admin">
            <AdminLeaves />
          </ProtectedRoute>
        } />
        <Route path="/admin/daily-updates" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDailyUpdates />
          </ProtectedRoute>
        } />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={
          <ProtectedRoute allowedRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
        <Route path="/employee/attendance" element={
          <ProtectedRoute allowedRole="employee">
            <MyAttendance />
          </ProtectedRoute>
        } />
        <Route path="/employee/leaves" element={
          <ProtectedRoute allowedRole="employee">
            <MyLeaves />
          </ProtectedRoute>
        } />
        <Route path="/employee/daily-updates" element={
          <ProtectedRoute allowedRole="employee">
            <MyDailyUpdates />
          </ProtectedRoute>
        } />
        <Route path="/employee/profile" element={
          <ProtectedRoute allowedRole="employee">
            <MyProfile />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;