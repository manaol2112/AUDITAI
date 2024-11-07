import React, { useState, useEffect, useMemo } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import TextField from '@mui/material/TextField';
import permissionService from '../../services/PermissionService';
import FilterTiltShiftIcon from '@mui/icons-material/FilterTiltShift';

const CheckboxList = () => {
  const [checked, setChecked] = useState([]);
  const [perm, setPerm] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await permissionService.fetchPermission();
        setPerm(response);
        console.log('Success fetching permissions:', response);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermission();
  }, []);

  const handleToggle = (value) => () => {
    setChecked((prevChecked) => {
      const currentIndex = prevChecked.indexOf(value);
      if (currentIndex === -1) {
        return [...prevChecked, value];
      } else {
        return prevChecked.filter((item) => item !== value);
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAllChecked) {
      setChecked([]);
    } else {
      const newChecked = perm.map((permission) => permission.name);
      setChecked(newChecked);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const filteredPermissions = useMemo(
    () =>
      perm.filter((permission) =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [perm, searchTerm]
  );

  return (
    <div>
      <TextField
        label="Search Permissions"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{ style: { fontSize: '14px' } }}
        autoComplete="off"
      />

      <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper', maxHeight: '500', overflow: 'auto' }}>
        <ListItem disablePadding>
          <ListItemButton dense onClick={handleSelectAll}>
            <ListItemIcon>
              <Checkbox edge="start" checked={selectAllChecked} tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText primary="Select All" />
          </ListItemButton>
        </ListItem>

        {filteredPermissions.map((permission, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                <FilterTiltShiftIcon sx={{color: 'green'}} />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(permission.name)} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(permission.name) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={permission.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CheckboxList;
