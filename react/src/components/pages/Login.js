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
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null); // State for error message

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(username, password);

      if (response && response.access) {
        const { access } = response;

        const { groups } = response;

        Cookies.set('token', access, { expires: 1, secure: true, sameSite: 'strict', httpOnly: true });

         // Optionally: Save groups in localStorage or state if needed
         Cookies.set('groups', JSON.stringify(groups));


        // Navigate to Dashboard or any other authenticated route
        navigate('/Dashboard');
      } else {
        setErrorMessage('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please try again.');
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem('token'); // Remove access token from localStorage
    Cookies.remove('token'); // Remove access token from cookies
    localStorage.removeItem('refresh_token'); // Remove refresh token from localStorage
    Cookies.remove('refresh_token'); // Remove refresh token from cookies
    Cookies.remove('csrftoken'); // Remove refresh token from cookies
    window.location.href = '/login';
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
      {isLoggedIn ? (
        <div>
          <p>You are logged in.</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Login;
