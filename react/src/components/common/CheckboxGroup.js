import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const CheckboxGroup = ({ labels }) => {
  const [checkedItems, setCheckedItems] = useState({});

  const handleChange = (index) => {
    setCheckedItems({
      ...checkedItems,
      [index]: !checkedItems[index]
    });
  };

  return (
    <FormGroup row sx={{marginTop: '20px'}}>
      {labels.map((label, index) => (
        <FormControlLabel
          key={index}
          control={
            <Checkbox
              color="success"
              checked={checkedItems[index] || false}
              onChange={() => handleChange(index)}
            />
          }
          label={label}
          labelPlacement="bottom"
        />
      ))}
    </FormGroup>
  );
};

export default CheckboxGroup;
