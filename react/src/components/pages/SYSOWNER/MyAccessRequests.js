import React, { useState, useEffect, useRef, Suspense, act } from 'react';
import SysOwnerSideBar from './SysOwnerSidebar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import userService from '../../../services/UserService';
import appService from '../../../services/ApplicationService';
import OutlinedCard from '../../common/MediaCard';
import Separator from '../../layout/Separator';
import companyService from '../../../services/CompanyService';
import ErrorBoundary from '../../common/ErrorBoundery';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DynamicTabs from '../../common/DynamicTabs';
import MultipleSelect from '../../common/MultipleSelect';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import NormalTextField from '../../common/NormalTextField';
import HRService from '../../../services/HrService';
import RequestService from '../../../services/RequestService';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { useParams,useLocation } from 'react-router-dom';
import { Typography, IconButton, Button, Snackbar, Tooltip} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Modal from '../../common/Modal';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { validate as isValidUUID } from 'uuid';


const DataTable = React.lazy(() => import('../../common/DataGrid'));

const MyAccessRequest = () => {

    const [apps, setApps] = useState([]);
    const [error, setError] = useState(null);
    const [selectedticket, setSelectedTicket] = useState([]);
    const { id } = useParams();

    // Extract the query parameters from the URL (such as token)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const [appRecord, setAppRecord] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [users, setUsers] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [hrRecord, setHRRecord] = useState([]);
    const [requestCount, setRequestCount] = useState([]);

    const [openRequestModal, setOpenRequestModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(false);
    const [activeRequest, setActiveRequest] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState(false);


    const handleCloseRequestModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenRequestModal(true)
        }
        else {
            setOpenRequestModal(false);
        }
    };

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch apps and users in parallel
                const [appsResponse, usersResponse, currentUserresponse, companyResponse, appPWResponse, hrRecord] = await Promise.all([
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

                    if (assignedApps && assignedApps.length > 0) {
                        const requestsPromises = assignedApps.map(async (app) => {
                            const ticket = await RequestService.fetchRequestsByApp(app.id);
                            
                            if (ticket && ticket.length > 0) {
                                return ticket; // Return ticket to be accumulated
                            }
                            return []; 
                        });
                    
                        const allTickets = await Promise.all(requestsPromises);
                    
                        const flattenedTickets = allTickets.flat();

                        const filteredTickets = flattenedTickets.filter(ticket => ticket.STATUS !== "Pending Approval");

                        const filteredCount = filteredTickets.length;

                        setRequestCount(filteredCount)

                        setTickets(filteredTickets);
                     
                     
                    }
                    

                } else {
                    setCurrentUser([])
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();


        const fetchHRData = async () => {
            try {
            const hrData = await HRService.fetchHRRecordByEmail()
            if (hrData) {
                setHRRecord(hrData)
    
        }
           } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchHRData();

    }, []);

    useEffect(() => {
    
        const fetchApproval = async () => {
            try {
            const approval = await RequestService.fetchApprovalById(activeRequest)
            if (approval) {
                setSelectedApproval(approval)
                console.log('Approval Data:', approval); 
            }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchApproval();

    }, [activeRequest]);

    function formatDate(dateString) {
        const date = new Date(dateString); // Convert the string to a Date object
        const options = { year: 'numeric', month: 'long', day: '2-digit' }; // Desired format
        return date.toLocaleDateString('en-US', options); // Format the date
    }
    
    const appDetailsMap = appRecord?.reduce((acc, app) => {
        acc[app.id] = {
            APP_NAME: app.APP_NAME,
            COMPANY_NAME: app.COMPANY_NAME, 
        };
        return acc;
    }, {});

    const hrDetailsMap = hrRecord?.reduce((acc, user) => {
        acc[user.id] = `${user.FIRST_NAME} ${user.LAST_NAME}`;  
        return acc;
    }, {});

    const getFormattedRequestors = (requestors) => {
        const requestorIds = requestors.split(',');  
        const formattedNames = requestorIds.map((uuid, index) => {
            const name = hrDetailsMap[uuid.trim()];  
            return name ? `${name}` : `-`;  
        });
        return formattedNames.join(', ');  
    };

    const columns = [
       
        { field: 'SEQ_NO', headerName: '#', width: 50 },
        { field: 'REQUEST_ID', headerName: 'Request ID', flex: 1 },
        { field: 'APP_NAME', headerName: 'Application Name', flex: 1 },
        { field: 'COMPANY_NAME', headerName: 'Company Name', flex: 1 },
        { field: 'REQUESTOR', headerName: 'REQUESTOR', flex: 1 },
        { field: 'ROLES', headerName: 'Roles', flex: 1 }, // Add new column for COMPANY_ID
        { field: 'STATUS', headerName: 'Request Status', flex: 1 },
    
    ];

    const rows = tickets.map((ticket, index) => {

        const appDetails = appDetailsMap[ticket.APP_NAME] || { APP_NAME: '-', COMPANY_NAME: '-' };
        const formattedDateRequested = formatDate(ticket.DATE_REQUESTED);
        const formattedRequestors = getFormattedRequestors(ticket.REQUESTOR);
        const formattedRoles = (ticket.ROLES || '').replace(/,/g, ', ');

        return {
            SEQ_NO: index + 1,
            id: ticket.id,
            REQUEST_ID: ticket.REQUEST_ID || '-',
            APP_NAME: appDetails.APP_NAME, // Use APP_NAME from the map
            COMPANY_NAME: appDetails.COMPANY_NAME, // Use COMPANY_ID from the map
            STATUS: ticket.STATUS || '-',
            COMMENTS: ticket.COMMENTS || '-',
            ROLES: formattedRoles || '-',
            REQUESTOR: formattedRequestors || '-',
            DATE_REQUESTED: formattedDateRequested || '-',
            appID: ticket.appID,
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

    const renderAuditPrepButton = (params) => {
        const request = params.row;

        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="View Request Details" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleClick(event, request)}
                    >
                            <span style={{ fontSize: '14px', color: 'grey' }}>
                            View Details
                           <OpenInNewIcon sx={{ marginLeft: '10px', fontSize: '18px', color: theme.palette.secondary.main }} />
                            </span>
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
            headerName: 'Request Details',
            width: 200,
            sortable: false,
            renderCell: renderAuditPrepButton,
        },
    ];

    const [anchorEl, setAnchorEl] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);

    const handleClick = (event, request) => {
        setOpenRequestModal(true); 
        setSelectedRequest(request)

        setActiveRequest(request.id); 
    };

    const tabs = [
        {
            value: '1',
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>Provisioning</span>
                    {requestCount ? (
                        <Badge badgeContent={requestCount} color="success">
                            <MailIcon color="action" />
                        </Badge>
                    ) : ''}
                </div>
            ),
            content: (
                <div>
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
                Termination Requests
            </div>),
            content: (

                <div>

                </div>
                ),
        },
        {
            value: '3',

            label: (<div>
                Access History
            </div>),
            content: (
                <div>

                </div>
                ),
        }
    ]
    
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

                    <mui.Typography color="text.primary">Process Request</mui.Typography>

                </mui.Breadcrumbs>

                <SearchAppBar title="Access Request Dashboard" icon={<DashboardIcon />} />

                <Separator/>

            <DynamicTabs tabs={tabs} />

            <Modal
                    open={openRequestModal}
                    size = 'md'
                    onClose={handleCloseRequestModal}
                    header="Access Request Details"
                    body={
                        <>
                          
                                <mui.Box sx={{ margin: '20px' }}>

                                    <mui.Typography variant="subtitle2">
                                        Request ID:
                                    </mui.Typography>

                                    <NormalTextField
                                      
                                        value={selectedRequest.REQUEST_ID}
                                        onChange={''}
                                        onBlur={''}
                                    />

                                    <mui.Typography variant="subtitle2">
                                        Entity:
                                    </mui.Typography>

                                    <NormalTextField
                                      
                                        value={selectedRequest.COMPANY_NAME}
                                        onChange={''}
                                        onBlur={''}
                                    />     

                                    <mui.Typography variant="subtitle2">
                                        Application:
                                    </mui.Typography>

                                    <NormalTextField
                                       
                                        value={selectedRequest.APP_NAME}
                                        onChange={''}
                                        onBlur={''}
                                    />     

                                    <mui.Typography variant="subtitle2">
                                        Role Assignee:
                                    </mui.Typography>

                                    <NormalTextField
                                       
                                        value={selectedRequest.REQUESTOR}
                                        onChange={''}
                                        onBlur={''}
                                    />       

                                    <mui.Typography variant="subtitle2">
                                        Roles Requested:
                                    </mui.Typography>

                                    <NormalTextField
                                       
                                        value={selectedRequest.ROLES}
                                        onChange={''}
                                        onBlur={''}
                                    />      

                                    <mui.Typography variant="subtitle2">
                                        Comments:
                                    </mui.Typography>

                                    <NormalTextField
                                        
                                        value={selectedRequest.COMMENTS}
                                        onChange={''}
                                        onBlur={''}
                                        isMultiLine={true}
                                        rows={'5'}
                                    />   

                                    <Separator/>

                                     <mui.Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
                                        Approval Details
                                    </mui.Typography>  

                                    <mui.Typography variant="subtitle2" sx={{ marginTop: '20px'}}>
                                        Approver:
                                    </mui.Typography> 

                                    <NormalTextField
                             
                                        value={''}
                                        onChange={''}
                                        onBlur={''}
                                       
                                    />   

                                    <mui.Typography variant="subtitle2">
                                        Date Approved:
                                    </mui.Typography>

                                    <NormalTextField
                                
                                        value={''}
                                        onChange={''}
                                        onBlur={''}
                                    />      




                                </mui.Box>
                           
                        </>
                    }
                    footer={
                        <>
                            <mui.Button sx={{marginBottom: '20px'}} onClick={handleCloseRequestModal} color="primary">
                                Cancel
                            </mui.Button>
                            <mui.Button sx={{marginRight: '20px', marginBottom: '20px'}} onClick={''} color="primary" variant="contained">
                                Mark as Granted
                            </mui.Button>
                        </>
                    }
                />
            </ResponsiveContainer>
        </div>
    )

    return (
        <ErrorBoundary fallback={<p>Failed to load data.</p>} error={error}>
            <Suspense fallback="Loading...">
                <div>
                    <SysOwnerSideBar mainContent={customMainContent} />
                </div>
            </Suspense>
        </ErrorBoundary>
    );
};

export default MyAccessRequest;
