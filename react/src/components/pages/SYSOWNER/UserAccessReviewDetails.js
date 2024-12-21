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


const UserAccessReviewDetails = () => {

    const { id } = useParams();

    const { phase } = useParams();

    const [apps, setApps] = useState([]);

    const [uarExist, setUARExist] = useState(false);
    const [uarFile, setUARFile] = useState(false);
    const [uar, setUAR] = useState([]);

    const [selectedFrequency, setSelectedFrequency] = useState(false);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openSetupModal, setOpenSetupModal] = useState(false);
    const [saved, setSaved] = useState(false);

    const [openUARs, setOpenUARs] = useState(true);

    const navigate = useNavigate();


    const startDate = dayjs(uarFile.START_DATE);
    const isValidStartDate = startDate.isValid();

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

        const fetchUAR = async () => {
            try {
                const uar = await uarService.fetchUARByApp(id);

                if (uar && uar.length > 0) {
                    setUARExist(true);
                    setOpenCreateModal(false);
                    setOpenSetupModal(false);
                    setUAR(uar)
                    
                } else {
                    // No records found
                    setUARExist(false);
                    setOpenCreateModal(true);
                    setOpenSetupModal(false);
                }

            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                    // Handle specific HTTP errors
                    setOpenCreateModal(true);
                    setOpenSetupModal(false);
                } else {
                    // Log other errors
                    console.error('Error fetching data:', error);
                }
            }
        };


        fetchApp();
        fetchUAR();

    }, [saved]);

    const handleCreateUAR = () => {
        setOpenCreateModal(true);
    };

    const handleCloseCreateModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenCreateModal(true)
        }
        else {
            setOpenCreateModal(false);
        }
    };

    const handleSetupUAR = () => {
        setOpenSetupModal(true);
    };

    const handleCloseSetupModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenSetupModal(true)
        }
        else {
            setOpenSetupModal(false);
        }
    };

    const createUAR = async (e) => {
        e.preventDefault();
        setOpenCreateModal(false)
        setOpenSetupModal(true)
    };


    const createUARData = async (e) => {
        e.preventDefault();
        try {
            let startDate = new Date(uarFile.START_DATE);

            // Function to format a Date object to YYYY-MM-DD
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            // Function to add months to the start date based on the frequency
            const addMonthsToDate = (date, months) => {
                const newDate = new Date(date);
                newDate.setMonth(newDate.getMonth() + months);
                return newDate;
            };

            let recordsToCreate = [];

            // Based on frequency, determine how many records to create and assign REVIEW_TAG
            if (uarFile.FREQUENCY === 'Annually') {
                recordsToCreate.push({
                    ...uarFile,
                    START_DATE: formatDate(startDate),
                    REVIEW_TAG: 1 // Single record, tag it as 1
                });
            } else if (uarFile.FREQUENCY === 'Semi-Annually') {
                // Create two records, 6 months apart
                recordsToCreate.push({
                    ...uarFile,
                    START_DATE: formatDate(startDate),
                    REVIEW_TAG: 1
                });
                let secondRecordDate = addMonthsToDate(startDate, 6);
                recordsToCreate.push({
                    ...uarFile,
                    START_DATE: formatDate(secondRecordDate),
                    REVIEW_TAG: 2 // Second record gets tag 2
                });
            } else if (uarFile.FREQUENCY === 'Quarterly') {
                // Create 4 records, each 3 months apart
                for (let i = 0; i < 4; i++) {
                    let recordDate = addMonthsToDate(startDate, i * 3);
                    recordsToCreate.push({
                        ...uarFile,
                        START_DATE: formatDate(recordDate),
                        REVIEW_TAG: i + 1 // Tag from 1 to 4 based on index
                    });
                }
            } else if (uarFile.FREQUENCY === 'Monthly') {
                // Create 12 records, each 1 month apart
                for (let i = 0; i < 12; i++) {
                    let recordDate = addMonthsToDate(startDate, i);
                    recordsToCreate.push({
                        ...uarFile,
                        START_DATE: formatDate(recordDate),
                        REVIEW_TAG: i + 1 // Tag from 1 to 12 based on index
                    });
                }
            }

            // Now create the UAR records using the service for each calculated date
            for (let record of recordsToCreate) {
                const result = await uarService.createUAR(record);
                if (result) {
                    console.log('UAR record created successfully:', record.START_DATE, 'REVIEW_TAG:', record.REVIEW_TAG);
                }
            }

            setOpenSetupModal(false); // Close modal after completion
            setSaved(true)

        } catch (error) {
            console.error("There was a problem creating UAR file", error);
        }
    };

    const frequency = [
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Quarterly', label: 'Quarterly' },
        { value: 'Semi-Annually', label: 'Semi-Annually' },
        { value: 'Annually', label: 'Annually' },
    ];

    const handleFrequencyChange = (selectedOptions) => {
        const frequency = selectedOptions.value
        setSelectedFrequency(selectedOptions)

        const updatedData = {
            ...uarFile,
            APP_NAME: id,
            FREQUENCY: frequency
        };

        setUARFile(updatedData)
    }

    const handleDateChange = (newValue) => {
        // Check if newValue is a valid Day.js object
        const formattedDate = newValue && newValue.isValid() ? newValue.format('YYYY-MM-DD') : null;

        const updatedData = {
            ...uarFile,
            START_DATE: formattedDate // Update the START_DATE
        };

        setUARFile(updatedData);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Check if it's the START_DATE and format it accordingly
        if (name === 'START_DATE' && value) {
            // If the field is START_DATE, treat it as a date and format it
            const formattedDate = dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : null;
            value = formattedDate;  // Update value to the formatted date
        }

        const updatedData = {
            ...uarFile,
            [name]: value
        };

        setUARFile(updatedData);
    };


    const handleDaysToCompleteChange = (e) => {
        const { name, value } = e.target;


        const updatedData = {
            ...uarFile,
            [name]: value
        };

        setUARFile(updatedData)
    };
    
    const rows = uar.map((uar, index) => ({
        id: index + 1,
        FREQUENCY: uar.FREQUENCY || '-',
        REVIEW_TAG: uar.REVIEW_TAG || '-',
      
        STATUS: uar.STATUS || '-',
        uarID: uar.id,
    }));

    
    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'FREQUENCY', headerName: 'Frequency', flex: 1 },
        { field: 'REVIEW_TAG', headerName: 'Review Cycle', flex: 1 },
        { field: 'STATUS', headerName: 'Status', flex: 1 },
    ];


    const handleClick = (event, app) => {
        navigate(`/useraccessreview/data/${id}/${app.uarID}`)
    };

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
                <Tooltip title="View Access Reviews" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleClick(event, phase)}
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

                
                <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={rows}
                            columns={columns}
                            columnsWithActions={columnsWithActions}
                        />
                    </Suspense>

                
                <CustomSpeedDial onClick={handleCreateUAR} />

                <Modal
                    open={openCreateModal}
                    onClose={handleCloseCreateModal}
                    header="UAR Setup Window"
                    body={
                        <>
                            <mui.Typography variant="subtitle2">
                                System detected that UAR file has not been setup for {apps.APP_NAME}. Click the 'Setup Access Review' button below to continue.
                            </mui.Typography>
                        </>
                    }
                    footer={
                        <>
                            <mui.Button onClick={handleCloseCreateModal} color="primary" sx={{ marginBottom: '10px' }}>
                                Cancel
                            </mui.Button>
                            <mui.Button onClick={createUAR} color="primary" variant="contained" sx={{ marginRight: '10px', marginBottom: '10px' }}>
                                Setup Access Review
                            </mui.Button>
                        </>
                    }
                />

                <Modal
                    size={"sm"}
                    open={openSetupModal}
                    onClose={handleCloseSetupModal}
                    header="UAR Setup Window"
                    z-Index="9999"
                    body={
                        <>

                            <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                                Frequency:
                            </mui.Typography>

                            <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                <MultipleSelect
                                    isMultiSelect={false}
                                    placeholderText="Select Frequency"
                                    selectedOptions={selectedFrequency}
                                    selectOptions={frequency}
                                    value={selectedFrequency}
                                    handleChange={handleFrequencyChange}
                                    styles={{
                                        menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 20000, // Ensure it's above the modal content
                                        }),
                                        control: (base) => ({
                                            ...base,
                                            zIndex: 10000, // Optional: to make sure the control itself is above other modal content
                                        }),
                                    }}
                                    menuPortalTarget={document.body} // Make sure the dropdown is appended to the body
                                />
                            </div>

                            <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>

                                <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                                    Review Start Date:
                                </mui.Typography>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            zIndex="100"
                                            value={isValidStartDate ? startDate : null}  // Ensure valid date is passed
                                            sx={{ width: '100%', fontSize: '11px' }}
                                            onChange={handleDateChange}
                                            renderInput={(params) => (
                                                <NormalTextField
                                                    {...params}
                                                    name="START_DATE"
                                                    sx={{
                                                        width: '100%',
                                                        '& input': { fontSize: '12px' },  // Ensure font size of input text
                                                        fontSize: '12px'
                                                    }}
                                                    onChange={handleInputChange}
                                                    onBlur={handleInputChange}
                                                />
                                            )}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>

                            </div>

                            <mui.Typography variant="overline" style={{ marginTop: '30px', marginBottom: '20px' }}>
                                Days to Complete (in days):
                            </mui.Typography>

                            <NormalTextField
                                type="number"
                                name="DAYS_TO_COMPLETE"
                                value={uarFile.DAYS_TO_COMPLETE}
                                onChange={handleDaysToCompleteChange}
                            />
                        </>
                    }
                    footer={
                        <>
                            <mui.Button onClick={handleCloseSetupModal} color="primary" sx={{ marginBottom: '10px' }}>
                                Cancel
                            </mui.Button>
                            <mui.Button onClick={createUARData} color="primary" variant="contained" sx={{ marginRight: '10px', marginBottom: '10px' }}>
                                Proceed
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
};

export default UserAccessReviewDetails;