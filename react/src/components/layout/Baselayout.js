// BaseLayout.jsx
import React from 'react';
import { Header, Footer, Sidebar } from './components/layout';

// Now you can use Header, Sidebar, Footer components in your code


const BaseLayout = ({ children }) => {
  return (
    <div>
        <Hello World/>
    </div>
  );
};

export default BaseLayout;
