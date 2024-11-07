import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const Btnprimary = ({ onClick, children }) => {
    return (
        <button className="btn btn-primary" onClick={onClick}>
            {children}
        </button>
    );
};

export default Btnprimary;

