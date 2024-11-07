import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  TextField,
} from '@mui/material';
import permissionService from '../../services/PermissionService';

const PermissionTable = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const permissionsData = await permissionService.fetchPermission();
        permissionsData.sort((a, b) => a.id - b.id);
        setPermissions(permissionsData);
        setLoading(false);
        console.log('Success fetching permissions:', permissionsData);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setError('Failed to fetch permissions');
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      const allPermissionIds = permissions.map((perm) => perm.id);
      setSelectedPermissions(allPermissionIds);
      console.log('Selected all permissions:', allPermissionIds);
    } else {
      setSelectedPermissions([]);
      console.log('Deselected all permissions');
    }
  };

  const handlePermissionSelect = (event, permissionId) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedPermissions((prevSelected) => [...prevSelected, permissionId]);
      console.log('Selected permission:', permissionId);
    } else {
      setSelectedPermissions((prevSelected) =>
        prevSelected.filter((id) => id !== permissionId)
      );
      console.log('Deselected permission:', permissionId);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Permission Name', flex: 1 },
  ];

  const rows = permissions.map((perm) => ({
    id: perm.id,
    name: perm.name,
  }));

  if (loading) {
    return (
      <Typography variant="body1" style={{ margin: '16px' }}>
        Loading permissions...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" style={{ margin: '16px', color: 'red' }}>
        {error}
      </Typography>
    );
  }

  return (
    <Paper style={{ height: '100%', width: '100%' }}>
      <TextField
        label="Search permissions"
        variant="outlined"
        onChange={handleSearchChange}
        fullWidth
        style={{ marginBottom: '16px' }}
        InputProps={{ style: { fontSize: '14px' } }}
        autoComplete="off"
      />
      <div style={{ height: 400, width: '100%', maxWidth: '100%' }}>
        <DataGrid
          rows={rows.filter((row) =>
            row.name.toLowerCase().includes(searchText)
          )}
          columns={columns}
          pageSize={5}
          checkboxSelection
          selectionModel={selectedPermissions}
          onSelectionModelChange={(newSelection) => {
            setSelectedPermissions(newSelection.selectionModel);
            console.log('Selected permissions:', newSelection.selectionModel);
          }}
          components={{
            Toolbar: () => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                }
                label="Select All"
              />
            ),
          }}
          onRowClick={(params, event) => {
            handlePermissionSelect(event, params.row.id);
          }}
        />
      </div>
    </Paper>
  );
};

export default PermissionTable;
