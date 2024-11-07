import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import GridViewIcon from '@mui/icons-material/GridView';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import appService from '../../../services/ApplicationService';
import DataTable from '../../common/DataGrid';
import { useParams } from 'react-router-dom';
import DynamicTabs from '../../common/DynamicTabs';
import Modal from '../../common/Modal';
import FileUploadUser from '../../common/FileUploadUser';
import DonutChart from '../../common/DonutChart';
import PersonAdd from '@mui/icons-material/PersonAdd';
import DownloadIcon from '@mui/icons-material/Download';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import SFTPService from '../../../services/SFTPService';
import { format } from 'date-fns';
import { BarChart } from '@mui/x-charts/BarChart';
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import SysOwnerSideBar from './SysOwnerSidebar';

const MyApplicationManageUsers = () => {
    const [selectedapps, setSelectedApps] = useState([]);
    const { id } = useParams();
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openSetupModal, setOpenSetupModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [lastRefresh, setLastRefresh] = useState([]);


    const handleOpenCreateModal = () => {
        setOpenCreateModal(true);
    };

    const handleOpenSetupModal = () => {
        setOpenSetupModal(true);
        setOpenCreateModal(false);
    };

    const handleCloseCreateModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenCreateModal(true)
        }
        else {
            setOpenCreateModal(false);
        }
    };

    const handleCloseSetupModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenSetupModal(true)
        }
        else {
            setOpenSetupModal(false);
        }
    };

    //Get the active users
    const activeUsers = users.filter(user => user.STATUS.toLowerCase() === 'active');
    const totalActiveUsers = activeUsers.length;

    //Get unique users based on USER_ID
    const uniqueUserIds = Array.from(new Set(activeUsers.map(user => user.USER_ID)));
    const uniqueActiveUsers = uniqueUserIds.map(id => activeUsers.find(user => user.USER_ID === id));
    const totalUniqueActiveUsers = uniqueActiveUsers.length;

    const allusers_columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'USER_ID', headerName: 'ID', flex: 1 },
        { field: 'EMAIL_ADDRESS', headerName: 'Email Address', flex: 1 },
        { field: 'FIRST_NAME', headerName: 'First Name', flex: 1 },
        { field: 'LAST_NAME', headerName: 'Last Name', flex: 1 },
        { field: 'STATUS', headerName: 'Status', flex: 1 },
        { field: 'ROLE_NAME', headerName: 'Role', flex: 1 },
    ];

    const allusers_rows = activeUsers.map((user, index) => ({
        id: index + 1,
        USER_ID: user.USER_ID || '-',
        EMAIL_ADDRESS: user.EMAIL_ADDRESS || '-',
        FIRST_NAME: user.FIRST_NAME || '-',
        LAST_NAME: user.LAST_NAME || '-',
        STATUS: user.STATUS || '-',
        ROLE_NAME: user.ROLE_NAME || '-',
        appID: user.id
    }));

    const currentYear = new Date().getFullYear();

    const newusers_columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'USER_ID', headerName: 'ID', flex: 1 },
        { field: 'EMAIL_ADDRESS', headerName: 'Email Address', flex: 1 },
        { field: 'FIRST_NAME', headerName: 'First Name', flex: 1 },
        { field: 'LAST_NAME', headerName: 'Last Name', flex: 1 },
        { field: 'STATUS', headerName: 'Status', flex: 1 },
        { field: 'ROLE_NAME', headerName: 'Role', flex: 1 },
        { field: 'DATE_GRANTED', headerName: 'Date Granted', flex: 1 },
    ];

    const newusers_rows = users

        .filter(user => {

            const dateGrantedYear = new Date(user.DATE_GRANTED).getFullYear();

            return dateGrantedYear === currentYear;
        })
        .map((user, index) => ({
            id: index + 1,
            USER_ID: user.USER_ID || '-',
            EMAIL_ADDRESS: user.EMAIL_ADDRESS || '-',
            FIRST_NAME: user.FIRST_NAME || '-',
            LAST_NAME: user.LAST_NAME || '-',
            STATUS: user.STATUS || '-',
            ROLE_NAME: user.ROLE_NAME || '-',
            DATE_GRANTED: user.DATE_GRANTED || '-',
            appID: user.id, 
        }));

    const totalNewUsers = newusers_rows.length


    const inactiveUsers = users.filter(user => user.STATUS.toLowerCase() === 'inactive');
    // Count the number of active users
   

    const termedusers_columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'USER_ID', headerName: 'ID', flex: 1 },
        { field: 'EMAIL_ADDRESS', headerName: 'Email Address', flex: 1 },
        { field: 'FIRST_NAME', headerName: 'First Name', flex: 1 },
        { field: 'LAST_NAME', headerName: 'Last Name', flex: 1 },
        { field: 'STATUS', headerName: 'Status', flex: 1 },
        { field: 'ROLE_NAME', headerName: 'Role', flex: 1 },
        { field: 'DATE_REVOKED', headerName: 'Date Termed', flex: 1 },
    ];

    const termedusers_rows = users
        .filter(user => {
            // Extract the year from DATE_REVOKED (assuming DATE_REVOKED is a valid date string)
            const dateRevokedYear = new Date(user.DATE_REVOKED).getFullYear();
            // Return true if the DATE_REVOKED is in the current year and STATUS is 'INACTIVE'
            return (dateRevokedYear === currentYear) &&
                (user.STATUS && user.STATUS.toUpperCase() === 'INACTIVE');
        })
        .map((user, index) => ({
            id: index + 1,
            USER_ID: user.USER_ID || '-',
            EMAIL_ADDRESS: user.EMAIL_ADDRESS || '-',
            FIRST_NAME: user.FIRST_NAME || '-',
            LAST_NAME: user.LAST_NAME || '-',
            STATUS: user.STATUS || '-',
            ROLE_NAME: user.ROLE_NAME || '-',
            DATE_REVOKED: user.DATE_REVOKED || '-',
            appID: user.id
        }));

     const totalinactiveUsers = termedusers_rows.length;

    const adminusers_columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'USER_ID', headerName: 'ID', flex: 1 },
        { field: 'EMAIL_ADDRESS', headerName: 'Email Address', flex: 1 },
        { field: 'FIRST_NAME', headerName: 'First Name', flex: 1 },
        { field: 'LAST_NAME', headerName: 'Last Name', flex: 1 },
        { field: 'STATUS', headerName: 'Status', flex: 1 },
        { field: 'ROLE_NAME', headerName: 'Role', flex: 1 },
        { field: 'DATE_GRANTED', headerName: 'Date Granted', flex: 1 },
    ];

    const adminusers_rows = users
        .filter(user => {
            return (user.ROLE_NAME && user.ROLE_NAME.toLowerCase().includes('admin')) &&
                (user.STATUS && user.STATUS.toLowerCase() === 'active');
        })
        .map((user, index) => ({
            id: index + 1,
            USER_ID: user.USER_ID || '-',
            EMAIL_ADDRESS: user.EMAIL_ADDRESS || '-',
            FIRST_NAME: user.FIRST_NAME || '-',
            LAST_NAME: user.LAST_NAME || '-',
            STATUS: user.STATUS || '-',
            ROLE_NAME: user.ROLE_NAME || '-',
            DATE_GRANTED: user.DATE_GRANTED || '-',
            appID: user.id
        }));

        const theme = createTheme({
            palette: {
                primary: {
                    main: '#128ECB', // Orange color
                },
                secondary: {
                    main: '#4caf50', // Green color
                },
            },
        });


        const renderNewUserPrepButton = (params) => {
            return (
                <Tooltip title="View Approval Details" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleClick(event, params.row.appID)}
                        marginRight="5px"
                    >
                        <MarkEmailReadIcon />
                    </mui.IconButton>
                </Tooltip>
            )
        }

    const renderTermedUserPrepButton = (params) => {
        return (
            <Tooltip title="View Termination Support" arrow>
                <mui.IconButton
                    sx={{ color: theme.palette.primary.main }}
                    size="small"
                    onClick={(event) => handleClick(event, params.row.appID)}
                    marginRight="5px"
                >
                    <FolderDeleteIcon />
                </mui.IconButton>
            </Tooltip>
        )

    }

    const renderAdminUserPrepButton = (params) => {
        return (
            <Tooltip title="View Users" arrow>
                <mui.IconButton
                    sx={{ color: theme.palette.primary.main }}
                    size="small"
                    onClick={(event) => handleClick(event, params.row.appID)}
                    marginRight="5px"
                >
                    <AdminPanelSettingsIcon />
                </mui.IconButton>
            </Tooltip>
        )

    }

    const allusers_columnsWithActions = [
        ...allusers_columns,
    ];

    const newusers_columnsWithActions = [
        ...newusers_columns,
        {
            field: 'status',
            headerName: 'Support',
            width: 200,
            sortable: false,
            renderCell: renderNewUserPrepButton,
        },
    ];

    const termedusers_columnsWithActions = [
        ...termedusers_columns,
        {
            field: 'status',
            headerName: 'Support',
            width: 200,
            sortable: false,
            renderCell: renderTermedUserPrepButton,
        },
    ];

    const adminusers_columnsWithActions = [
        ...adminusers_columns,
        {
            field: 'status',
            headerName: 'User Details',
            width: 200,
            sortable: false,
            renderCell: renderAdminUserPrepButton,
        },
    ];

    const saveAppChanges = async (updatedData) => {
        try {
            const response = await appService.updateApp(id, updatedData);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    //GENERATE THE DATA FROM THE SERVER
    useEffect(() => {

        const fetchData = async () => {
            try {

                const appsByIdResponse = await appService.fetchAppsById(id);
                if (appsByIdResponse.length !== 0) {
                    setSelectedApps(appsByIdResponse);
                } else {
                    setSelectedApps([])
                }

                const result = await appService.fetchAppsRecordById(id);
                if (result.length !== 0) {
                    setUsers(result);
                    const updatedData = {
                        ...selectedapps,
                        SETUP_USERDATA: true
                    };
                    saveAppChanges(updatedData)

                } else {
                    const updatedData = {
                        ...selectedapps,
                        SETUP_USERDATA: false
                    };
                    saveAppChanges(updatedData)

                    setOpenCreateModal(true);
                }

                const lastRefreshDate = await SFTPService.fetchAppDataImportLog(id);
                console.log('This is the last refresh date', lastRefreshDate)
                if (lastRefreshDate.length !== 0) {
                    setLastRefresh(lastRefreshDate);
                } else {
                    setLastRefresh([])
                }


            } catch (error) {
                console.error('Error fetching data:', error);

                if (error.response && error.response.status === 404) {

                } else {

                }
            }

        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return ''; // Handle case where dateString is not available

        const date = new Date(dateString);
        return format(date, 'MMMM dd, yyyy'); // Format date using date-fns
    };

    //DONUT FOR ALL USERS
    const uniqueRoles = [...new Set(activeUsers.map(user => user.ROLE_NAME))];

    const roleCounts = {};
    activeUsers.forEach(user => {
        const roleName = user.ROLE_NAME;
        if (roleCounts[roleName]) {
            roleCounts[roleName]++;
        } else {
            roleCounts[roleName] = 1;
        }
    });

    const allusers = uniqueRoles.map(roleName => ({
        label: roleName,
        value: roleCounts[roleName] || 0
    }));

    const series = [
        {
            innerRadius: 0,
            outerRadius: 80,
            id: 'series-1',
            data: allusers,
        },
    ];

    //DONUT FOR NEW USERS
    const uniqueNewRoles = [...new Set(newusers_rows.map(user => user.ROLE_NAME))];

    console.log('Unique New', uniqueNewRoles)

    const newroleCounts = {};
    
    newusers_rows.forEach(user => {
        const newroleName = user.ROLE_NAME;
        if (newroleCounts[newroleName]) {
            newroleCounts[newroleName]++;
        } else {
            newroleCounts[newroleName] = 1;
        }
    });

    const newusers = uniqueNewRoles.map(roleName => ({
        label: roleName,
        value: newroleCounts[roleName] || 0
    }));

    const newseries = [
        {
            innerRadius: 0,
            outerRadius: 80,
            id: 'series-1',
            data: newusers,
        },
    ];

      //DONUT FOR TERMED USERS
      const uniqueTermedRoles = [...new Set(termedusers_rows.map(user => user.ROLE_NAME))];

      const termedroleCounts = {};
      termedusers_rows.forEach(user => {
          const termedroleName = user.ROLE_NAME;
          if (termedroleCounts[termedroleName]) {
            termedroleCounts[termedroleName]++;
          } else {
            termedroleCounts[termedroleName] = 1;
          }
      });
  
      const termedusers = uniqueTermedRoles.map(roleName => ({
          label: roleName,
          value: termedroleCounts[roleName] || 0
      }));
  
      const termedseries = [
          {
              innerRadius: 0,
              outerRadius: 80,
              id: 'series-1',
              data: termedusers,
          },
      ];

    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

    const usersAddedByQuarter = {};

    //NEW ROLE ASSIGNMENT
    newusers_rows.forEach(user => {
        const dateGranted = new Date(user.DATE_GRANTED);
        const month = dateGranted.getMonth(); // Get the month (0-11)
    
        // Determine the quarter
        let quarter;
        if (month >= 0 && month <= 2) {
            quarter = 0; // Q1 (January to March)
        } else if (month >= 3 && month <= 5) {
            quarter = 1; // Q2 (April to June)
        } else if (month >= 6 && month <= 8) {
            quarter = 2; // Q3 (July to September)
        } else {
            quarter = 3; // Q4 (October to December)
        }
    
        if (!usersAddedByQuarter[quarter]) {
            usersAddedByQuarter[quarter] = 0;
        }
        usersAddedByQuarter[quarter]++;
    });
    
    const xAxisData = quarters.map((quarterLabel, index) => ({
        label: quarterLabel,
        value: usersAddedByQuarter[index] || 0
    }));
    
    const seriesData = [{
        data: xAxisData.map(quarter => quarter.value)
    }];

    const usersTermedByQuarter = {};

    //TERMED ROLE LIST
    termedusers_rows.forEach(user => {
        const dateRevoked = new Date(user.DATE_REVOKED);
        const month = dateRevoked.getMonth(); // Get the month (0-11)
    
        // Determine the quarter
        let quarter;
        if (month >= 0 && month <= 2) {
            quarter = 0; // Q1 (January to March)
        } else if (month >= 3 && month <= 5) {
            quarter = 1; // Q2 (April to June)
        } else if (month >= 6 && month <= 8) {
            quarter = 2; // Q3 (July to September)
        } else {
            quarter = 3; // Q4 (October to December)
        }
    
        if (!usersTermedByQuarter[quarter]) {
            usersTermedByQuarter[quarter] = 0;
        }
        usersTermedByQuarter[quarter]++;
    });
    
    const xAxisData_termed = quarters.map((quarterLabel, index) => ({
        label: quarterLabel,
        value: usersTermedByQuarter[index] || 0
    }));
    
    const seriesData_termed = [{
        data: xAxisData_termed.map(quarter => quarter.value)
    }];


    
    const tabs = [
        {
            value: '1',
            label: 'Active Users',
            content: (
                <div>
                    <mui.Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                        {/* First column */}
                        <mui.Grid item xs={2}>
                            <Paper sx={{ height: '200px', padding: '20px' }}>
                                <DonutChart data={allusers} desc="Active Roles" title={totalActiveUsers} />
                            </Paper>
                        </mui.Grid>

                        {/* Second column */}
                        <mui.Grid item xs={2}>
                            <Paper sx={{ height: '200px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <mui.Typography variant="h7" sx={{ textAlign: 'center', color: '#212121' }}>
                                    Unique Users
                                </mui.Typography>
                                <Suspense fallback="Loading...">
                                    <mui.Typography variant="h4" sx={{ marginBottom: '20px', textAlign: 'center', color: '#2FA4EE ' }}>
                                        {totalUniqueActiveUsers}
                                    </mui.Typography>
                                </Suspense>

                                <mui.Typography variant="subtitle2" sx={{ textAlign: 'center', color: '#212121  ' }}>
                                    Last Refresh Date
                                </mui.Typography>
                                <Suspense fallback="Loading...">
                                    <mui.Typography variant="subtitle2" sx={{ textAlign: 'center', color: '#046FB2  ' }}>
                                        {formatDate(lastRefresh.JOB_DATE)}
                                    </mui.Typography>
                                </Suspense>
                            </Paper>
                        </mui.Grid>

                    </mui.Grid>

                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={allusers_rows}
                            columns={allusers_columns}
                            columnsWithActions={allusers_columnsWithActions}
                        />
                    </Suspense>
                </div>
            ),
        },
        {
            value: '2',
            label: 'New Roles Assignments',
            content: (
                <div>

                    <mui.Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                        {/* First column */}
                        <mui.Grid item xs={2}>
                            <Paper sx={{ height: '200px', padding: '20px' }}>
                                <DonutChart data={newusers} desc="Assigned Roles" title={totalNewUsers} />
                            </Paper>
                        </mui.Grid>

                        {/* Second column */}
                        <mui.Grid item xs={10}>
                            <Paper sx={{ height: '200px', width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ width: '100%' }}>
                                    <BarChart
                                        xAxis={[{ scaleType: 'band', data: xAxisData.map(quarter => quarter.label) }]}
                                        series={seriesData}
                                        width={400}  // Set BarChart width to 100% of its parent
                                        height={200}
                                    />
                                </div>
                            </Paper>
                        </mui.Grid>

                    </mui.Grid>

                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={newusers_rows}
                            columns={newusers_columns}
                            columnsWithActions={newusers_columnsWithActions}
                        />
                    </Suspense>
                </div>
            ),
        },
        {
            value: '3',
            label: 'Termed Access',
            content: (
                <div>

                    <mui.Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                        {/* First column */}
                        <mui.Grid item xs={2}>
                            <Paper sx={{ height: '200px', padding: '20px' }}>
                                <DonutChart data={termedusers} desc="Termed Roles" title={totalinactiveUsers} />
                            </Paper>
                        </mui.Grid>

                        {/* Second column */}
                        <mui.Grid item xs={10}>
                            <Paper sx={{ height: '200px', width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ width: '100%' }}>
                                    <BarChart
                                        xAxis={[{ scaleType: 'band', data: xAxisData_termed.map(quarter => quarter.label) }]}
                                        series={seriesData_termed}
                                        width={400}  // Set BarChart width to 100% of its parent
                                        height={200}
                                    />
                                </div>
                            </Paper>
                        </mui.Grid>

                    </mui.Grid>

                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={termedusers_rows}
                            columns={termedusers_columns}
                            columnsWithActions={termedusers_columnsWithActions}
                        />
                    </Suspense>
                </div>
            ),
        },
        {
            value: '4',
            label: 'Administrators',
            content: (
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={adminusers_rows}
                            columns={adminusers_columns}
                            columnsWithActions={adminusers_columnsWithActions}
                        />
                    </Suspense>
                </div>
            ),
        },
        {
            value: '5',
            label: 'Transfers',
            content: (
                <div>
                    <mui.Typography variant="subtitle1">
                    Coming soon...
                    </mui.Typography>
                 
                </div>
            ),
        },
        {
            value: '6',
            label: 'Unmapped',
            content: (
                <div>
                     <mui.Typography variant="subtitle1">
                     Coming soon...
                    </mui.Typography>
                 
                </div>
            ),
        },
    ];

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const customMainContent = (
        <div>

            <ResponsiveContainer>

                <mui.Breadcrumbs aria-label="breadcrumb">
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        My Dashboard
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Applications">
                        {selectedapps.COMPANY_NAME}
                    </mui.Link>
                    <mui.Typography color="text.primary"> {selectedapps.APP_NAME}</mui.Typography>
                    <mui.Typography color="text.primary"> Manage Users</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title={`${selectedapps.APP_NAME}`} icon={<GridViewIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage, view, and download user access reports
                </mui.Typography>

                <Separator />

                <React.Fragment>
                    <mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center' }}>
                        <mui.Tooltip title="Add User">
                            <mui.IconButton
                                onClick={handleOpenSetupModal}
                                size="small"
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <PersonAdd sx={{ width: 25, height: 25 }} />
                            </mui.IconButton>

                        </mui.Tooltip>

                        <mui.Tooltip title="Download Reports">
                            <mui.IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 2, marginRight: '20px' }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <DownloadIcon sx={{ width: 25, height: 25 }} />
                            </mui.IconButton>
                        </mui.Tooltip>
                    </mui.Box>
                    <mui.Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <mui.MenuItem onClick={handleClose}>
                            <mui.ListItemIcon>
                                <FolderSharedIcon fontSize="small" />
                            </mui.ListItemIcon>
                            All Users Report
                        </mui.MenuItem>
                        <mui.MenuItem onClick={handleClose}>
                            <mui.ListItemIcon>
                                <CreateNewFolderIcon fontSize="small" />
                            </mui.ListItemIcon>
                            New Role Assignments
                        </mui.MenuItem>
                        <mui.Divider />
                        <mui.MenuItem onClick={handleClose}>
                            <mui.ListItemIcon>
                                <FolderDeleteIcon fontSize="small" />
                            </mui.ListItemIcon>
                            Termed Users
                        </mui.MenuItem>
                        <mui.MenuItem onClick={handleClose}>
                            <mui.ListItemIcon>
                                <AdminPanelSettingsIcon fontSize="small" />
                            </mui.ListItemIcon>
                            Administrators
                        </mui.MenuItem>
                        <mui.MenuItem onClick={handleClose}>
                            <mui.ListItemIcon>
                                <LinkOffIcon fontSize="small" />
                            </mui.ListItemIcon>
                            Unmapped users
                        </mui.MenuItem>
                    </mui.Menu>
                </React.Fragment>
                <DynamicTabs tabs={tabs} />

                <Modal
                    open={openCreateModal}
                    onClose={handleCloseCreateModal}
                    header="Welcome to Manage User Setup"
                    body={
                        <>
                            <mui.Typography variant="subtitle2">Our system detected that no user has been setup for this application yet. Don't worry! We can help you get started. Click 'Start' button below to begin setting up user record for {selectedapps.APP_NAME}.</mui.Typography>
                        </>
                    }
                    footer={
                        <>
                            <mui.Button sx={{ marginBottom: '20px' }} onClick={handleCloseCreateModal} color="primary">
                                Cancel
                            </mui.Button>
                            <mui.Button sx={{ marginRight: '20px', marginBottom: '20px' }} onClick={handleOpenSetupModal} color="primary" variant="contained">
                                Start
                            </mui.Button>
                        </>
                    }
                />

                <Modal
                    open={openSetupModal}
                    onClose={handleCloseSetupModal}
                    header="Welcome to Manage User Setup"
                    size="lg"

                    body={
                        <>
                            <mui.Box>
                                <mui.Typography variant="subtitle2" sx={{ marginBottom: '20px' }}>Select the upload file to map required fields against the upload file headers </mui.Typography>
                                <FileUploadUser />
                            </mui.Box>
                            <mui.Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <mui.Button onClick={handleCloseSetupModal} variant="contained" color="primary">
                                    Cancel
                                </mui.Button>
                            </mui.Box>

                        </>
                    }

                />


            </ResponsiveContainer>

        </div>
    )

    return (
        <div>
            <SysOwnerSideBar mainContent={customMainContent} />
        </div>

    );

}

export default MyApplicationManageUsers;