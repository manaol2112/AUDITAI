import React, { useState, useEffect, Suspense } from 'react';
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

const SysOwnerDashboard = () => {

    const [users, setUsers] = useState([]);
    const [apps, setApps] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {

                const [appsResponse, usersResponse, currentUserresponse, companyResponse] = await Promise.all([
                    appService.fetchApps(),
                    userService.fetchUsers(),
                    userService.fetchCurrentUser(),
                    companyService.fetchCompanies()

                ]);

                setApps(appsResponse);
                setUsers(usersResponse);
                setCurrentUser(currentUserresponse)
                setCompanies(companyResponse)

            } catch (error) {
                console.error(`Error fetching data: ${error.message}`);
                setError(error); // Set API error to state
            }
        };

        fetchData();

        // Empty dependency array ensures this effect runs only once on mount
    }, []);

    const customMainContent = (
        <div>
            <ResponsiveContainer>
                <mui.Breadcrumbs aria-label="breadcrumb">
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>

                    <mui.Typography color="text.primary"> My Dashboard</mui.Typography>
                </mui.Breadcrumbs>

                <Suspense fallback="Loading...">
                    {currentUser && (
                        <SearchAppBar
                            title={`Welcome ${currentUser.first_name} ${currentUser.last_name}`}
                            sx={{ fontSize: '20px' }}
                            icon={<AutoAwesomeRoundedIcon/>}
                        />
                    )}
                </Suspense>

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage Access Requests and Approvals, PBC Requests, and Compliance Status
                </mui.Typography>
                <Separator />

                <mui.Grid
                    container spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <mui.Grid item>
                        <OutlinedCard icon="grid_view" title="My Applications" to="/Applications" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="assured_workload" title="Compliance Status" to="/Compliance" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="account_tree" title="Process Narrative" to="/ProcessNarrative" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="mark_email_unread" title="Access Requests" to="/SystemRoles" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="rate_review" title="User Access Review" to="/SystemRoles" buttonlabel="View" />
                    </mui.Grid>
                 
                    <mui.Grid item>
                        <OutlinedCard icon="inventory" title="Audit Requests" to="/Security" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="summarize" title="Reports" to="/Interfaces" buttonlabel="View" />
                    </mui.Grid>

                </mui.Grid>

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

export default SysOwnerDashboard;
