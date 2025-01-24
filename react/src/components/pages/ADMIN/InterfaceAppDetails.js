import React, { useState, useEffect, Suspense } from 'react';
import { SideBar } from '../../layout';
import { useNavigate, useParams } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import GridViewIcon from '@mui/icons-material/GridView';
import appService from '../../../services/ApplicationService';  // Assuming this service fetches the app data
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import UsbIcon from '@mui/icons-material/Usb';
import HubIcon from '@mui/icons-material/Hub';
import DynamicTabs from '../../common/DynamicTabs';
import NormalTextField from '../../common/NormalTextField';
import MultipleSelect from '../../common/MultipleSelect';
import Timepicker from '../../common/Timepicker';
import SFTPService from '../../../services/SFTPService';
import Notification from '../../common/Notification';
import JobService from '../../../services/JobsService';
import HRService from '../../../services/HrService';


const DataTable = React.lazy(() => import('../../common/DataGrid'));


const InterfaceDetailsPerApp = () => {
    const { id } = useParams();  // Assuming 'id' is passed in the URL
    const [appDetails, setAppDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sftp, setSFTP] = useState({});
    const [sftpExist, setSFTPExist] = useState(false);
    const [jobScheduleExist, setJobScheduleExist] = useState(false);
    const [jobAlertExist, setJobAlertExist] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [jobConfig, setJobConfig] = useState({});
    const [alertTitle, setAlertTitle] = useState({});
    const [alertMessage, setAlertMessage] = useState({});
    const [selectedDays, setSelectedDays] = useState([]);
    const [jobConfigData, setJobConfigData] = useState([]);
    const [emailSelection, setEmailSelection] = useState([]);
    const [recipient, setRecipient] = useState({});
    const [alertConfigData, setAlertConfigData] = useState([]);
    const [joblogData, setLogData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await appService.fetchAppsById(id);  // Fetch app details by ID
                setAppDetails(response);  // Assuming response has app data
                setLoading(false);
            } catch (error) {
                console.error('Error fetching app data:', error);
                setError('Failed to fetch application details');
                setLoading(false);
            }
        };

        const fetchSFTPData = async () => {
            try {
                const response = await SFTPService.fetchAppSFTPById(id);  // Fetch app details by ID
                if (response) {
                    setSFTP(response)
                    setSFTPExist(true)
                }

            } catch (error) {
                console.error('Error fetching sftp data:', error);
            }
        };

        const fetchJobSchedule = async () => {
            try {
                const response = await JobService.fetchAppJobScheduleById(id);

                if (response) {
                    setSelectedDays(response)
                    setJobScheduleExist(true)
                    setJobConfigData(response);
                }


            } catch (error) {
                console.error('Error fetching job schedule data:', error);
            }
        };

        const fetchHRList = async () => {
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
                        label: `${item.FIRST_NAME} ${item.LAST_NAME}  (${item.EMAIL_ADDRESS})`
                    }));

                    setEmailSelection(email);


                }
            } catch (error) {
                console.error(`Error fetching HR data: ${error.message}`);
            }
        };

        const fetchJobLog = async () => {
            try {
                const jobLog = await JobService.fetchAppJobLogById(id);

                if (jobLog) {
                    setLogData(jobLog)
                }
            } catch (error) {
                console.error(`Error fetching job Log: ${error.message}`);
            }
        };

        fetchData();
        fetchSFTPData();
        fetchJobSchedule();
        fetchHRList();
        fetchJobLog();

    }, [id]);

    const fetchJobAlert = async () => {
        try {
            const response = await JobService.fetchAppJobAlertById(id);

            if (response) {
                console.log('This is the job alert data', response);
                setAlertConfigData(response);
                setJobAlertExist(true);

                // Safely split the strings
                const recipientArray = safeSplit(response[0].RECIPIENT);

                // Map through the recipientArray and create selectedRecipient with HR names
                const selectedRecipient = recipientArray.map(item => {
                    // Find the corresponding HR entry for the email
                    const hrEntry = emailSelection.find(hr => hr.value === item);

                    // Return an object with value and label
                    return {
                        value: item,
                        label: hrEntry ? `${hrEntry.label}` : item, // Show first name, last name if found, else email
                    };
                });

                setRecipient(selectedRecipient);
            }
        } catch (error) {
            console.error('Error fetching job alert data:', error);
            setJobAlertExist(false);
        }
    };

    const safeSplit = (value, delimiter = ',') => {
        if (value && typeof value === 'string') {
            return value.split(delimiter);
        }
        return [];
    };
    // UseEffect to call fetchJobAlert when emailSelection is loaded
    useEffect(() => {
        if (emailSelection.length > 0) {

            fetchJobAlert(id);
        }
    }, [emailSelection], [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSFTP({ ...sftp, [name]: value });
    };

    const handleJobConfig = (e) => {
        const { name, value } = e.target;
        setSelectedDays((prevSelectedDays) => ({
            ...prevSelectedDays,
            [name]: value,  // Use dynamic property name for flexibility
        }));
    };


    const handleTimeChange = (formattedTime) => {
        setSelectedDays((prevSelectedDays) => ({
            ...prevSelectedDays,
            SCHEDULE_TIME: formattedTime,
            APP_NAME: id,
            STATUS: 'Scheduled',
        }));
    };

    const handleDayChange = (selectedOptions) => {
        const updatedSelectedDays = {
            MONDAY: selectedOptions.some(option => option.label === 'Monday'),
            TUESDAY: selectedOptions.some(option => option.label === 'Tuesday'),
            WEDNESDAY: selectedOptions.some(option => option.label === 'Wednesday'),
            THURSDAY: selectedOptions.some(option => option.label === 'Thursday'),
            FRIDAY: selectedOptions.some(option => option.label === 'Friday'),
            SATURDAY: selectedOptions.some(option => option.label === 'Saturday'),
            SUNDAY: selectedOptions.some(option => option.label === 'Sunday')
        };

        // Correctly update state with previous values merged with updated days
        setSelectedDays((prevSelectedDays) => ({
            ...prevSelectedDays,
            ...updatedSelectedDays  // Merge previous state with updated days
        }));
    };

    const handleAlertConfigChange = (selectedOptions) => {

        const recipient = selectedOptions.map(option => option.value);

        const recipientString = recipient.join(',');

        setRecipient(selectedOptions)

        const updatedData = {
            ...alertConfigData,
            RECIPIENT: recipientString,
            APP_NAME: id
        };

        setAlertConfigData(updatedData);

    };

    const daysOfWeek = [
        { label: 'Monday', value: 'MONDAY' },
        { label: 'Tuesday', value: 'TUESDAY' },
        { label: 'Wednesday', value: 'WEDNESDAY' },
        { label: 'Thursday', value: 'THURSDAY' },
        { label: 'Friday', value: 'FRIDAY' },
        { label: 'Saturday', value: 'SATURDAY' },
        { label: 'Sunday', value: 'SUNDAY' }
    ];


    if (loading) {
        return <mui.CircularProgress />;
    }

    if (error) {
        return (
            <mui.Alert severity="error">
                {error}
            </mui.Alert>
        );
    }

    const createJobSchedule = async (e) => {
        e.preventDefault();
        try {

            const response = await JobService.createAppJobSchedule(selectedDays);
            if (response) {
                setJobScheduleExist(true);
                setAlertTitle('Successful');
                setAlertMessage('Successfully created job schedule');
                setShowAlert(true);

                setTimeout(() => {
                    window.location.reload();
                }, 2000); // 2000 ms = 2 seconds
            }

        } catch (error) {
            console.error(error);
        }
    };


    const createJobAlert = async (e) => {
        e.preventDefault();
        try {

            const response = await JobService.createAppJobAlert(alertConfigData);
            if (response) {
                setJobAlertExist(true);
                setAlertTitle('Successful');
                setAlertMessage('Successfully created job alert');
                setShowAlert(true);

                setTimeout(() => {
                    window.location.reload();
                }, 2000); // 2000 ms = 2 seconds
            }

        } catch (error) {
            console.error(error);
        }
    };

    const updateJobAlert = async (e) => {
        e.preventDefault();
        try {

            const response = await JobService.updateJobAlert(id, alertConfigData);
            if (response) {
                setJobAlertExist(true);
                setAlertTitle('Successful');
                setAlertMessage('Successfully updated job alert configuration');
                setShowAlert(true);

                setTimeout(() => {
                    window.location.reload();
                }, 1500); // 2000 ms = 2 seconds
            }

        } catch (error) {
            console.error(error);
        }
    };


    const createSFTP = async (e) => {
        e.preventDefault();
        try {

            const updatedData = {
                ...sftp,
                APP_NAME: id,
            };

            const response = await SFTPService.createAppSFTP(updatedData);
            if (response) {
                setSFTPExist(true)
                setAlertTitle('Successful')
                setAlertMessage('Successfully configured SFTP connection')
                setShowAlert(true)
            }

        } catch (error) {
            console.error(error)
        }
    };

    const updateSFTP = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                ...sftp,
                APP_NAME: id,
            };

            const response = await SFTPService.updateAppSFTP(id, updatedData);
            if (response) {
                setSFTPExist(true);
                setAlertTitle('Successful')
                setAlertMessage('Successfully updated SFTP connection')
                setShowAlert(true);

                // Reload the page after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 1500); // 2000 ms = 2 seconds
            }
        } catch (error) {
            console.error(error);
        }
    };

    const testSFTP = async () => {
        try {
            const response = await SFTPService.fetchAppSFTPById(id);
            if (response) {
                setAlertTitle('Successful')
                setAlertMessage('Test conmpleted successfully.')
                setShowAlert(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const rows = jobConfigData.map((app, index) => ({
        id: index + 1,
        JOB_NAME: app.JOB_NAME || '-',
        MONDAY: app.MONDAY ? 'Yes' : 'No',
        TUESDAY: app.TUESDAY ? 'Yes' : 'No',
        WEDNESDAY: app.WEDNESDAY ? 'Yes' : 'No',
        THURSDAY: app.THURSDAY ? 'Yes' : 'No',
        FRIDAY: app.FRIDAY ? 'Yes' : 'No',
        SATURDAY: app.SATURDAY ? 'Yes' : 'No',
        SUNDAY: app.SUNDAY ? 'Yes' : 'No',
        SUNDAY: app.SUNDAY ? 'Yes' : 'No',
        SCHEDULE_TIME: app.SCHEDULE_TIME,
        STATUS: app.STATUS
    }));

    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'JOB_NAME', headerName: 'Job Name', flex: 1 },
        { field: 'MONDAY', headerName: 'Monday', width: 100 },
        { field: 'TUESDAY', headerName: 'Tuesday', width: 100 },
        { field: 'WEDNESDAY', headerName: 'Wednesday', width: 100 },
        { field: 'THURSDAY', headerName: 'Thursday', width: 100 },
        { field: 'FRIDAY', headerName: 'Friday', width: 100 },
        { field: 'SATURDAY', headerName: 'Saturday', width: 100 },
        { field: 'SUNDAY', headerName: 'Sunday', width: 100 },
        { field: 'SCHEDULE_TIME', headerName: 'Time', width: 100 },
        { field: 'STATUS', headerName: 'Status', width: 100 },
    ];

    const columnsWithActions = [
        ...columns,
    ];

    const convertToDate = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':');
        const date = new Date();
        date.setHours(hours, minutes, seconds, 0);
        return date;
    };


    const rowsLog = joblogData.map((job, index) => ({
        id: index + 1,
        JOB_NAME: job.JOB_NAME,
        JOB_DATE: job.JOB_DATE,
        JOB_FILE_NAME: job.JOB_FILE_NAME,
        SOURCE_LINE_COUNT: job.SOURCE_LINE_COUNT,
        JOB_COMPLETE: job.JOB_COMPLETE ? 'Complete' : 'Failed'  // Direct check for truthiness
    }));
    

    const columnsLog = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'JOB_NAME', headerName: 'Job Name', flex: 1 },
        { field: 'JOB_DATE', headerName: 'Run Date', flex: 1 },
        { field: 'JOB_FILE_NAME', headerName: 'File Name', flex: 1 },
        { field: 'SOURCE_LINE_COUNT', headerName: 'Record Count', flex: 1 },
        { field: 'JOB_COMPLETE', headerName: 'Status', flex: 1 },
    ];

    const columnsWithActionsLog = [
        ...columnsLog,
    ];

    const tabs = [

        {
            value: '1',
            label: 'Configuration',
            content: (
                <div>

                    <mui.Box >
                        <NormalTextField

                            label="Host Name"
                            name="HOST_NAME"
                            value={sftp.HOST_NAME}
                            onChange={handleChange}
                            required={true}
                        />

                        <NormalTextField

                            label="Port"
                            name="PORT"
                            value={sftp.PORT}
                            onChange={handleChange}
                            required={true}
                        />

                        <NormalTextField
                            label="Source Directory"
                            name="SFTP_DIRECTORY"
                            value={sftp.SFTP_DIRECTORY}
                            onChange={handleChange}
                            required={true}
                        />

                        <NormalTextField
                            label="Username"
                            name="SFTP_USERNAME"
                            value={sftp.SFTP_USERNAME}
                            onChange={handleChange}
                            required={true}
                        />

                        <NormalTextField
                            label="Password"
                            name="SFTP_PW_HASHED"
                            value={sftp.SFTP_PW_HASHED}
                            type="password"
                            onChange={handleChange}
                            required={true}
                        />

                        <NormalTextField
                            label="Secret Key"
                            name="SFTP_SECRET_HASHED"
                            type="password"
                            value={sftp.SFTP_SECRET_HASHED}
                            onChange={handleChange}
                            required={true}
                        />
                        {sftpExist ? (
                            <>
                                <mui.Button sx={{ marginTop: '20px' }} onClick={updateSFTP} color="primary" variant="contained">
                                    Update
                                </mui.Button>
                                <mui.Button sx={{ marginTop: '20px', marginLeft: '10px' }} onClick={testSFTP} color="primary" variant="contained">
                                    Test Connection
                                </mui.Button>
                            </>
                        ) : (
                            <mui.Button sx={{ marginTop: '20px' }} onClick={createSFTP} color="primary" variant="contained">
                                Submit
                            </mui.Button>
                        )}


                    </mui.Box>

                </div>
            ),
        },

        {
            value: '2',
            label: 'Scheduled Jobs',
            content: (
                <div>

                    <NormalTextField
                        label="Job Name"
                        name="JOB_NAME"
                        type="text"
                        value={selectedDays.JOB_NAME || ''}  // Make sure to handle it correctly
                        onChange={handleJobConfig}
                        required={true}
                    />

                    <mui.Typography sx={{ mb: 1, py: 1 }}>

                        <mui.Typography variant="subtitle2" gutterBottom>
                            Select days to set the frequency of the automated job
                        </mui.Typography>
                        <div style={{ marginTop: '18px' }}>

                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Days*"
                                selectOptions={daysOfWeek}
                                selectedOptions={daysOfWeek.filter(day => selectedDays[day.value])}
                                handleChange={handleDayChange}
                            />

                        </div>
                        <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                            Select time to run the automated job
                        </mui.Typography>

                        <Timepicker selected={selectedDays.SCHEDULE_TIME} onChange={handleTimeChange} />

                        <mui.Button sx={{ marginTop: '20px' }} onClick={createJobSchedule} color="primary" variant="contained">
                            Schedule
                        </mui.Button>

                        <mui.Button sx={{ marginTop: '20px', marginLeft: '10px' }} onClick={createJobSchedule} color="primary" variant="contained">
                            RUN JOB
                        </mui.Button>

                        {/* Add content for Step 2 here */}
                    </mui.Typography>


                    <Separator />
                    <mui.Typography variant="subtitle2" gutterBottom>
                        Scheduled Jobs:
                    </mui.Typography>

                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={rows}
                            columns={columns}
                            columnsWithActions={columnsWithActions}
                        />
                    </Suspense>


                </div>
            ),
        },

        {
            value: '3',
            label: 'Alert Configuration',
            content: (
                <div>

                    <mui.Typography variant="subtitle2" gutterBottom>
                        Employees in the section below will receive email notifications in the event of any issues with job execution
                    </mui.Typography>

                    <div style={{ marginTop: '18px' }}>

                        <MultipleSelect
                            isMultiSelect={true}
                            placeholderText="Select Employees*"
                            selectOptions={emailSelection}
                            selectedOptions={recipient && recipient.length > 0 ? recipient : []}
                            handleChange={handleAlertConfigChange}
                        />

                    </div>

                    {jobAlertExist ? (
                        <>
                            <mui.Button sx={{ marginTop: '20px' }} onClick={updateJobAlert} color="primary" variant="contained">
                                Update
                            </mui.Button>
                        </>
                    ) : (
                        <mui.Button sx={{ marginTop: '20px' }} onClick={createJobAlert} color="primary" variant="contained">
                            Submit
                        </mui.Button>
                    )}

                </div>
            ),
        },

        {
            value: '4',
            label: 'Job History',
            content: (
                <div>

                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={rowsLog}
                            columns={columnsLog}
                            columnsWithActions={columnsWithActionsLog}
                        />
                    </Suspense>


                </div>
            ),
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
                        Dashboard
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/dashboard">
                        System Settings
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/applications">
                        Applications
                    </mui.Link>

                    <mui.Typography color="text.primary">Interface</mui.Typography>
                    <mui.Typography color="text.primary">{appDetails?.APP_NAME || 'Loading...'}</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="User Data Interface" icon={<HubIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage and Maintain User Access Data
                </mui.Typography>

                {showAlert && <Notification title={alertTitle} message={alertMessage} />}

                <DynamicTabs tabs={tabs} />


                <Separator />
                {/* You can add more content below as needed */}
            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>
    );
};

export default InterfaceDetailsPerApp;
