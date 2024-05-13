import React from 'react';
import { useNavigate } from 'react-router-dom';

// import { Button } from 'react-bootstrap';

import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        localStorage.removeItem('clubName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('attendances');
        props.onLogout();
      });
  }

  return (
    <div>
        <h1>Welcome</h1>
        <div className='playerName'>{props.userName}</div>
        <div className="login-button">
            <button className="btn btn-primary"
            variant="primary" onClick={() => navigate('/attendance')}>
                Attendance
            </button>
            <button className="btn btn-primary"
            variant="primary" onClick={() => logout()}>
                Logout
            </button>
        </div>
    </div>
  );
}
