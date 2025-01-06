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
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import GridViewIcon from '@mui/icons-material/GridView';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import BadgeIcon from '@mui/icons-material/Badge';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import RateReviewIcon from '@mui/icons-material/RateReview';
import InventoryIcon from '@mui/icons-material/Inventory';
import SummarizeIcon from '@mui/icons-material/Summarize';
import SectionHeading from '../../common/SectionHeading';


const SysOwnerDashboardv2 = () => {

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

    const iconMapping = {
        grid_view: <GridViewIcon fontSize="large" />,
        assured_workload: <AssuredWorkloadIcon fontSize="large" />,
        account_tree: <AccountTreeIcon fontSize="large" />,
        badge: <BadgeIcon fontSize="large" />,
        mark_email_unread: <MarkEmailUnreadIcon fontSize="large" />,
        rate_review: <RateReviewIcon fontSize="large" />,
        inventory: <InventoryIcon fontSize="large" />,
        summarize: <SummarizeIcon fontSize="large" />
      };
      

    const customMainContent = (
        <div>
            <ResponsiveContainer>
                <mui.Breadcrumbs aria-label="breadcrumb">
                    <mui.Link underline="hover" color="inherit" href="/dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>

                    <mui.Typography color="text.primary"> My Dashboard</mui.Typography>
                </mui.Breadcrumbs>

                <Suspense fallback="Loading...">
                    {currentUser && (
                        <SectionHeading
                            title={`Welcome ${currentUser.first_name} ${currentUser.last_name}`}
                            sx={{ fontSize: '20px' }}
                        />
                    )}
                </Suspense>

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage Access Requests and Approvals, PBC Requests, and Compliance Status
                </mui.Typography>
                <Separator />

                

                <mui.Grid container spacing={3} direction="row" justifyContent="flex-start" alignItems="center">
                    <mui.Grid item>
                        <OutlinedCard icon={iconMapping['grid_view']} title="My Applications" to="/applications" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon={iconMapping['assured_workload']} title="Compliance Status" to="/compliance" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon={iconMapping['account_tree']} title="Process Narrative" to="/processnarrative" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon={iconMapping['badge']} title="New Access Requests" to="/accessrequest/dashboard" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon={iconMapping['mark_email_unread']} title="Process Requests" to="/accessrequest/granting" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon={iconMapping['rate_review']} title="User Access Review" to="/useraccessreview" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon={iconMapping['inventory']} title="Audit Requests" to="/security" buttonlabel="View" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon={iconMapping['summarize']} title="Reports" to="/Interfaces" buttonlabel="View" />
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

export default SysOwnerDashboardv2;
