import { Link, useNavigate, useLocation } from 'react-router-dom';

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/employee/attendance', label: 'My Attendance', icon: '📅' },
    { path: '/employee/leaves', label: 'My Leaves', icon: '📋' },
    { path: '/employee/daily-updates', label: 'Daily Updates', icon: '📝' },
    { path: '/employee/profile', label: 'My Profile', icon: '👤' },
  ];

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={{
      width: '250px',
      minHeight: '100vh',
      backgroundColor: '#00695c',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>

      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: 0, fontWeight: 'bold' }}>EMS</h4>
        <small style={{ opacity: 0.7 }}>Employee Panel</small>
      </div>

      {/* User Info */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px'
        }}>
          👤
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {user?.user?.first_name} {user?.user?.last_name}
          </div>
          <div style={{ opacity: 0.7, fontSize: '12px' }}>Employee</div>
        </div>
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              color: 'white',
              textDecoration: 'none',
              backgroundColor: location.pathname === item.path
                ? 'rgba(255,255,255,0.2)'
                : 'transparent',
              borderLeft: location.pathname === item.path
                ? '4px solid white'
                : '4px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          🚪 Logout
        </button>
      </div>

    </div>
  );
};

export default EmployeeSidebar;