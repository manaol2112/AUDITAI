import React, { useState } from 'react';
import { Btnprimary, Input, PasswordField, Card} from '../common';
import { NavBar, SideBar } from '../layout';

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
      sessionStorage.removeItem('token');
      
      setIsLoggedIn(false);
  };
  return (
    <div>
        <SideBar handleLogout={handleLogout}/>
    </div>
  );
};

export default Dashboard;
