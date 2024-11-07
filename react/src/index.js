import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import LinearProgress from '@mui/material/LinearProgress';

function Main() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating a delay to showcase loading indicator
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after some delay
    }, 500); // Simulate 2 seconds loading time

    // Clean up timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <React.StrictMode>
      {loading ? (
        <LinearProgress />
      ) : (
        <App />
      )}
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);

reportWebVitals();
