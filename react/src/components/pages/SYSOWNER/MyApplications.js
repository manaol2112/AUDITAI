import React, { useState, useEffect, Suspense } from 'react';
import SysOwnerSideBar from './SysOwnerSidebar';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import GridViewIcon from '@mui/icons-material/GridView';
import Paper from '@mui/material/Paper';
import { styled, alpha } from '@mui/material/styles';
import appService from '../../../services/ApplicationService';
import userService from '../../../services/UserService';
import companyService from '../../../services/CompanyService';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import StorageIcon from '@mui/icons-material/Storage';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GppGoodIcon from '@mui/icons-material/GppGood';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import LaunchIcon from '@mui/icons-material/Launch';
import GroupIcon from '@mui/icons-material/Group';
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded';
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded';
import LanIcon from '@mui/icons-material/Lan';

const DataTable = React.lazy(() => import('../../common/DataGrid'));

const SysOwnerApplications = () => {
    const [value, setValue] = React.useState(0);
    const [selectedNames, setSelectedNames] = useState([]);
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const [appRecord, setAppRecord] = useState([]);
    const [apps, setApps] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch apps and users in parallel
                const [appsResponse, usersResponse, currentUserresponse, companyResponse, appPWResponse] = await Promise.all([
                    appService.fetchApps().catch(() => null),
                    userService.fetchUsers().catch(() => null),
                    userService.fetchCurrentUser().catch(() => null),
                    companyService.fetchCompanies().catch(() => null),
                ]);

                if (appsResponse) {
                    setAppRecord(appsResponse)
                } else {
                    setAppRecord([])
                }

                if (usersResponse) {
                    setUsers(usersResponse);
                } else {
                    setUsers([])
                }

                if (currentUserresponse) {
                    setCurrentUser(currentUserresponse)

                    const assignedApps = await appService.fetchAppsByOwner(currentUserresponse.id)
                    setApps(assignedApps)
                    
                } else {
                    setCurrentUser([])
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();

    }, []);

    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'APP_NAME', headerName: 'Application Name', flex: 1 },
        { field: 'COMPANY_NAME', headerName: 'Company', flex: 1 },
        {
            field: 'APP_DESCRIPTION',
            headerName: 'Description',
            sortable: false,
            flex: 1
        },
    ];

    const rows = apps.map((app, index) => ({
        id: index + 1,
        APP_NAME: app.APP_NAME || '-',
        COMPANY_NAME: app.COMPANY_NAME || '-',
        APP_DESCRIPTION: app.APP_DESCRIPTION || '-',
        appID: app.id,
        geninfo: app.SETUP_GENINFO, 
        userdata: app.SETUP_USERDATA, 
        process: app.SETUP_PROCESS 
    }));

    const [anchorEl, setAnchorEl] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);

    const handleClick = (event, app) => {
        setAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
        setSelectedApp(app); // Set the selected app directly
    };

    const handleClose = () => {
        setAnchorEl(null);
        setIsMenuOpen(false);
        setSelectedApp(null); 
    };

    const StyledMenu = styled((props) => (
        <Menu
            elevation={0}
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleClose}
            {...props}
        />
    ))(({ theme }) => ({
        '& .MuiPaper-root': {
            borderRadius: 6,
            marginTop: theme.spacing(1),
            minWidth: 180,
            color:
                theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
            boxShadow:
                'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
                padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
                '& .MuiSvgIcon-root': {
                    fontSize: 18,
                    color: theme.palette.text.secondary,
                    marginRight: theme.spacing(1.5),
                },
                '&:active': {
                    backgroundColor: alpha(
                        theme.palette.primary.main,
                        theme.palette.action.selectedOpacity,
                    ),
                },
            },
        },
    }));

    const theme = createTheme({
        palette: {
            primary: {
                main: '#ff9800', // Orange color
            },
            secondary: {
                main: '#4caf50', // Green color
            },
        },
    });

    const renderAuditPrepButton = (params) => {
        const app = params.row;
        const readyforaudit = app.geninfo && app.userdata && app.process;

        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="View Actions" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleClick(event, app)}
                    >
                        {readyforaudit ? (
                            <span style={{ fontSize: '14px', color: 'grey' }}>
                            Ready
                           <CheckCircleIcon sx={{ marginLeft: '10px', fontSize: '18px', color: theme.palette.secondary.main }} />
                            </span>
                           
                        ) : (
                            <span style={{ fontSize: '14px', color: 'grey' }}>
                                Complete Setup
                            <LaunchIcon sx={{ marginLeft: '10px', fontSize: '18px', color: theme.palette.primary.main }} />
                            </span>
                        )}
                    </mui.IconButton>
                </Tooltip>
            </ThemeProvider>
        );
    };

    // Add edit and action buttons to columns
    const columnsWithActions = [
        ...columns,
        {
            field: 'status',
            headerName: 'Audit Readiness',
            width: 200,
            sortable: false,
            renderCell: renderAuditPrepButton,
        },
    ];

    const customMainContent = (
        <div>
            <ResponsiveContainer>
                <mui.Breadcrumbs aria-label="breadcrumb">
                    <mui.Link underline="hover" color="inherit" href="/dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/dashboard">
                        My Dashboard
                    </mui.Link>
                    <mui.Typography color="text.primary"> My Applications</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage Applications" icon={<GridViewIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    View and manage the relevant data of the applications assigned to you
                </mui.Typography>

                <Separator />

                <mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center' }}>
                        <mui.Tooltip title="View Users">
                            <mui.IconButton>
                                <GroupIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                        <mui.Tooltip title="Understanding IT Environment">
                            <mui.IconButton>
                                <MemoryRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                        <mui.Tooltip title="Download Process Narrative">
                            <mui.IconButton>
                                <SystemUpdateAltRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                    </mui.Box>


                <Suspense fallback={<div>Loading...</div>}>
                    <DataTable
                        rows={rows}
                        columns={columns}
                        columnsWithActions={columnsWithActions}
                    />
                </Suspense>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SysOwnerSideBar mainContent={customMainContent} />

            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
            >
                {selectedApp && (
                    <>
                        <MenuItem onClick={() => navigate(`/applications/setupinfo/${selectedApp.appID}`)} disableRipple>
                            <StorageIcon />
                            Setup General Information
                            {selectedApp.geninfo ? (
                                <CheckCircleIcon  style={{ marginLeft: '10px', color: 'green' }} />
                            ) : (
                                <WarningIcon style={{ marginLeft: '10px', color: 'orange' }} />
                            )}
                        </MenuItem>

                        <Divider sx={{ my: 0.5 }} />
                        <MenuItem onClick={() => navigate(`/applications/manageusers/${selectedApp.appID}`)} disableRipple>
                            <ManageAccountsIcon />
                            Manage User Data
                            {selectedApp.userdata ? (
                                <CheckCircleIcon style={{ marginLeft: '10px',color: 'green' }} />
                            ) : (
                                <WarningIcon style={{ marginLeft: '10px', color: 'orange' }} />
                            )}
                        </MenuItem>
                        <Divider sx={{ my: 0.5 }} />
                        <MenuItem onClick={() => navigate(`/applications/controls/${selectedApp.appID}`)} disableRipple>
                            <GppGoodIcon />
                            Process Understanding
                            {selectedApp.process ? (
                                <CheckCircleIcon style={{ marginLeft: '10px', color: 'green' }} />
                            ) : (
                                <WarningIcon style={{ marginLeft: '10px',color: 'orange'}} />
                            )}
                        </MenuItem>
                        <Divider sx={{ my: 0.5 }} />
                        <MenuItem onClick={() => navigate(`/applications/rolematrix/${selectedApp.appID}`)} disableRipple>
                            <LanIcon />
                            Role Matrix
                            {selectedApp.process ? (
                                <CheckCircleIcon style={{ marginLeft: '10px', color: 'green' }} />
                            ) : (
                                <WarningIcon style={{ marginLeft: '10px',color: 'orange'}} />
                            )}
                        </MenuItem>
                        <Divider sx={{ my: 0.5 }} />
                        <MenuItem onClick={handleClose} disableRipple>
                            <MoreHorizIcon />
                            More
                        </MenuItem>
                    </>
                )}
            </StyledMenu>
        </div>
    );
};

export default SysOwnerApplications;
