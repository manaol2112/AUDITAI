import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from '@mui/material';

const DynamicSnackbar = ({ open, message, severity, onClose }) => {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={1500}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Positioning at top center
    >
      <Alert
        sx={{ backgroundColor: 'white', color: 'black', boxShadow: 'none' }} // Customize background color
        severity={severity}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default DynamicSnackbar;
