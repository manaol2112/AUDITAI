import React, { useState, useEffect, useRef, Suspense } from 'react';
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

const DataTable = React.lazy(() => import('../../common/DataGrid'));


const UserAccessReviewData = () => {

    const { id } = useParams();
    const { phase } = useParams();
    const [apps, setApps] = useState([]);
    const [uarData, setUARData] = useState([]);
    const [appRecord, setAppRecord] = useState([]);

    const [uniqueRoles, setUniqueRoles] = useState(0);
    const [uniqueUsers, setUniqueUsers] = useState(0);

    const [uarStatus, setUARStatus] = useState([]); 
    const [rolesForReview, setRolesForReview] = useState([]); 
    const [roleOwnerList, setRoleOwnerList] = useState([]); 
    

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

                    console.log('This is the active users', activeUsers)

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

    const handleClick = (event, app) => {
       
    };

    const isNotStarted = uarData?.STATUS === 'Not Started';

    const rows = rolesForReview.map((role, index) => {

        const roleOwner = roleOwnerList.find(owner => owner.value === role.ROLE_OWNERS);

        console.log('Role Owner Email', roleOwner?.email)

        const userCount = appRecord.filter(appRecordItem => appRecordItem.ROLE_NAME === role.ROLE_NAME).length;

        const SODFlag = appRecord.some(appRecordItem => appRecordItem.EMAIL_ADDRESS === roleOwner?.email && appRecordItem.ROLE_NAME === role.ROLE_NAME);

        let flag;
        if (SODFlag === true) {
             flag = 'X'
        } else {
            flag = '✔'; // Circle checkmark if flag is empty or false
        }

        return {
            id: index + 1,
            ROLE_NAME: role.ROLE_NAME || '-', // Fallback to '-' if ROLE_NAME is empty
            ROLE_OWNERS: roleOwner ? roleOwner.label : null, // Return owner id if found, otherwise null
            USER_COUNT: userCount? userCount: '-',
            SOD_FLAG: flag,
            roleID: role.id,
        };
    });
    
    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'ROLE_NAME', headerName: 'Role Name', flex: 1 },
        { field: 'ROLE_OWNERS', headerName: 'Role Owner', flex: 1 },
        { field: 'USER_COUNT', headerName: 'User Count', flex: 1 },
        { field: 'SOD_FLAG', headerName: 'SOD Flag', flex: 1 },
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

                        <RateReviewIcon sx={{ fontSize: '18px', color: 'grey'}} />
                    
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
            headerName: 'Details',
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
                    <mui.Link underline="hover" color="inherit" href="/useraccessreview">
                        User Access Review
                    </mui.Link>

                    <mui.Typography color="text.primary"> {apps?.APP_NAME}</mui.Typography>

                    <mui.Typography color="text.primary"> {`Review Cycle ${uarData?.REVIEW_TAG}`}</mui.Typography>

                </mui.Breadcrumbs>

                <SearchAppBar title={apps ? `User Access Review: ${apps.APP_NAME}` : 'User Access Review'} icon={<RateReviewIcon />} />


                <Separator />

                {uarStatus === 'Not Started' ? (
                    <div>
                        <Typography sx={{marginBottom: '20px'}} variant="subtitle1" color="textSecondary">This review cycle has not started yet. Review and confirm the accuracy of the roles assignment below to start the access review process.</Typography>

                        <Suspense fallback={<div>Loading...</div>}>
                            <DataTable
                                rows={rows}
                                columns={columns}
                                columnsWithActions={columnsWithActions}
                            />
                        </Suspense>
                    </div>
                ) :  (
                    <div>
                        {/* Other content for other statuses */}
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Typography>User Access Summary:</Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                <mui.Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                                    <mui.Grid item xs={2}>
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardActionArea>
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        {uniqueUsers}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        Active Users
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>

                                        </Card>
                                    </mui.Grid>

                                    <mui.Grid item xs={2}>
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardActionArea>
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        {uniqueRoles}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        Assigned Roles
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>

                                        </Card>
                                    </mui.Grid>

                                    <mui.Grid item xs={2}>
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardActionArea>
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                       {uarStatus}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        25 Days to Deadline
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>

                                        </Card>
                                    </mui.Grid>

                                    <mui.Grid item xs={2}>
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardActionArea>
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        2/5
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                        Reviewed User
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </mui.Grid>

                                </mui.Grid>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                            >
                                <Typography>User Access Details:</Typography>

                            </AccordionSummary>
                            <AccordionDetails>

                            </AccordionDetails>
                        </Accordion>
                    </div>
                )}



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