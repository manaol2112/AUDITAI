import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ element: Element, requiredGroup, ...rest }) => {
  const token = Cookies.get('token');
  const storedGroups = Cookies.get('groups');
  const groups = storedGroups ? JSON.parse(storedGroups) : [];

  try {
    if (!token) {
      return <Navigate to="/Login" />;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      return <Navigate to="/Login" />;
    }

    if (!groups.includes(requiredGroup)) {
      return <Navigate to="/Login" />;
    }

    return <Outlet {...rest} />;

  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return <Navigate to="/Login" />;
  }
};

export default PrivateRoute;

