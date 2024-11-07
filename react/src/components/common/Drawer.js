import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const DynamicDrawer = ({ open, onClose, children }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          width: 400,
          position: 'relative',  // Set position relative for the close button
          padding: 2,            // Optional: Add some padding if needed
        }}
        role="presentation"
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 2,        // Adjust positioning as needed
            right: 2,   // Adjust positioning as needed
          }}
        >
          <CloseIcon />
        </IconButton>
        {children}
      </Box>
    </Drawer>
  );
};

export default DynamicDrawer;
