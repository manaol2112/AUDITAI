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
import { useParams } from 'react-router-dom';
import uarService from '../../../services/UARService';
import { useNavigate } from 'react-router-dom';
import NotFound from '../../common/404';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HRService from '../../../services/HrService';
import CircleIcon from '@mui/icons-material/Circle'; // For status icon
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


const DataTable = React.lazy(() => import('../../common/DataGrid'));


const UARApprovalView = () => {

    const [reviewData, setReviewData] = useState([]);
    const navigate = useNavigate();

    const { token } = useParams();
    const [isValidToken, setIsValidToken] = useState(true);

    const [hrList, setHRList] = useState([]);
    const [apps, setApps] = useState([]);

    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {

        const fetchReviewData = async () => {
            try {

                const data = await uarService.fetchUARByToken(token)

                const today = new Date(); // Get the current date and time

                if (data) {
                    //GET THE APP NAME

                    console.log('This is the data', data)

                    
                    // Convert EXPIRES_AT string to Date object
                    const expiresAt = new Date(data.EXPIRES_AT);
            
                    //CHECK FOR EXPIRED TOKEN
                    if (expiresAt > today) {
                        setIsValidToken(true)

                        const uar_file = await uarService.fetchUARByUARFile(data.UAR_FILE)

                        if (uar_file) {
                            
                            try {
                                const app = await appService.fetchAppsById(uar_file[0].APP_NAME)
                                if (app) {
                                    console.log('This is the app name', app.APP_NAME)
                                    setApps(app)
                                }
                            } catch (error) {
                                console.error('Error fetching data:', error);
                            }
        

                            const access_review = uar_file.filter(owner => owner.ROLE_OWNER === data.ROLE_OWNER)

                            setReviewData(access_review)

                        }

                    }  else {
                        setIsValidToken(false)
                    }
          
                }

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

                }
            } catch (error) {
                console.error('Error fetching role owner:', error);
            }
        };

        fetchReviewData();
        fetchRoleOwner();


    }, [token]);
    
    // Toggle selection of a single row
    const handleRowSelection = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // Select or deselect all rows
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedRows(rows.map(row => row.id)); // Select all rows
        } else {
            setSelectedRows([]); // Deselect all rows
        }
    };

    const rows = reviewData.map((item, index) => {

        // Fixing the comparison operator to '===' and properly defining user_name
        const user_name = hrList.find(user => user.EMAIL_ADDRESS === item.EMAIL_ADDRESS);

        return {
            id: index + 1,
            APP_NAME: apps.APP_NAME, // Default to 'Unknown' if not found
            NAME: user_name ? `${user_name.FIRST_NAME} ${user_name.LAST_NAME}` : '-', // Concatenating first and last names
            EMAIL_ADDRESS: item.EMAIL_ADDRESS,
            ROLE_NAME: item.ROLE_NAME,
            STATUS: item.STATUS? item.STATUS : 'Pending Review',
            uarID: item.id,
            HR_FLAG: user_name ? `${user_name.STATUS}` : 'Unknown'
        };

    });

    // Define your columns as before
    const columns = [
        {
            field: 'checkbox',
            headerName: '',
            width: 40,
            sortable: false,      // Disable sorting
            filterable: false,    // Disable filtering
            disableColumnMenu: true, // Disable the column menu
            renderHeader: (params) => (
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.length === rows.length}
              />
            ),
            renderCell: (params) => (
              <input
                type="checkbox"
                checked={selectedRows.includes(params.row.id)}
                onChange={() => handleRowSelection({
                  selectionModel: selectedRows.includes(params.row.id) 
                    ? selectedRows.filter(id => id !== params.row.id) 
                    : [...selectedRows, params.row.id]
                })}
              />
            ),
          },
        { field: 'id', headerName: '#', width: 50 },
        { field: 'APP_NAME', headerName: 'System Name', flex: 1 },
        { field: 'NAME', headerName: 'Name', flex: 1 },
        { field: 'EMAIL_ADDRESS', headerName: 'Email Address', flex: 1 },
        { field: 'ROLE_NAME', headerName: 'Role Name', flex: 1 },
        { field: 'STATUS', headerName: 'Status', flex: 1 },
        { field: 'HR_FLAG', headerName: 'HR Status', flex: 1 },

    ];


    const handleApproveAllClick = (event, phase) => {
        console.log('This is to approve all')
    };

    const handleRejectAllClick = (event, phase) => {
        console.log('This is to reject all')
    };

    const handleApproveClick = async (event, phase) => {
        console.log('This is the id of the uar', phase.uarID, 'with user' , phase.EMAIL_ADDRESS, 'APPROVE')

        const today = new Date(); // Get today's date
        const date = today.toISOString().split('T')[0]; // Format it as 'YYYY-MM-DD' (ISO format)

        const updatedData = {
            STATUS: 'Reviewed',
            REVIEW_COMPLED_ON: date,
        };

        const approve_user = await uarService.updateUARSODRecord(phase.uarID, updatedData)

        if (approve_user) {
            console.log('Successfully updated record')
        }
    };

    const handleRejectClick = (event, phase) => {
        console.log('This is the id of the uar', phase.uarID, 'with user' , phase.EMAIL_ADDRESS, 'REJECT')
    };

    const renderApprovalButton = (params) => {
        const phase = params.row;

        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="Approve" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="big"
                        onClick={(event) => handleApproveClick(event, phase)}
                    >

                        <CheckCircleIcon sx={{ fontSize: '20px', color: 'green' }} />

                    </mui.IconButton>
                </Tooltip>

                <Tooltip title="Reject" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="big"
                        onClick={(event) => handleRejectClick(event, phase)}
                    >
                        <CancelIcon sx={{ fontSize: '20px', color: 'red' }} />

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
            headerName: 'Review Actions',
            width: 200,
            sortable: false,
            renderCell: renderApprovalButton,
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
    
    const customMainContent = (
        <div>
            <ResponsiveContainer>
             

                <mui.Typography variant="h5" sx={{marginBottom: '20px'}}>
                    User Access Review for {apps.APP_NAME}
                </mui.Typography>

                 <mui.Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '20px' }}>
                            <mui.Button onClick={''} color="primary" variant="contained" sx={{ marginRight: '10px' }}>
                                Approve 
                            </mui.Button>
                            <mui.Button onClick={''} color="primary" variant="contained">
                                Reject 
                            </mui.Button>
                </mui.Box>

                {isValidToken ? (
                    <div>
                       <mui.Typography>
                       <Suspense fallback={<div>Loading...</div>}>
                            <DataTable
                                rows={rows}
                                columns={columns}
                                columnsWithActions={columnsWithActions}
                            />
                        </Suspense>
                       </mui.Typography>
                    </div>
                ): <div>
                        <mui.Typography>
                            <NotFound
                                title="Record Not Found"
                                message="The token you provided is either invalid or has expired. Please verify the token and try again. If the issue persists, contact your system administrator for assistance."
                            />

                        </mui.Typography>
                    </div>}

            </ResponsiveContainer>
        </div>
    )

    return (
            <Suspense fallback="Loading...">
                <div>
                    <SysOwnerSideBar mainContent={customMainContent} />
                </div>
            </Suspense>
    );
};

export default UARApprovalView;
