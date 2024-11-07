import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import ResponsiveContainer from '../../layout/Container';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import InputFileUpload from '../../common/FileUpload';
import FormHelperText from '@mui/material/FormHelperText';
import NormalTextField from '../../common/NormalTextField';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MultipleSelect from '../../common/MultipleSelect';
import Timepicker from '../../common/Timepicker';
import SFTPService from '../../../services/SFTPService';
import DynamicSnackbar from '../../common/Snackbar';
import JobService from '../../../services/JobsService';
import LoadingButton from '@mui/lab/LoadingButton';
import Cookies from 'js-cookie';
import CSRFTOKEN from '../../../utils/csrf';
import { getCSRFToken } from '../../../utils/csrf';
import FileUpload from '../../common/FileUpload';

const InterfacesHR = () => {
    const navigate = useNavigate();

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const steps = ['Setup Credentials and Directories', 'Schedule Automated Job', 'Test Connection and Complete'];
    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = { ...completed };
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    const [existingSettings, setExistingSettings] = useState([]);
    const [sftp, setSFTP] = useState({
        HOST_NAME: '',
        SFTP_USERNAME: '',
        SFTP_PW_HASHED: '',
        SFTP_DIRECTORY: '',
        SFTP_DESTINATION: '',
        AUTH_KEY: '',
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSFTP({ ...sftp, [name]: value });
    };

    //FETCH SFTP RECORD
    useEffect(() => {
        const fetchHRSFTP = async () => {
            try {
                const response = await SFTPService.fetchSFTP();
                if (response) {
                    setExistingSettings(response)
                    setSFTP({
                        HOST_NAME: response[0].HOST_NAME || '',
                        SFTP_USERNAME: response[0].SFTP_USERNAME || '',
                        SFTP_PW_HASHED: response[0].SFTP_PW_HASHED || '',
                        SFTP_DIRECTORY: response[0].SFTP_DIRECTORY || '',
                        SFTP_DESTINATION: response[0].SFTP_DESTINATION || '',
                        AUTH_KEY: response[0].AUTH_KEY || false,
                    });

                }
            } catch (error) {
                console.error('Error fetching password settings:', error);
            }
        };
        fetchHRSFTP();
    }, []);

    const createSFTP = async (e) => {
        e.preventDefault();

        try {
            let response;
            if (existingSettings.length > 0) {
                response = await SFTPService.updateSFTP(existingSettings[0].id, sftp);
                setSnackbarMessage('Successfully updated the SFTP connection for HR data');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } else {
                response = await SFTPService.createSFTP(sftp);

                setSnackbarMessage('Successfully created the SFTP connection for HR data');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                window.location.reload()

            }
            completeFirstStep()
            setSnackbarOpen(true); // Open the snackbar after setting message and severity
        } catch (error) {
            setSnackbarMessage('There was a problem setting up the SFTP connection');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };



    const [existingSchedule, setExistingSchedule] = useState([]);

    //FETCH SFTP RECORD
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await JobService.fetchSchedule();

                if (response && response.length > 0) { // Check if response exists and has elements
                    setExistingSchedule(response)

                    const parsedDate = new Date(response[0].SCHEDULE_TIME);

                    setSelectedDays({
                        MONDAY: response[0].MONDAY || false,
                        TUESDAY: response[0].TUESDAY || false,
                        WEDNESDAY: response[0].WEDNESDAY || false,
                        THURSDAY: response[0].THURSDAY || false,
                        FRIDAY: response[0].FRIDAY || false,
                        SATURDAY: response[0].SATURDAY || false,
                        SUNDAY: response[0].SUNDAY || false,
                        SCHEDULE_TIME: parsedDate
                    });
                } else {
                    // Handle case where response is empty
                    console.log('Response is empty or undefined');
                }
            } catch (error) {
                console.error('Error fetching job HR job schedule:', error);
            }
        };
        fetchSchedule();
    }, []);


    const createSchedule = async (e) => {
        e.preventDefault();

        try {
            let response;
            if (existingSchedule.length > 0) {

                response = await JobService.updateSchedule(existingSchedule[0].id, selectedDays);
                setSnackbarMessage('Successfully updated the job schedulefor HR data');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } else {

                response = await JobService.createSchedule(selectedDays);
                setSnackbarMessage('Successfully created the job schedule for HR data');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            }
            setSnackbarOpen(true);
            completeSecondStep()
        } catch (error) {
            setSnackbarMessage('There was a problem setting up the job schedule');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };


    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';
    const token = Cookies.get('token');

    const testSFTP = async (e) => {
        e.preventDefault();

        const csrftoken = await getCSRFToken();

        const sftpdata = {
            HOST_NAME: sftp.HOST_NAME,
            DIRECTORY: sftp.SFTP_DIRECTORY,
            DESTINATION: sftp.SFTP_DESTINATION,
            USERNAME: sftp.SFTP_USERNAME,
            PASSWORD: sftp.SFTP_PW_HASHED,
            SECRETKEY: sftp.AUTH_KEY
        };

        try {
            const response = await SFTPService.testHRsftp(sftpdata)
            setSnackbarMessage('Connection to the SFTP server completed successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            completLastStep()
        } catch (error) {
            setSnackbarMessage('Test failed. Double check if the credentials provided are accurate then try again');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const [selectedDays, setSelectedDays] = useState({
        MONDAY: false,
        TUESDAY: false,
        WEDNESDAY: false,
        THURSDAY: false,
        FRIDAY: false,
        SATURDAY: false,
        SUNDAY: false,
        SCHEDULE_TIME: new Date(), // Initialize as a Date object
    });

    const handleTimeChange = (time) => {
        const parsedDate = new Date(time);

        setSelectedDays(prevSelectedDays => ({
            ...prevSelectedDays,
            SCHEDULE_TIME: parsedDate
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
        setSelectedDays(updatedSelectedDays);
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

    const completeFirstStep = () => {
        const newCompleted = { ...completed };
        newCompleted[0] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const completeSecondStep = () => {
        const newCompleted = { ...completed };
        newCompleted[1] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const completLastStep = () => {
        const newCompleted = { ...completed };
        newCompleted[2] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const customMainContent = (

        <div>
            <ResponsiveContainer>
                <mui.Breadcrumbs aria-label="breadcrumb">
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        Dashboard
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        System Settings
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Interfaces">
                        Data Sources
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Interfaces/HR/Home">
                        HR Data
                    </mui.Link>
                    <mui.Typography color="text.primary">SFTP and Upload</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="HR Data Sources" icon={<ContactMailIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage and configure source data
                </mui.Typography>

                <Separator />

                <Box sx={{ width: '90vw', marginTop: '40px' }}>
                    <Stepper nonLinear activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label} completed={index in completed}>
                                <StepButton color="inherit" onClick={handleStep(index)}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                    <div>
                        {activeStep === 0 && (
                            <React.Fragment>
                                <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                                    <mui.Typography sx={{ marginTop: '20px', fontWeight: 'bold' }} variant="subtitle1" gutterBottom>
                                        SFTP Configuration:
                                    </mui.Typography>
                                    <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                                        Setup SFTP authentication and source directory by filling out the fields below:
                                    </mui.Typography>

                                    <Box sx={{ marginTop: '25px' }}>
                                        <NormalTextField

                                            label="Host Name"
                                            name="HOST_NAME"
                                            value={sftp.HOST_NAME}
                                            onChange={handleChange}
                                            required={true}
                                        />

                                        <NormalTextField
                                            label="File Directory"
                                            name="SFTP_DIRECTORY"
                                            value={sftp.SFTP_DIRECTORY}
                                            onChange={handleChange}
                                            required={true}
                                        />

                                        <NormalTextField
                                            label="Folder Destination"
                                            name="SFTP_DESTINATION"
                                            value={sftp.SFTP_DESTINATION}
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
                                            name="AUTH_KEY"
                                            type="password"
                                            value={sftp.AUTH_KEY}
                                            onChange={handleChange}
                                            required={true}
                                        />
                                        <mui.Button sx={{ marginTop: '20px' }} onClick={createSFTP} color="primary" variant="contained">
                                            Submit
                                        </mui.Button>
                                    </Box>


                                </Typography>
                            </React.Fragment>
                        )}

                        {activeStep === 1 && (
                            <React.Fragment>
                                <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                                    <mui.Typography sx={{ marginTop: '20px', fontWeight: 'bold' }} variant="subtitle1" gutterBottom>
                                        Job Schedule:
                                    </mui.Typography>
                                    <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle1" gutterBottom>
                                        Select days to set the frequency of the automated job
                                    </mui.Typography>
                                    <div style={{ width: '500px', marginTop: '18px' }}>
                                        <MultipleSelect
                                            isMultiSelect={true}
                                            placeholderText="Select Days*"
                                            selectOptions={daysOfWeek}
                                            selectedOptions={daysOfWeek.filter(day => selectedDays[day.value])}
                                            handleChange={handleDayChange}
                                        />

                                    </div>
                                    <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle1" gutterBottom>
                                        Select time to run the automated job
                                    </mui.Typography>

                                    <Timepicker selected={selectedDays.SCHEDULE_TIME} onChange={handleTimeChange} />

                                    <mui.Button sx={{ marginTop: '20px' }} onClick={createSchedule} color="primary" variant="contained">
                                        Submit
                                    </mui.Button>

                                    {/* Add content for Step 2 here */}
                                </Typography>
                            </React.Fragment>
                        )}

                        {activeStep === 2 && (
                            <React.Fragment>
                                <Typography sx={{ mt: 2, mb: 1 }}>
                                    <mui.Typography sx={{ marginTop: '20px', fontWeight: 'bold' }} variant="h6" gutterBottom>
                                        SFTP Configuration Review:
                                    </mui.Typography>
                                    <mui.Card>
                                        <mui.CardContent>
                                            <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                                                The following SFTP credentials will be used to fetch HR data from the SFTP server:
                                            </mui.Typography>

                                            <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                                                Host Name: {sftp.HOST_NAME}
                                            </mui.Typography>
                                            <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                                                Source Directory: {sftp.SFTP_DIRECTORY}
                                            </mui.Typography>
                                            <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                                                Folder Destination: {sftp.SFTP_DESTINATION}
                                            </mui.Typography>

                                            <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                                                Username: {sftp.SFTP_USERNAME}
                                            </mui.Typography>

                                        </mui.CardContent>

                                    </mui.Card>


                                    <LoadingButton sx={{ marginTop: '20px' }} onClick={testSFTP} color="primary" variant="contained">
                                        Complete Setup
                                    </LoadingButton>

                                    {/* Add content for Step 3 here */}
                                </Typography>
                            </React.Fragment>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext} sx={{ mr: 1 }}>
                                Next
                            </Button>

                        </Box>
                    </div>
                </Box>

                <Separator />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle1" gutterBottom>
                    Manual Upload (SFTP not available)
                </mui.Typography>

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Select the upload file to start importing HR record manually
                </mui.Typography>

                <mui.Box sx={{ marginTop: '20px' }}>
                    <InputFileUpload />
                </mui.Box>
                <FormHelperText sx={{ marginTop: '15px' }}>Files accepted are *.csv*, *.txt*, *.xls*, and *.xlsx* </FormHelperText>
                <Separator />

                <DynamicSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                    onClose={handleSnackbarClose}
                />

            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>

    );
};

export default InterfacesHR;
