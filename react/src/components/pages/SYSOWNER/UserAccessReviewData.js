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
import CustomSpeedDial from '../../common/SpeedDial';
import uarService from '../../../services/UARService';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import NormalTextField from '../../common/NormalTextField';
import dayjs from 'dayjs';
import OutlinedCard from '../../common/MediaCard';
import companyService from '../../../services/CompanyService';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import VisibilityIcon from '@mui/icons-material/Visibility';


const DataTable = React.lazy(() => import('../../common/DataGrid'));


const UserAccessReviewData = () => {

    const { id } = useParams();

    const { phase } = useParams();

    const [apps, setApps] = useState([]);

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

        fetchApp();

    }, [ ]);

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

                </mui.Breadcrumbs>

                <SearchAppBar title={apps ? `User Access Review: ${apps.APP_NAME}` : 'User Access Review'} icon={<RateReviewIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Create and view status of user access review
                </mui.Typography>

                <Separator />


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