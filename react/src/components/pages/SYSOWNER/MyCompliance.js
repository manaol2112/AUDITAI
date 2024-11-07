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
import DynamicTabs from '../../common/DynamicTabs';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import policyService from '../../../services/PoliciesService';
import appPasswordService from '../../../services/PasswordService';
import DonutChart from '../../common/DonutChart';
import Modal from '../../common/Modal';
import NormalTextField from '../../common/NormalTextField';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const DataTable = React.lazy(() => import('../../common/DataGrid'));

const SysOwnerCompliance = () => {

    const [apps, setApps] = useState([]);
    const [withExceptions, setWithExceptions] = useState([]);
    const [authCount, setAuthCount] = useState([]); 
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [passwordRows, setPasswordRows] = useState([]); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = await userService.fetchCurrentUser()
                if (currentUser) {
                    const assignedApps = await appService.fetchAppsByOwner(currentUser.id)
                    if (assignedApps) {
                        setApps(assignedApps);
                
                        // Collect promises to fetch password policies for each app's company
                        const passwordPolicyPromises = assignedApps.map(async (app) => {
                            if (app.id) {
                                try {
                                    return { id: app.id, policy: await appPasswordService.fetchAppPasswordByApp(app.id) };
                                } catch (err) {
                                    console.error('Error fetching policy for company ID', app.COMPANY_NAME, ':', err);
                                    return { id: app.id, policy: null };
                                }
                            } else {
                                return { id: app.id, policy: null };
                            }
                        });
                
                       
                        const passwordPolicies = await Promise.all(passwordPolicyPromises);
                        
                      // Combine all data into a single map
                        const combinedDataMap = passwordPolicies.reduce((acc, { id, policy }) => {
                            acc[id] = {
                                passwordPolicy: policy ? policy.pw_policy : null,
                                passwordConfigured: policy ? policy.data : null,
                                complianceStatus: policy ? policy.compliance_status : null,
                            };
                            return acc;
                        }, {});

                        // Enhance assignedApps with combined data
                        const appsWithCombinedData = assignedApps.map((app) => ({
                            ...app,
                            passwordPolicy: combinedDataMap[app.id]?.passwordPolicy || null,
                            passwordConfigured: combinedDataMap[app.id]?.passwordConfigured || null,
                            complianceStatus: combinedDataMap[app.id]?.complianceStatus || null
                        }));

                        // Set the combined data in state
                        setApps(appsWithCombinedData);

                        const statusValues = appsWithCombinedData.map(app => app.complianceStatus?.status).map(status => status === undefined ? 'undefined' : status);

                        const statusCounts = statusValues.reduce((counts, status) => {
                            counts[status] = (counts[status] || 0) + 1;
                            return counts;
                        }, {});

                        
                        const formattedStatusCounts = Object.keys(statusCounts).map(status => ({
                            label: status === 'undefined' ? 'Incomplete Setup' : status,
                            value: statusCounts[status]
                        }));

                        setWithExceptions(formattedStatusCounts)

                        const statusesToCount = ['Needs Review', 'Incomplete Setup'];
                        const authcount = formattedStatusCounts
                            .filter(item => statusesToCount.includes(item.label))
                            .reduce((total, item) => total + item.value, 0);

                        setAuthCount(authcount)

                    } else {
                        setApps([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);


    const allException = apps.map(status => ({
        label: status.complianceStatus,
        value:  0
    }));

    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'APP_NAME', headerName: 'Application Name', flex: 1 },
        { field: 'COMPANY_NAME', headerName: 'Company', flex: 1 },
        { field: 'AUTHENTICATION_TYPE', headerName: 'Authentication Type', sortable: false, flex: 1},
        { field: 'complianceStatus', headerName: 'Compliance Status', sortable: false, flex: 1},
        { field: 'nonCompliantCount', headerName: 'Count', sortable: false, width: 1 },
        { field: 'nonCompliantFields', headerName: 'Field Names', sortable: false, flex: 1},
        
    ];

    const rows = apps.map((app, index) => {
        const nonCompliantFields = app.complianceStatus?.non_compliant_fields;
        const nonCompliantCount = Array.isArray(nonCompliantFields) ? nonCompliantFields.length :0;
        
        return {
            id: index + 1,
            APP_NAME: app.APP_NAME || '-',
            COMPANY_NAME: app.COMPANY_NAME || '-',
            AUTHENTICATION_TYPE: app.AUTHENTICATION_TYPE || '-',
            appID: app.id,
            geninfo: app.SETUP_GENINFO, 
            userdata: app.SETUP_USERDATA, 
            process: app.SETUP_PROCESS,
            complianceStatus: (app.complianceStatus && 'status' in app.complianceStatus && app.complianceStatus.status) ? app.complianceStatus.status : 'Needs Review',
            nonCompliantFields: Array.isArray(nonCompliantFields) ? nonCompliantFields.join(', ') : 'INCOMPLETE SETUP',
            nonCompliantCount: nonCompliantCount,
            passwordPolicy:app.passwordPolicy ? app.passwordPolicy: '',
            passwordConfigured:app.passwordConfigured ? app.passwordConfigured: ''

        };
    });

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

    const [anchorEl, setAnchorEl] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState([]);

    const mapPasswordPolicyToRows = (configure, policy ) => [
        createData('Password Length',policy.LENGTH,configure.LENGTH, configure.LENGTH >= policy.LENGTH ? <CheckCircleIcon style={{color: 'green'}}/>: <WarningAmberIcon style={{color: 'orange'}}/>),
        createData('Password Age', policy.AGE, configure.AGE, configure.AGE <= policy.AGE ? <CheckCircleIcon style={{color: 'green'}}/>: <WarningAmberIcon style={{color: 'orange'}}/>),
        createData('Password History', policy.HISTORY, configure.HISTORY,  configure.HISTORY >= policy.HISTORY ? <CheckCircleIcon style={{color: 'green'}}/>: <WarningAmberIcon style={{color: 'orange'}}/>),
        createData('Account Lockout Attempts', policy.LOCKOUT_ATTEMPT, configure.LOCKOUT_ATTEMPT, configure.LOCKOUT_ATTEMPT <= policy.LOCKOUT_ATTEMPT ? <CheckCircleIcon style={{color: 'green'}}/>: <WarningAmberIcon style={{color: 'orange'}}/>),
        createData('Require Special Character', policy.SPECIAL_CHAR ? 'Yes' : 'No', configure.SPECIAL_CHAR ? 'Yes' : 'No',  configure.SPECIAL_CHAR === policy.SPECIAL_CHAR ? <CheckCircleIcon style={{color: 'green'}}/>: <WarningAmberIcon style={{color: 'orange'}}/>),
        createData('Require Upper Case', policy.UPPER ? 'Yes' : 'No', configure.UPPER ? 'Yes' : 'No', configure.UPPER === policy.UPPER ? <CheckCircleIcon style={{color: 'green'}}/>: <WarningAmberIcon style={{color: 'orange'}}/>),
        createData('Require Lower Case', policy.LOWER ? 'Yes' : 'No', configure.LOWER ? 'Yes' : 'No', configure.LOWER === policy.LOWER ? <CheckCircleIcon style={{color: 'green'}}/>: <WarningAmberIcon style={{color: 'orange'}}/>),
        createData('Require Number', policy.NUMBER ? 'Yes' : 'No', configure.NUMBER ? 'Yes' : 'No', configure.NUMBER === policy.NUMBER ? <CheckCircleIcon style={{color: 'green'}}/>: <WarningAmberIcon style={{color: 'orange'}}/>),
    ];
    

    const handleClick = (event, app) => {
        setAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
        setSelectedApp(app);

        const matchingPolicy = app.passwordPolicy
        const matchingConfiguration = app.passwordConfigured

       // Check if both matchingPolicy and matchingConfiguration exist
    if (matchingPolicy || matchingConfiguration) {
        // Ensure that both are available, otherwise use empty objects
        const policyData = matchingPolicy || {};
        const configData = matchingConfiguration || {};

        // Map both policy and configuration to table rows
        const passwordRows = mapPasswordPolicyToRows(configData, policyData);
        setPasswordRows(passwordRows);
    } else {
        // Handle the case where neither policy nor configuration is found
        setPasswordRows([]); // or show an error message if needed
    }

        setOpenPasswordModal(true) 
    };

    const renderActionButton = (params) => {
        const app = params.row;
    
        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="View Details" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleClick(event, app)}
                    >
                        <LaunchIcon sx={{ fontSize: '18px' }} />
                    </mui.IconButton>
                </Tooltip>
            </ThemeProvider>
        );
    };
    

    // Add edit and action buttons to columns
    const columnsWithActions = [
        ...columns,

        {
            field: 'compliance',
            headerName: 'View Details',
            width: 200,
            sortable: false,
            renderCell: renderActionButton,
        },
    ];
    
    const tabs = [

        {
            value: '1',
            label: (<div>
                Authentication
            </div>),
            content: (
                <div>
                 <mui.Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                        <mui.Grid item xs={2}>
                            <Paper sx={{ height: '200px', padding: '20px' }}>
                                <DonutChart data={withExceptions} desc="Needs Review" title={authCount} />
                            </Paper>
                        </mui.Grid>
                </mui.Grid>
                    
                <Suspense fallback={<div>Loading...</div>}>
                    <DataTable
                        rows={rows}
                        columns={columns}
                        columnsWithActions={columnsWithActions}
                    />
                </Suspense>
                </div>
            ),
        },

        {
            value: '2',
            label: (<div>
                Access Provisioning
            </div>),
            content: (
                <div>

                </div>
            ),
        },
        {
            value: '3',
            label: (<div>
                Access Termination
            </div>),
            content: (
                <div>

                </div>
            ),
        },
        {
            value: '4',
            label: (<div>
                User Access Review
            </div>),
            content: (
                <div>

                </div>
            ),
        },
        {
            value: '5',
            label: (<div>
                Privileged Access
            </div>),
            content: (
                <div>

                </div>
            ),
        },
    ]

    const handleClosePasswordModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenPasswordModal(true)
        }
        else {
            setOpenPasswordModal(false);
        }
    };

    function createData(name, policy, configured, result) {
        return { name, policy, configured, result };
      }

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
                    <mui.Typography color="text.primary">Compliance</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Audit Compliance Status" icon={<GridViewIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    View and manage compliance to IT controls
                </mui.Typography>

                <Separator />

                <mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center' }}>
                        <mui.Tooltip title="Manage Monitoring">
                            <mui.IconButton>
                                <SettingsRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                        <mui.Tooltip title="Download Compliance Report">
                            <mui.IconButton>
                                <DownloadRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                    </mui.Box>

                <DynamicTabs tabs={tabs} />


                <Modal
                    open={openPasswordModal}
                    size = "md"
                    onClose={handleClosePasswordModal}
                    header={`${selectedApp.APP_NAME} Password Details`}  
                    body={
                        <>
                            <mui.Typography variant="subtitle2">
                                Below is the detailed comparison of the password configured in {selectedApp.APP_NAME} against the requirement of the password policy.
                            </mui.Typography>

                            <mui.Box sx={{marginTop: '20px'}}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Password Parameters</TableCell>
                                            <TableCell align="center">Password Policy Requirement</TableCell>
                                            <TableCell align="center">Password Configured</TableCell>
                                            <TableCell align="center">Result</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {passwordRows.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="center">{row.policy}</TableCell>
                                                <TableCell align="center">{row.configured}</TableCell>
                                                <TableCell align="center">{row.result}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </mui.Box>
                        </>
                    }
                    footer={
                        <>
                            <mui.Button sx={{ marginBottom: '20px'}} onClick={handleClosePasswordModal} color="primary">
                                Close
                            </mui.Button>
                        </>
                    }
                />

                
              
            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SysOwnerSideBar mainContent={customMainContent} />
        </div>
    );


}

export default SysOwnerCompliance;