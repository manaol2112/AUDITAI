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

                    setAppRecord(activeUsers);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };


        fetchApp();
        fetchUARData();
        fetchAppRecord();

    }, []);

    const isNotStarted = uarData?.STATUS === 'Not Started';

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
                        {/* Content when uarData.STATUS is 'Not Started' */}
                        <Typography variant="h6" color="textSecondary">The review cycle has not started yet.</Typography>
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