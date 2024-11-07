import React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

function CustomSpeedDial({ actions, onClick }) {
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: 'fixed', bottom: 40, right: 50 }}
      icon={<SpeedDialIcon />}
      onClick={onClick}
    >
      {/* {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
         
        />
      ))} */}
    </SpeedDial>
  );
}

export default CustomSpeedDial;
