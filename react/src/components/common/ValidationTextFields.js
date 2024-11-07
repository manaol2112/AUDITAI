import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function FullWidthTextField({ label, value, onChange, name }) {
  return (
    <Box
      sx={{
        width: 500,
        maxWidth: '100%',
      }}
    >
    <label htmlFor={name} style={{ marginBottom: '0.1rem', display: 'block' }}>
        {label}
      </label>
      <TextField
        sx={{ fontSize: '12px' }}
        size="small"
        margin="normal"
        fullWidth
        label={label}
        value={value}
        onChange={onChange}
        autoComplete="off" 
        id={name} 
        name={name} 
        aria-label={label} 
      />
    </Box>
  );
}
