import React from 'react';

const Card = () => {
  const cardStyle = {
    width: '140px',
    height: '150px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Example shadow
    // Additional styles
    backgroundColor: '#fff',
    borderRadius: '15px',
    padding: '16px',
    boxSizing: 'border-box',
  };

  return (
    <div style={cardStyle}>
      {/* Content of the card */}
    </div>
  );
}

export default Card;
