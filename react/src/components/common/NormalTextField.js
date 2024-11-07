import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function NormalTextField({
  label,
  value,
  onChange,
  name,
  required,
  type,
  isMultiLine,
  rows,
  onBlur,
  helperText,
  error
}) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      component="form"
      sx={{
        // width: 500,
        maxWidth: '100%',
      }}
    >
      <TextField
        InputProps={{
          style: { fontSize: '14px' },
          endAdornment:
            type === 'password' && (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={toggleShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
        }}
        margin="normal"
        type={showPassword ? 'text' : type} // Update the type dynamically
        fullWidth
        multiline={isMultiLine} // Enable multi-line input dynamically
        rows={rows} // Calculate the number of rows dynamically
        label={label}
        value={value}
        onChange={onChange}
        autoComplete="off"
        id={name}
        onBlur={onBlur}
        name={name}
        aria-label={label}
        required={required}
        InputLabelProps={{ shrink: true }}
        helperText={error ? helperText : ''}
        error={error}
      />
    </Box>
    
  );
}
