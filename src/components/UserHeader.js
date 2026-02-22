import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserHeader = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="user-header">
      <div className="user-info">
        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <span className="user-name">{user?.name}</span>
          <span className="user-email">{user?.email}</span>
        </div>
      </div>
      <button onClick={logout} className="logout-btn">
        🚪 Logout
      </button>
    </div>
  );
};

export default UserHeader;