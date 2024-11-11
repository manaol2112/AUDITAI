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
import ReviewsRoundedIcon from '@mui/icons-material/ReviewsRounded';
import CustomSpeedDial from '../../common/SpeedDial';
import DynamicDrawer from '../../common/Drawer';
import NormalTextField from '../../common/NormalTextField';
import MultipleSelect from '../../common/MultipleSelect';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import auditService from '../../../services/AuditService';
import DynamicSnackbar from '../../common/Snackbar';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import Chip from '@mui/material/Chip';
import MovingRoundedIcon from '@mui/icons-material/MovingRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import HttpsRoundedIcon from '@mui/icons-material/HttpsRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import PauseCircleFilledRoundedIcon from '@mui/icons-material/PauseCircleFilledRounded';
import { format } from 'date-fns';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const AuditProjects = () => {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [apps, setApps] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [projectsData, setProjectsData] = useState([]);
    const [companyID, setCompanyId] = useState([]);
    const [auditType, setAuditType] = useState([]);
    const [status, setStatus] = useState([]);
    const [newData, setNewData] = useState([]);
    const [projectExist, setProjectExist] = useState([]);
    const [errors, setErrors] = useState({
        COMPANY_ID: '',
        AUDIT_ID: '',
        AUDIT_NAME: '',
        AUDIT_DESCRIPTION: '',
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const companyRecord = await companyService.fetchCompanies()

                if (companyRecord) {

                    const company = companyRecord.map(item => ({
                        value: item.id,
                        label: item.COMPANY_NAME,
                    }));
                    setCompanies(company);

                }

            } catch (fetchError) {
                console.error('Error fetching company:', fetchError);
                setCompanyId([]);
            }
        }

        const fetchProjects = async () => {
            try {
                const projectRecord = await auditService.fetchProjects()

                if (projectRecord) {
                    setProjectsData(projectRecord);
                    setProjectExist(projectRecord);
                } else {
                    setProjectsData([]);
                    setProjectExist([]);
                }

            } catch (fetchError) {
                console.error('Error fetching company:', fetchError);
                setCompanyId([]);
            }
        }

        fetchProjects()
        fetchCompany()
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...newData,
            [name]: value
        };

        setNewData(updatedData);

    };

    const handleDateChange = (newValue) => {

        const formattedDate = newValue ? newValue.format('YYYY-MM-DD') : '';

        const updatedData = {
            ...newData,
            PERIOD_END_DATE: formattedDate
        };

        setNewData(updatedData);

    };

    const handleControlBlur = (e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...newData,
            [name]: value
        };

        setNewData(updatedData);

        const newErrors = { ...errors };

        if (name === 'AUDIT_ID') {
            if (projectExist.some(control => control.AUDIT_ID === value)) {
                newErrors.AUDIT_ID = 'Audit ID already exists';
            } else {
                newErrors.AUDIT_ID = '';
            }
        } else if (name === 'CONTROL_TITLE') {
            if (!value) {
                newErrors.AUDIT_NAME = 'This field is required';
            } else {
                newErrors.AUDIT_NAME = '';
            }
        } else if (name === 'CONTROL_DESCRIPTION') {
            if (!value) {
                newErrors.AUDIT_DESCRIPTION = 'This field is required';
            } else {
                newErrors.AUDIT_DESCRIPTION = '';
            }
        }
        setErrors(newErrors);
    };

    const toggleDrawer = (open) => () => {
        setOpen(open);
    };

    const handleCompanyIDChange = (selectedType) => {
        const companyID = selectedType.value
        setCompanyId(selectedType)

        const updatedData = {
            ...newData,
            COMPANY_ID: companyID
        };
        setNewData(updatedData);

    };

    const handleAuditTypeChange = (selectedType) => {
        const audittype = selectedType.value
        setAuditType(selectedType)

        const updatedData = {
            ...newData,
            AUDIT_TYPE: audittype
        };
        setNewData(updatedData);
    };

    const handleStatusChange = (selectedType) => {
        const status = selectedType.value
        setStatus(selectedType)

        const updatedData = {
            ...newData,
            STATUS: status
        };
        setNewData(updatedData);

    };

    const statusOptions = [
        { value: 'Not Started', label: 'Not Started' },
        { value: 'Active', label: 'Active' },
        { value: 'Archived', label: 'Archived' },
        { value: 'On-Hold', label: 'On-Hold' },
    ];

    const auditTypeOptions = [
        { value: 'SOX Audit', label: 'SOX Audit' },
        { value: 'Operational Audit', label: 'Operational Audit' },
        { value: 'Compliance Audit', label: 'Compliance Audit' },
        { value: 'Fraud Audit', label: 'Fraud Audit' },
        { value: 'Regulatory Audit', label: 'Regulatory Audit' },
        { value: 'ISO Audit', label: 'ISO Audit' },
        { value: 'Other Audit', label: 'Other Audit' },
    ];

    const validateForm = () => {

        let formIsValid = true;
        const newErrors = {};

        // Validate Audit ID
        if (!newData.AUDIT_ID) {
            formIsValid = false;
            newErrors.AUDIT_ID = 'This field is required';
        } else if (projectExist.some(control => control.AUDIT_ID === newData.AUDIT_ID)) {
            formIsValid = false;
            newErrors.AUDIT_ID = 'Controls ID already exists';
        }

        // Validate Control Title
        if (!newData.AUDIT_NAME) {
            formIsValid = false;
            newErrors.AUDIT_NAME = 'This field is required';
        }

        // Validate Description Title
        if (!newData.AUDIT_DESCRIPTION) {
            formIsValid = false;
            newErrors.AUDIT_DESCRIPTION = 'This field is required';
        }

        setErrors(newErrors);
        return formIsValid;

    };

    const createProject = async (e) => {
        e.preventDefault();

        // Validate the form
        const formIsValid = validateForm();

        if (formIsValid) {
            try {
                const newProject = await auditService.createProjects(newData);
                if (newProject) {
                    setSnackbarMessage('Successfully created record');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);

                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                }
            } catch (error) {
                console.error('Error creating project', error);
                setSnackbarMessage('There was a problem creating the project');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        }
    };

    const drawerContent = (
        <mui.Box sx={{ padding: '20px' }}>

            <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                <label style={{
                    display: 'block',
                    width: '105px',
                    marginLeft: '10px',
                    zIndex: '1000000',
                    marginBottom: '-10px',
                    fontSize: '12px',
                    position: 'relative',
                    backgroundColor: 'white',
                    padding: '0px 5px',
                    color: 'grey'
                }}>Company Name:</label>
                <div style={{
                    marginBottom: '18px',
                    position: 'relative',
                    zIndex: '99999'  // Lower z-index than the label
                }}>
                    <MultipleSelect
                        error={!!errors.COMPANY_ID}
                        isMultiSelect={false}
                        defaultValue={companyID ? companyID : ''}
                        placeholderText=""
                        selectOptions={companies}
                        selectedOptions={companyID ? companyID : ''}
                        handleChange={handleCompanyIDChange}
                        helperText={errors.COMPANY_ID || ' '}
                    />
                </div>
            </div>

            <NormalTextField
                error={!!errors.AUDIT_ID}
                label="Audit ID"
                name="AUDIT_ID"
                value={projectsData.AUDIT_ID}
                onChange={handleChange}
                onBlur={handleControlBlur}
                helperText={errors.AUDIT_ID || ' '}
            />

            <NormalTextField
                error={!!errors.AUDIT_NAME}
                label="Audit Name"
                name="AUDIT_NAME"
                value={projectsData.AUDIT_NAME}
                onChange={handleChange}
                onBlur={handleControlBlur}
                helperText={errors.AUDIT_NAME || ' '}
            />

            <NormalTextField
                isMultiLine={true}
                rows="5"
                error={!!errors.AUDIT_DESCRIPTION}
                label="Audit Description"
                name="AUDIT_DESCRIPTION"
                value={projectsData.AUDIT_DESCRIPTION}
                onChange={handleChange}
                onBlur={handleControlBlur}
                helperText={errors.AUDIT_DESCRIPTION || ' '}
            />

            <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                <label style={{
                    display: 'block',
                    width: '70px',
                    marginLeft: '10px',
                    zIndex: '1000000',
                    marginBottom: '-10px',
                    fontSize: '12px',
                    position: 'relative',
                    backgroundColor: 'white',
                    padding: '0px 5px',
                    color: 'grey'
                }}>Audit Type:</label>
                <div style={{
                    marginBottom: '18px',
                    position: 'relative',
                    zIndex: '99999'  // Lower z-index than the label
                }}>
                    <MultipleSelect
                        isMultiSelect={false}
                        defaultValue={auditType ? auditType : ''}
                        placeholderText=""
                        selectOptions={auditTypeOptions}
                        selectedOptions={auditType ? auditType : ''}
                        handleChange={handleAuditTypeChange}
                    />
                </div>
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker
                        zIndex="100"
                        label="Period End Date"
                        value={projectsData.PERIOD_END_DATE}
                        sx={{ width: '100%', fontSize: '12px' }}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                            <NormalTextField
                                {...params}
                                name="PERIOD_END_DATE"
                                sx={{
                                    width: '100%',
                                    '& input': { fontSize: '12px' },  // Ensure font size of input text
                                    fontSize: '12px' // Apply font size to the outer container
                                }}
                                onChange={handleChange}
                                onBlur={handleControlBlur}
                            />
                        )}
                    />
                </DemoContainer>
            </LocalizationProvider>

            <div style={{ marginTop: '20px', marginBottom: '18px', position: 'relative' }}>
                <label style={{
                    display: 'block',
                    width: '80px',
                    marginLeft: '10px',
                    zIndex: '1000000',
                    marginBottom: '-10px',
                    fontSize: '12px',
                    position: 'relative',
                    backgroundColor: 'white',
                    padding: '0px 5px',
                    color: 'grey',
                    zIndex: '101'  // Lower z-index than the label
                }}>Audit Status:</label>
                <div style={{
                    marginBottom: '18px',
                    position: 'relative',
                    zIndex: '100'  // Lower z-index than the label
                }}>
                    <MultipleSelect
                        isMultiSelect={false}
                        defaultValue={status ? status : ''}
                        placeholderText=""
                        selectOptions={statusOptions}
                        selectedOptions={status ? status : ''}
                        handleChange={handleStatusChange}
                    />
                </div>
            </div>

            <mui.Button variant="contained" onClick={createProject} size="small" sx={{
                position: 'absolute',
                right: 35,
            }}>
                Create Project
            </mui.Button>

        </mui.Box>

    );


    const projectSettings = (projectId) => {
        navigate(`/Audit/Projects/${projectId}`);
    }
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
                    <mui.Typography color="text.primary">Audit Projects</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Audit Projects" icon={<ReviewsRoundedIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Create and Manage Audit Projects
                </mui.Typography>
                <Separator />

                <mui.Box sx={{ backgroundColor: 'whitesmoke', minHeight: '80vh', padding: '20px' }}>
                    {projectsData.map((project) => (
                        <React.Fragment key={project.id}>
                            <mui.Paper sx={{ padding: '20px', marginTop: '15px' }}>
                                <mui.Grid
                                    container spacing={3}
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                >
                                      <mui.Grid item xs={2}>
                                        <mui.Typography variant="caption">
                                            Audit Name
                                        </mui.Typography>
                                        <mui.Typography variant="subtitle2" sx={{fontWeight: 'bold'}}>
                                            {project.AUDIT_NAME || 'N/A'}
                                        </mui.Typography>
                                    </mui.Grid>
                                  
                                    <mui.Grid item xs={2}>
                                        <mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <mui.Typography variant="caption">
                                                Type
                                            </mui.Typography>
                                        </mui.Box>
                                        <mui.Typography variant="subtitle2">
                                            {project.AUDIT_TYPE || 'N/A'}
                                        </mui.Typography>
                                    </mui.Grid>

                                    <mui.Grid item xs={2}>

                                        <mui.Typography variant="caption">
                                            Period End Date
                                        </mui.Typography>
                                        <mui.Typography variant="subtitle2">
                                            {project.PERIOD_END_DATE
                                                ? format(new Date(project.PERIOD_END_DATE), 'MMMM dd, yyyy')
                                                : 'N/A'}
                                        </mui.Typography>

                                    </mui.Grid>

                                    <mui.Grid item xs={3}>
                                        <mui.Typography variant="caption">
                                            Details
                                        </mui.Typography>
                                        <mui.Typography variant="subtitle2">
                                            {project.AUDIT_DESCRIPTION || 'N/A'}
                                        </mui.Typography>

                                    </mui.Grid>

                                    <mui.Grid item xs={1.5}>
                                        <mui.Typography variant="subtitle2">
                                            <Chip
                                                icon={
                                                    project.STATUS === 'Active'
                                                        ? <MovingRoundedIcon style={{color: 'green'}} />
                                                        : project.STATUS === 'Archived'
                                                        ? <ArchiveRoundedIcon style={{color: 'darkgrey'}} />
                                                        : project.STATUS === 'On-Hold'
                                                        ? <PauseCircleFilledRoundedIcon style={{color: 'red'}} />
                                                        : <HttpsRoundedIcon style={{color: 'orange'}}/>
                                                }
                                                label={project.STATUS || 'N/A'}
                                            />

                                        </mui.Typography>
                                    </mui.Grid>

                                    <mui.Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Tooltip title={`Manage ${project.AUDIT_NAME}`}>
                                            <mui.IconButton onClick={() => projectSettings(project.id)}>
                                                <OpenInNewIcon />
                                            </mui.IconButton>
                                        </Tooltip>
                                       
                                    </mui.Grid>

                                </mui.Grid>
                            </mui.Paper>
                        </React.Fragment>
                    ))}

                </mui.Box>

                <CustomSpeedDial onClick={toggleDrawer(true)} />

                <DynamicDrawer
                    open={open} onClose={toggleDrawer(false)}
                >
                    {drawerContent}
                </DynamicDrawer>

                <DynamicSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                    onClose={handleSnackbarClose}
                />

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
export default AuditProjects;