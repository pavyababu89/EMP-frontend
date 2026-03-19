import { useState, useEffect } from 'react';
import EmployeeSidebar from '../../components/EmployeeSidebar';
import { getMyProfileAPI } from '../../services/api';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMyProfileAPI();
      setProfile(res.data);
    } catch (err) {
      setError('Error fetching profile');
    } finally {
      setLoading(false);
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
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: 0, color: '#00695c' }}>👤 My Profile</h3>
          <p style={{ color: '#666', margin: '4px 0 0' }}>Your personal information</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {profile && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>

            {/* Profile Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              textAlign: 'center',
            }}>
              {/* Avatar */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#e8f5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                margin: '0 auto 16px',
              }}>
                👤
              </div>

              <h4 style={{ margin: '0 0 4px', color: '#00695c' }}>
                {profile.user?.first_name} {profile.user?.last_name}
              </h4>
              <p style={{ color: '#666', margin: '0 0 16px' }}>
                @{profile.user?.username}
              </p>

              <span style={{
                padding: '6px 16px',
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold',
              }}>
                {profile.role?.toUpperCase()}
              </span>

              <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                textAlign: 'left',
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#666', fontSize: '12px' }}>Department</span>
                  <div style={{ fontWeight: '500' }}>
                    {profile.department?.name || 'Not Assigned'}
                  </div>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '12px' }}>Joined On</span>
                  <div style={{ fontWeight: '500' }}>{profile.join_date}</div>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              <h5 style={{ marginBottom: '24px', color: '#00695c' }}>
                📋 Personal Details
              </h5>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                <div>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                    First Name
                  </div>
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '6px',
                    fontWeight: '500',
                  }}>
                    {profile.user?.first_name || '—'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                    Last Name
                  </div>
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '6px',
                    fontWeight: '500',
                  }}>
                    {profile.user?.last_name || '—'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                    Email
                  </div>
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '6px',
                    fontWeight: '500',
                  }}>
                    {profile.user?.email || '—'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                    Phone
                  </div>
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '6px',
                    fontWeight: '500',
                  }}>
                    {profile.phone || '—'}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                    Address
                  </div>
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '6px',
                    fontWeight: '500',
                  }}>
                    {profile.address || '—'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                    Department
                  </div>
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '6px',
                    fontWeight: '500',
                  }}>
                    {profile.department?.name || 'Not Assigned'}
                  </div>
                </div>

                <div>
                  <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                    Join Date
                  </div>
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '6px',
                    fontWeight: '500',
                  }}>
                    {profile.join_date || '—'}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default MyProfile;