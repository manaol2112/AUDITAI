import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../../assets/images/logo.jpeg';
import backgroundImg from '../../assets/images/techAI.jpg';
import { Btnprimary, Input, PasswordField } from '../common';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Cookies from 'js-cookie'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // State for error message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(username, password);
  
      if (response && response.access) {
        const { access, groups } = response;
  
        Cookies.set('token', access, { expires: 1, secure: true, sameSite: 'strict' });
        Cookies.set('groups', JSON.stringify(groups));
        
        setIsLoggedIn(true); // Update state to show logged-in UI

        window.location.href = '/dashboard';
        // window.location.reload();

      } else {
        setErrorMessage('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please try again.');
    }
  };  

  return (
    <div style={{ 
      backgroundImage: `url(${backgroundImg})`, 
      backgroundSize: 'cover', 
      minHeight: '100vh', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
        <form onSubmit={handleLogin}>
          <div className="card text-center mx-auto my-auto"
            style={{ width: '80%', maxWidth: '30rem', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="card-header">
              <img src={logo} width="50" height="50" className="d-inline-block align-top" alt="" />
              <span className="menu-collapsed">
                <h5 style={{ marginTop: '10px', color: '#474b4d' }}>AuditAI</h5>
              </span>
            </div>
            <div className="card-body">
                {errorMessage && (
                    <div className="alert alert-warning" role="alert">
                      {errorMessage}
                    </div>
                  )}
              <div className="form-floating mb-3">
                <Input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="form-floating mb-3">
                <PasswordField
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="form-floating mb-4">
                <Btnprimary type="submit">Login</Btnprimary>
              </div>
            </div>
          </div>
        </form>
    </div>
  );
};

export default Login;
