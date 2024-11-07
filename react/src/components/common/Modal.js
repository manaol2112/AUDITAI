import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Modal = ({ open, onClose, style, header, body, footer,size, disableBackdropClick, disableEscapeKeyDown }) => {

  return (
    <div>
       <Dialog open={open} onClose={onClose} disableBackdropClick disableEscapeKeyDown  maxWidth={size}
      fullWidth style={style}>
        {header && (
          <DialogTitle sx={{ fontSize: '16px' }}>{header}</DialogTitle>
        )}
        {body && (
          <DialogContent>
            <DialogContentText>
              {body}
            </DialogContentText>
          </DialogContent>
        )}
        {footer && (
          <DialogActions>
            {footer}
          </DialogActions>
        )}
      </Dialog> 
    </div>
  );
};

export default Modal;
