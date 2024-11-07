import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const PasswordField = ({ required, value, onChange  }) => {
    return (
        <input
        className="form-control form-control-sm"
        autoComplete="off" 
        type="password" 
        id="password" 
        placeholder="Password" 
        aria-label="Password"
        value={value}
        onChange={onChange}/>
    );
};

export default PasswordField;

