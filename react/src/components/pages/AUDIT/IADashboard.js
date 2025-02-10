import React, { useState, useEffect, Suspense } from 'react';
import IASideBar from './IASideBar';
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
import CallSplitIcon from '@mui/icons-material/CallSplit';

const IAAuditDashboard = () => {

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
                    <mui.Link underline="hover" color="inherit" href="/dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>

                    <mui.Typography color="text.primary"> My Dashboard</mui.Typography>
                    <mui.Typography color="text.primary"> Internal Audit</mui.Typography>
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
                    Document Workpapers, Manage Risk and Controls, View Process Narrative, Submit Document Request, and View Deficiencies
                </mui.Typography>
                <Separator />

                <mui.Grid
                    container spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <mui.Grid item>
                        <OutlinedCard icon="reviews" title="Projects" to="/Audit/Projects" buttonlabel="Manage" />
                    </mui.Grid>
               
                    <mui.Grid item>
                        <OutlinedCard icon="verified_user" title="Controls Library" to="/Audit/ControlsLibrary" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="bug_report" title="Risks Library" to="/Audit/RiskLibrary" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="stairs" title="Procedures Library" to="/Audit/ProcedureLibrary" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="collections_bookmark" title="Policy Library" to="/SystemRoles" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="call_split" title="SOD Library" to="/SystemRoles" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="rebase_edit" title="Process Narrative" to="/SystemRoles" buttonlabel="View" />
                    </mui.Grid>
                 
                </mui.Grid>

            </ResponsiveContainer>
        </div>
    )

    return (
        <ErrorBoundary fallback={<p>Failed to load data.</p>} error={error}>
            <Suspense fallback="Loading...">
                <div>
                    <IASideBar mainContent={customMainContent} />
                </div>
            </Suspense>
        </ErrorBoundary>
    );
}
export default IAAuditDashboard;