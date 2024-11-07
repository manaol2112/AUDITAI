import * as React from 'react';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function SwitchesGroup({ switches, title, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.name, event.target.checked);
  };

  return (
    <FormControl component="fieldset" variant="standard" sx={{ marginTop: '20px' }}>
      <FormLabel component="legend" sx={{ fontSize: '14px' }}>{title}</FormLabel>
      <FormGroup>
        {switches.map((item) => (
          <FormControlLabel
            key={item.name}
            control={
              <Switch
                checked={item.checked}
                onChange={(e) => onChange(item.name, e.target.checked)}
                name={item.name}
                style={{ fontSize: '12px' }}
              />
            }
            label={item.label}
            sx={{ fontSize: '12px', marginTop: '3px' }}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}
