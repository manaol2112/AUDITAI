import React, { useState, useEffect, useRef, Suspense, } from 'react';
import { useNavigate } from 'react-router-dom';
import SysOwnerSideBar from './SysOwnerSidebar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import ErrorBoundary from '../../common/ErrorBoundery';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useParams } from 'react-router-dom';
import appService from '../../../services/ApplicationService';
import HRService from '../../../services/HrService';
import Select from 'react-select'; // Import react-select
import './styles.css';
import roleService from '../../../services/RoleService';
import DynamicTabs from '../../common/DynamicTabs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import RateReviewIcon from '@mui/icons-material/RateReview';
import uarService from '../../../services/UARService';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Tooltip from '@mui/material/Tooltip';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Modal from '../../common/Modal';
import MultipleSelect from '../../common/MultipleSelect';
import NormalTextField from '../../common/NormalTextField';
import ActionPanel from '../../common/ActionPanel';
import SettingsIcon from '@mui/icons-material/Settings';
import { ContinuousColorLegend } from '@mui/x-charts/ChartsLegend';
import UARStatsDisplay from '../../common/UARStats';

const DataTable = React.lazy(() => import('../../common/DataGrid'));


const UserAccessReviewData = () => {

    const { id } = useParams();
    const { phase } = useParams();
    const [apps, setApps] = useState([]);
    const [uarData, setUARData] = useState([]);
    const [appRecord, setAppRecord] = useState([]);

    const [uniqueRoles, setUniqueRoles] = useState(0);
    const [uniqueUsers, setUniqueUsers] = useState(0);

    const [uarStatus, setUARStatus] = useState('');
    const [uarFile, setUARFile] = useState('');
    const [uarCycle, setUARCycle] = useState('');
    const [uarSODViolation, setUARSODViolation] = useState(true);
    const [uarSoDData, setUARSODDATA] = useState([]);
    const [rolesForReview, setRolesForReview] = useState([]);
    const [openUARSetupModal, setOpenUARSetupModal] = useState(false);
    const [roleOwnerList, setRoleOwnerList] = useState([]);
    const [assignedOwner, setAssignedOwner] = useState({});
    const [selectedOwners, setSelectedOwners] = useState({});
    const [roleOwnerData, setRoleOwnerdata] = useState([]);
    const [roleData, setRoleData] = useState({});
    const [activeUsers, setActiveUsers] = useState([]);
    const [userswithSOD, setUsersWithSOD] = useState([]);
    const [selectedRole, setSelectedRole] = useState({});
    const [hrList, setHRList] = useState([]);
    const [sodViolation, setSODViolation] = useState(false);
    const [roleOwnerEmail, setRoleOwnerEmail] = useState('');
    const [updatedRoleOwner, setUpdatedRoleOwner] = useState('');
    const [updateRoleOwnerData, setUpdateRoleOwnerData] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedUserEmail, setSelectedUserEmail] = useState('');

    const [roleCount, setRoleCount] = useState(0);
    const [pendingReview, setPendingReviewCount] = useState(0);
    const [needsAction, setNeedsAction] = useState(0);
    const [completed, setCompleted] = useState(0);



    const [openMappingModal, setOpenMappingModal] = useState(false);

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(`/useraccessreview/${id}`);
    };

    const handleSendClick = async () => {

        //UPDATE THE PROGRESS OF THE UAR FILE
        const updated_status = {
            STATUS: 'Review In-Progress'
        }

        try {
            const response = await uarService.updateUAR(uarData?.id, updated_status);

            if (response) {
                setUARStatus(response)
            }

        } catch (error) {
            console.error("Error updating UAR status:", error);
        }

        //GATHER THE LIST OF ROLE OWNERS AND THEIR ROLES TO BE REVIEWED

        const uarData = await uarService.sendUARForReview(userswithSOD)

        

    };

    const handleOpenMappingModal = () => {
        setOpenMappingModal(true);
    };

    const handleCloseMappingModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenMappingModal(true)
        }
        else {
            setOpenMappingModal(false);
        }
    };

    const handleCloseCreateModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenUARSetupModal(true)
        }
        else {
            setOpenUARSetupModal(false);
        }
    };

    const handleRoleOwnerSelect = (selectedOptions) => {

        const roleowner = selectedOptions.value;

        setAssignedOwner(roleowner)

        setSelectedOwners(selectedOptions)

        const updatedData = {
            ...roleOwnerData,
            ROLE_OWNERS: roleowner
        };

        setRoleData(updatedData)
    };

    const handleRoleOwnerUpdate = (selectedOptions) => {

        const roleowner = selectedOptions.value;

        const roleOwnerDetails = hrList.find(item => item.id === roleowner);

        console.log('This is the selected role owner', roleOwnerDetails.EMAIL_ADDRESS)

        console.log('This is the user email', selectedUserEmail)

        let sodViolation;

        if (roleOwnerDetails.EMAIL_ADDRESS === selectedUserEmail) {
            sodViolation = true
        } else {
            sodViolation = false
        }

        console.log('This is the SOD check result', sodViolation)

        setUpdatedRoleOwner(selectedOptions)

        const updatedData = {
            ...updateRoleOwnerData,
            id: selectedUser,
            ROLE_OWNER: roleowner,
            WITH_SOD_VIOLATION: sodViolation,
        };

        setUpdateRoleOwnerData(updatedData)
    };

    useEffect(() => {

        const fetchApp = async () => {
            try {
                const app = await appService.fetchAppsById(id)
                if (app) {
                    setApps(app)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        const fetchUARData = async () => {
            try {

                const uar = await uarService.fetchUARById(phase);

                if (uar) {
                    setUARStatus(uar.STATUS)
                    setUARData(uar)

                    try {
                        const users_with_sod = await uarService.getUARSODProcessByAppCycle(id, uar.REVIEW_TAG);

                        if (users_with_sod) {
                            setUsersWithSOD(users_with_sod)
                        }
                    } catch (error) {
                        console.error('Error fetching uar sod:', error);
                    }

                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchAppRecord = async () => {
            try {
                const appRecord = await appService.fetchAppsRecordById(id)

                if (appRecord) {
                    const activeUsers = appRecord.filter(record => record.STATUS !== "Inactive");

                    // Create Sets to track unique ROLE_NAMES and EMAIL_ADDRESS
                    const uniqueRoleNames = new Set();
                    const uniqueEmails = new Set();

                    // Loop through activeUsers to populate the Sets
                    activeUsers.forEach(record => {
                        uniqueRoleNames.add(record.ROLE_NAME);
                        uniqueEmails.add(record.EMAIL_ADDRESS);
                    });

                    // Get the count of unique ROLE_NAMES and EMAIL_ADDRESS
                    const uniqueRoleNamesCount = uniqueRoleNames.size;
                    const uniqueEmailsCount = uniqueEmails.size;

                    setUniqueRoles(uniqueRoleNamesCount)
                    setUniqueUsers(uniqueEmailsCount)
                    setAppRecord(activeUsers);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };


        const fetchRolesRecord = async () => {
            try {

                const existingRoleOwners = await roleService.fetchRoleOwnersByApp(id);

                if (existingRoleOwners) {
                    setRolesForReview(existingRoleOwners)
                }

                const roles = await appService.fetchAppsRecordById(id);

                const existingRoleNames = new Set(existingRoleOwners.map(owner => owner.ROLE_NAME));

                const filteredRoles = roles.filter(role => !existingRoleNames.has(role.ROLE_NAME));


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchRoleOwner = async () => {
            try {
                const hrList = await HRService.fetchHRRecordByEmail();
                if (hrList) {
                    // Use a Set to store unique emails
                    const uniqueEmailList = Array.from(
                        new Map(
                            hrList.map(item => [item.EMAIL_ADDRESS, item])
                        ).values()
                    );

                    setHRList(uniqueEmailList)

                    const email = uniqueEmailList.map(item => ({
                        value: item.id,
                        email: item.EMAIL_ADDRESS,
                        label: `${item.FIRST_NAME} ${item.LAST_NAME}  (${item.EMAIL_ADDRESS})`
                    }));

                    setRoleOwnerList(email);

                }
            } catch (error) {
                console.error('Error fetching role owner:', error);
            }
        };

        fetchApp();
        fetchUARData();
        fetchAppRecord();
        fetchRolesRecord();
        fetchRoleOwner();

    }, []);

    const handleClick = (event, phase) => {

        setOpenUARSetupModal(true)

        setSelectedRole(phase.ROLE_NAME)

        setRoleOwnerEmail(phase.EMAIL_ADDRESS)

        const owner = ({
            label: phase.ROLE_OWNERS,
            value: phase.EMAIL_ADDRESS
        })

        setSelectedOwners(owner)

        const activeUsers = appRecord.filter(record => record.ROLE_NAME === phase.ROLE_NAME);

        setActiveUsers(activeUsers)

    };

    const handleUpdateReviewerClick = (event, phase) => {

        const selected_user = userswithSOD.find(user => user.EMAIL_ADDRESS === phase.EMAIL_ADDRESS && user.ROLE_NAME === phase.ROLE_NAME);

        if (selected_user) {
            setSelectedUser(selected_user.id);
            setSelectedUserEmail(selected_user.EMAIL_ADDRESS)

            setOpenMappingModal(true);
        }

    };

    const isNotStarted = uarData?.STATUS === 'Not Started';

    const createSODMapping = async (e) => {
        e.preventDefault();

        try {

            for (const user of appRecord?.filter(user => user.STATUS === 'Active')) {
                const roleOwner = rolesForReview.find(owner => owner.ROLE_NAME === user.ROLE_NAME);

                if (!roleOwner) continue;

                const roleOwnerEmail = roleOwnerList.find(owner => owner.value === roleOwner.ROLE_OWNERS);

                if (!roleOwnerEmail) continue;

                let sod_violation;

                if (user.EMAIL_ADDRESS === roleOwnerEmail.email) {
                    sod_violation = true
                } else {
                    sod_violation = false
                }

                const updated_data = {
                    APP_NAME: id,
                    UAR_FILE: uarData?.id,
                    EMAIL_ADDRESS: user.EMAIL_ADDRESS,
                    REVIEW_CYCLE: uarData?.REVIEW_TAG,
                    ROLE_NAME: roleOwner.ROLE_NAME,
                    ROLE_OWNER: roleOwner.ROLE_OWNERS,
                    WITH_SOD_VIOLATION: sod_violation,
                };

                console.log('Updated data', updated_data)

                try {
                    const response = await uarService.createUARSODRecord(updated_data);
                } catch (error) {
                    console.error("Error creating SOD record:", error);
                }

                const updated_status = {
                    STATUS: 'User List Generated'
                }

                try {
                    const response = await uarService.updateUAR(uarData?.id, updated_status);

                } catch (error) {
                    console.error("Error updating UAR status:", error);
                }

            }

            window.location.reload(); // This reloads the page


        } catch (error) {

            console.error('Error creating checking SOD', error)

        }
    };

    const groupedData = userswithSOD.reduce((acc, user) => {

        const roleName = user.ROLE_NAME || '-';
        const roleOwner = user.ROLE_OWNER;
        const status = user.STATUS;

        // Check if the user has an owner
        const roleOwnerDetails = hrList.find(item => item.id === roleOwner);

        // If the role doesn't exist in the accumulator, initialize it
        if (!acc[roleName]) {
            acc[roleName] = {
                ROLE_NAME: roleName,
                ROLE_OWNERS: roleOwnerDetails ? roleOwnerDetails.FIRST_NAME + ' ' + roleOwnerDetails.LAST_NAME : 'Unknown Owner', // Add name if available
                USER_COUNT: 0,
                EMAIL_ADDRESS: roleOwnerDetails.EMAIL_ADDRESS,
                STATUS: status ? status : 'Pending Review',
                SOD_FLAG: 'No' // Default SOD_FLAG value
            };
        }

        // Increment the USER_COUNT for each role
        acc[roleName].USER_COUNT += 1;

        // Update the SOD_FLAG if the current user has a violation
        if (user.WITH_SOD_VIOLATION === true) {
            acc[roleName].SOD_FLAG = 'Yes';
        }

        return acc;

    }, {});

  
    useEffect(() => {
        // Check if any role in groupedData has SOD_FLAG set to 'Yes'
        const hasSodViolation = Object.values(groupedData).some(role => role.SOD_FLAG === 'Yes');

        // Update the state based on presence of SOD violations
        setUARSODViolation(hasSodViolation);
        
        const roleCount = Object.keys(groupedData).length;

        if (roleCount) {
            setRoleCount(roleCount)
        }

        const pendingReviewCount = Object.values(groupedData).filter(item => item.STATUS === 'Pending Review').length;

        if (pendingReviewCount) {
            setPendingReviewCount(pendingReviewCount)
        }

    

    }, [groupedData]);

       // Convert the grouped data to an array of rows
    const rowsForReview = Object.values(groupedData).map((item, index) => ({
        id: index + 1,
        ROLE_NAME: item.ROLE_NAME,
        ROLE_OWNERS: item.ROLE_OWNERS,
        USER_COUNT: item.USER_COUNT,
        SOD_FLAG: item.SOD_FLAG,
        EMAIL_ADDRESS: item.EMAIL_ADDRESS,
        STATUS: item.STATUS
    }));

    const columnsForReview = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'ROLE_NAME', headerName: 'Role Name', flex: 1 },
        { field: 'USER_COUNT', headerName: 'User Count', flex: 1 },
        { field: 'ROLE_OWNERS', headerName: 'Reviewer', flex: 1 },
        { field: 'EMAIL_ADDRESS', headerName: 'Reviewer Email', flex: 1 },
        { field: 'STATUS', headerName: 'Review Status', flex: 1 },
    ];


    // Convert the grouped data to an array of rows
    const rows = Object.values(groupedData).map((item, index) => ({
        id: index + 1,
        ROLE_NAME: item.ROLE_NAME,
        ROLE_OWNERS: item.ROLE_OWNERS,
        USER_COUNT: item.USER_COUNT,
        SOD_FLAG: item.SOD_FLAG,
        EMAIL_ADDRESS: item.EMAIL_ADDRESS
    }));

    // Define your columns as before
    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'ROLE_NAME', headerName: 'Role Name', flex: 1 },
        { field: 'USER_COUNT', headerName: 'User Count', flex: 1 },
        { field: 'SOD_FLAG', headerName: 'SOD Conflict', flex: 1 },
    ];

    const selectedRows = activeUsers.map((user, index) => {

        const reviewer = userswithSOD?.find(sod => sod.EMAIL_ADDRESS === user.EMAIL_ADDRESS && sod.ROLE_NAME === user.ROLE_NAME);

        const roleOwnerDetails = reviewer ? hrList.find(item => item.id === reviewer.ROLE_OWNER) : null;

        const ownerEmail = roleOwnerDetails ? roleOwnerDetails.EMAIL_ADDRESS : '';

        let SOD_CONFLICT;

        if (ownerEmail === user.EMAIL_ADDRESS) {
            SOD_CONFLICT = 'Yes'
        } else {
            SOD_CONFLICT = 'No'
        }

        const reviewerName = roleOwnerDetails
            ? `${roleOwnerDetails.EMAIL_ADDRESS}`
            : 'Unknown Reviewer';

        return {
            id: index + 1,
            rowID: user.id,
            FIRST_NAME: user.FIRST_NAME,
            LAST_NAME: user.LAST_NAME,
            EMAIL_ADDRESS: user.EMAIL_ADDRESS,
            ROLE_NAME: user.ROLE_NAME || '-',
            SOD: SOD_CONFLICT || '-',
            REVIEWER: reviewerName
        };
    });

    const selectedColumns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'FIRST_NAME', headerName: 'First Name', flex: 1 },
        { field: 'LAST_NAME', headerName: 'Last Name', flex: 1 },
        { field: 'EMAIL_ADDRESS', headerName: 'Email Address', flex: 1 },
        { field: 'ROLE_NAME', headerName: 'Role Name', flex: 1 },
        { field: 'REVIEWER', headerName: 'Reviewer', flex: 1 },
        { field: 'SOD', headerName: 'SOD Conflict', flex: 1 },
    ];

    const renderAuditPrepButtonSelected = (params) => {
        const phase = params.row;

        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="Select Reviewer" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleUpdateReviewerClick(event, phase)}
                    >
                        <SettingsIcon sx={{ fontSize: '18px', color: 'grey' }} />

                    </mui.IconButton>
                </Tooltip>
            </ThemeProvider>
        );
    };


    const columnsWithActionsSelected = [
        ...selectedColumns,
        {
            field: 'status',
            headerName: 'Update Reviewer',
            width: 200,
            sortable: false,
            renderCell: renderAuditPrepButtonSelected,
        },
    ];


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
        const phase = params.row;

        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="View Details" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleClick(event, phase)}
                    >

                        <RateReviewIcon sx={{ fontSize: '18px', color: 'grey' }} />

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
            headerName: 'View Details',
            width: 200,
            sortable: false,
            renderCell: renderAuditPrepButton,
        },
    ];

    const columnsWithActionsForReview = [
        ...columnsForReview,
        {
            headerName: 'Follow-Up',
            width: 200,
            sortable: false,
            renderCell: renderAuditPrepButton,
        },
    ];


    const updateRoleOwner = async () => {
        try {

            const updatedOwner = await uarService.updateUARSODRecord(selectedUser, updateRoleOwnerData)

            if (updatedOwner) {
                window.location.reload();
            }

        } catch (error) {
            console.error('Error updating role owner:', error);
        }
    };

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
                    <mui.Link underline="hover" color="inherit" href="/useraccessreview">
                        User Access Review
                    </mui.Link>

                    <mui.Link underline="hover" color="inherit" href={`/useraccessreview/${id}`}>
                        {apps?.APP_NAME}
                    </mui.Link>

                    <mui.Typography color="text.primary"> {`Review Cycle ${uarData?.REVIEW_TAG}`}</mui.Typography>

                </mui.Breadcrumbs>

                <SearchAppBar title={apps ? `User Access Review: ${apps.APP_NAME}` : 'User Access Review'} icon={<RateReviewIcon />} />


                <Separator />

                {uarStatus === 'Not Started' ? (
                    <div>
                        <ActionPanel
                            title="User Access Review Setup"
                            body={`The User Access Review Cycle ${uarData?.REVIEW_TAG} in ${apps?.APP_NAME} has not yet started. Please click the 'Initiate UAR' button below to initiate the review process.`}
                            buttonLabel="Initiate User Access Review"
                            clickAction={createSODMapping} // Fix typo here if necessary (e.g., 'createSODMapping' instead of 'createSODMappping')
                        />
                    </div>
                ) : uarStatus === 'User List Generated' ? (
                    <div>
                        <mui.Typography variant="h6">
                            Segregation of Duties Check:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2" sx={{ marginTop: '10px', marginBottom: '20px' }}>
                            Review the table below for any potential segregation of duties violations before proceeding. Re-assignment of review owner is required if there is an SOD violation.
                        </mui.Typography>

                        <Suspense fallback={<div>Loading...</div>}>
                            <DataTable
                                rows={rows}
                                columns={columns}
                                columnsWithActions={columnsWithActions}
                            />
                        </Suspense>

                        <mui.Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <mui.Button onClick={handleBackClick} color="primary" variant="contained" sx={{ marginRight: '10px' }}>
                                Back
                            </mui.Button>
                            <mui.Button onClick={handleSendClick} color="primary" variant="contained" disabled={uarSODViolation}>
                                Send for Review
                            </mui.Button>
                        </mui.Box>
                    </div>
                ) : uarStatus === 'Review In-Progress' ? (
                    <div>

                        <mui.Typography variant="subtitle1">
                            {apps.APP_NAME} Review Cycle {uarData?.REVIEW_TAG} Summary
                        </mui.Typography>

                        <mui.Grid container spacing={2} sx={{ marginBottom: '20px', marginTop: '10px' }}>
                            <mui.Grid item xs={2}>
                            
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardActionArea>
                                        <CardContent>

                                            <mui.Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Total Roles
                                            </mui.Typography>
                                            <mui.Typography gutterBottom variant="h4" component="div">
                                                {roleCount}
                                            </mui.Typography>


                                        </CardContent>
                                    </CardActionArea>
                                </Card>

                            </mui.Grid>

                            <mui.Grid item xs={2}>

                                <Card sx={{ maxWidth: 345 }}>
                                    <CardActionArea>
                                        <CardContent>

                                            <mui.Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Pending Review
                                            </mui.Typography>
                                            <mui.Typography gutterBottom variant="h4" component="div">
                                                {pendingReview}
                                            </mui.Typography>

                                        </CardContent>
                                    </CardActionArea>
                                </Card>

                            </mui.Grid>

                            <mui.Grid item xs={2}>

                                <Card sx={{ maxWidth: 345 }}>
                                    <CardActionArea>
                                        <CardContent>

                                            <mui.Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Action Needed
                                            </mui.Typography>
                                            <mui.Typography gutterBottom variant="h4" component="div">
                                                0
                                            </mui.Typography>

                                        </CardContent>
                                    </CardActionArea>
                                </Card>


                            </mui.Grid>

                            <mui.Grid item xs={2}>
                               
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardActionArea>
                                        <CardContent>

                                            <mui.Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Completed
                                            </mui.Typography>
                                            <mui.Typography gutterBottom variant="h4" component="div">
                                                0
                                            </mui.Typography>

                                        </CardContent>
                                    </CardActionArea>
                                </Card>


                            </mui.Grid>

                            <mui.Grid item xs={2}>
                               
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardActionArea>
                                        <CardContent>

                                            <mui.Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Aging
                                            </mui.Typography>
                                            <mui.Typography gutterBottom variant="h4" component="div">
                                                0
                                            </mui.Typography>

                                        </CardContent>
                                    </CardActionArea>
                                </Card>


                            </mui.Grid>

                        </mui.Grid>

                        <mui.Typography variant="subtitle1" sx={{marginBottom: '20px'}}>
                            {apps.APP_NAME} Review Cycle {uarData?.REVIEW_TAG} Detailed
                        </mui.Typography>

                        <Suspense fallback={<div>Loading...</div>}>
                                <DataTable
                                    rows={rowsForReview}
                                    columns={columnsForReview}
                                    columnsWithActions={columnsWithActionsForReview}
                                />
                        </Suspense>


                    </div>
                ) : (
                    <div>

                    </div>
                )}


                <Modal
                    open={openUARSetupModal}
                    onClose={handleCloseCreateModal}
                    header="Role Assignment Setup"
                    size="lg"
                    body={
                        <>


                            <mui.Typography variant="subtitle1" sx={{ marginTop: '20px' }}>
                                Role Name:
                            </mui.Typography>

                            <NormalTextField
                                label=""
                                name="APPROVERS_OTHER"
                                value={selectedRole}

                            />

                            <mui.Typography variant="subtitle2" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                The following users have {selectedRole} role and will be subject to user access review:
                            </mui.Typography>

                            <Suspense fallback={<div>Loading...</div>}>
                                <DataTable
                                    rows={selectedRows}
                                    columns={selectedColumns}
                                    columnsWithActions={columnsWithActionsSelected}
                                />
                            </Suspense>

                        </>
                    }
                    footer={
                        <>
                            <mui.Button onClick={handleCloseCreateModal} variant="contained" color="primary" sx={{ marginBottom: '10px', marginRight: '20px' }}>
                                Close
                            </mui.Button>

                        </>
                    }
                />

                <Modal
                    open={openMappingModal}
                    size={'sm'}
                    onClose={handleCloseMappingModal}
                    body={
                        <div style={{ height: '250px', display: 'flex', flexDirection: 'column' }}>
                            <mui.Typography variant="subtitle2" sx={{ marginBottom: '20px' }}>
                                Role Owner:
                            </mui.Typography>

                            <MultipleSelect
                                isMultiSelect={false}
                                placeholderText="Select Role Owner"
                                selectedOptions={updatedRoleOwner}
                                selectOptions={roleOwnerList}
                                handleChange={handleRoleOwnerUpdate}
                            />
                        </div>
                    }
                    footer={
                        <>
                            <mui.Button onClick={handleCloseMappingModal} color="primary" sx={{ marginBottom: '10px' }}>
                                Cancel
                            </mui.Button>
                            <mui.Button onClick={updateRoleOwner} color="primary" variant="contained" sx={{ marginRight: '20px', marginBottom: '10px' }}>
                                Confirm
                            </mui.Button>
                        </>
                    }
                />

            </ResponsiveContainer>

        </div>

    )

    const [error, setError] = useState(null);

    return (
        <ErrorBoundary fallback={<p>Failed to load data.</p>} error={error}>
            <Suspense fallback="Loading...">
                <div>
                    <SysOwnerSideBar mainContent={customMainContent} />
                </div>
            </Suspense>
        </ErrorBoundary>

    );
}

export default UserAccessReviewData;