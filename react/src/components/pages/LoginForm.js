import React, { useState } from 'react';
import logo from '../../assets/images/logo.jpeg';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Cookies from 'js-cookie';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(username, password);

      if (response && response.access) {
        const { access, groups } = response;

        Cookies.set('token', access, { expires: 1, secure: true, sameSite: 'strict' });
        Cookies.set('groups', JSON.stringify(groups));

        setIsLoggedIn(true);

        window.location.href = '/dashboard';
      } else {
        setErrorMessage('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please try again.');
    }
  };

  const handleChange = (e, field) => {
    if (errorMessage) setErrorMessage(null);
    if (field === 'username') {
      setUsername(e.target.value);
    } else if (field === 'password') {
      setPassword(e.target.value);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Your Company" src={logo} className="mx-auto h-10 w-auto" />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  value={username}
                  onChange={(e) => handleChange(e, 'username')}
                  id="email"
                  name="email"
                  required
                  autoComplete="off"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-[#0D6EFD] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <br />
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => handleChange(e, 'password')}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-[#0D6EFD] sm:text-sm"
                />
              </div>
            </div>

            {/* Display error message if there's one */}
            {errorMessage && (
              <div className="mt-4 text-center text-sm text-red-500">
                {errorMessage}
              </div>
            )}

            <div>
              <br />
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#0D6EFD] px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0a58ca] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D6EFD]"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <a href="/register" className="font-semibold text-[#0D6EFD] hover:text-[#0a58ca]">
              Sign-up for a free demo
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
