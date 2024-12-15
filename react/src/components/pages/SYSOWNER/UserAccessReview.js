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
import Tooltip from '@mui/material/Tooltip';
import LaunchIcon from '@mui/icons-material/Launch';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LinkIcon from '@mui/icons-material/Link';
import AddLinkIcon from '@mui/icons-material/AddLink';
import Modal from '../../common/Modal';
import MultipleSelect from '../../common/MultipleSelect';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import RateReviewIcon from '@mui/icons-material/RateReview';
import userService from '../../../services/UserService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import LaptopWindowsRounded from '@mui/icons-material/LaptopWindowsRounded';
import { useNavigate } from 'react-router-dom';


const DataTable = React.lazy(() => import('../../common/DataGrid'));


const UserAccessReview = () => {

    const [apps, setApps] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const navigate = useNavigate();



    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = await userService.fetchCurrentUser()
                if (currentUser) {
                    const assignedApps = await appService.fetchAppsByOwner(currentUser.id)
                    
                    if (assignedApps) {

                        setApps(assignedApps);
                        
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();

    }, []);

    const rows = apps.map((app, index) => ({
        id: index + 1,
        APP_NAME: app.APP_NAME || '-',
        COMPANY_NAME: app.COMPANY_NAME || '-',
        APP_DESCRIPTION: app.APP_DESCRIPTION || '-',
        appID: app.id,
    }));

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

    const renderAuditPrepButton = (params) => {
        const app = params.row;
        const readyforaudit = app.geninfo && app.userdata && app.process;

        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="View Access Reviews" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleClick(event, app)}
                    >
                        <FolderOpenIcon sx={{ fontSize: '18px', color: theme.palette.secondary.main }} />
                    
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
            headerName: 'View Access Reviews',
            width: 200,
            sortable: false,
            renderCell: renderAuditPrepButton,
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


    const handleClick = (event, app) => {
        navigate(`/useraccessreview/${app.appID}`)
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
                    <mui.Typography color="text.primary"> User Access Review </mui.Typography>

                </mui.Breadcrumbs>

                <SearchAppBar title="User Access Review" icon={<RateReviewIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Create and view status of user access review
                </mui.Typography>

                <Separator />

                <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={rows}
                            columns={columns}
                            columnsWithActions={columnsWithActions}
                        />
                    </Suspense>

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
};

export default UserAccessReview;