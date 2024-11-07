import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



const Input = ({ required, value, onChange  }) => {
    return (
        <input
            className="form-control form-control-sm"
            autoComplete="off"
            type="text"
            id="username"
            placeholder="Username"
            aria-label="Username"
            required={required}
            value={value}
            onChange={onChange}
        />
    );
};
export default Input;

