import React, { useState, useEffect, useRef, Suspense, useCallback  } from 'react';
import IASideBar from './IASideBar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import BugReportIcon from '@mui/icons-material/BugReport';
import auditService from '../../../services/AuditService';
import DynamicDrawer from '../../common/Drawer';
import CustomSpeedDial from '../../common/SpeedDial';
import NormalTextField from '../../common/NormalTextField';
import MultipleSelect from '../../common/MultipleSelect';
import DynamicSnackbar from '../../common/Snackbar';
import DataTable from '../../common/DataGrid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import GppGoodIcon from '@mui/icons-material/GppGood';


const ControlsLibrary = () => {


  
    const [users, setUsers] = useState([]);
    const [apps, setApps] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [controlsData, setControlsData] = useState([]);
    const [newData, setNewData] = useState([]);
    const [controlsType, setControlsType] = useState([]);
    const [controlsCategory, setControlsCategory] = useState([]);
    const [controlsDomain, setControlsDomain] = useState([]);
    const saveTimeout = useRef(null);
    const [controlsExist, setControlsExist] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    
    const handleClick = (event, app) => {
        setAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
        setSelectedApp(app); 
    };

    const toggleDrawer = (open) => () => {
        setOpen(open);
    };

    useEffect(() => {
        const fetchControls = async () => {
            try {
                const controlsList = await auditService.fetchControls();
             
                if (controlsList) {
                    setControlsData(controlsList);
                    setControlsExist(controlsList);
                }
            } catch (fetchError) {
                console.error('Error fetching apps:', fetchError);
                setControlsData([]); 
                setControlsExist([]);
            }
        };
        fetchControls();
    }, []); 

    useEffect(() => {
        const isExistingControls = controlsExist.some(controls => controls.CONTROL_ID === controlsData.CONTROL_ID);
        if (isExistingControls) {
            setError('Controls ID already exists');
        } else {
            setError('');
        }
    }, [controlsData]); 

 
   
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'CONTROL_ID', headerName: 'Control ID', flex: .2 },
        { field: 'CONTROL_TITLE', headerName: 'Control Name', flex: .2 },
        { field: 'CONTROL_TYPE', headerName: 'Control Type', flex: .2 },
        { field: 'CONTROL_DESCRIPTION', headerName: 'Control Description', flex: 1 },
        { field: 'CONTROL_DOMAIN', headerName: 'Control Domain', flex: .3 },
    ];

    const rows = Array.isArray(controlsData) ? controlsData.map((controls, index) => ({
        id: index + 1,
        CONTROL_ID: controls.CONTROL_ID || '-',
        CONTROL_TITLE: controls.CONTROL_TITLE || '-',
        CONTROL_TYPE: controls.CONTROL_TYPE || '-',
        CONTROL_DESCRIPTION: controls.CONTROL_DESCRIPTION || '-',
        CONTROL_DOMAIN: controls.CONTROL_DOMAIN || '-',
        appID: controls.id,
    })) : [];
    
   
    const renderAuditPrepButton = (params) => {
        const app = params.row;

        return (
    
                <Tooltip title="Edit Control" arrow>
                    <mui.IconButton
                        size="small"
                        onClick={(event) => handleClick(event, app)}
                    >
                    <OpenInNewIcon sx={{fontSize: '18px'}} />
                    </mui.IconButton>
                </Tooltip>
  
        );
    };

    const columnsWithActions = [
        ...columns,
        {
            field: 'actions',
            headerName: 'Modify',
            width: 200,
            sortable: false,
            renderCell: renderAuditPrepButton,
        },
    ];
    
    const createControls = async (e) => {
        e.preventDefault();
        
         // Validate the form
        const formIsValid = validateForm();
        
        if (formIsValid) {
            try {
                const newControls = await auditService.createControls(newData);
                if (newControls) {
                    setSnackbarMessage('Successfully created controls');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);

                    setTimeout(() => {
                        window.location.reload(); // Reload the page
                    }, 200);
                }
            } catch (error) {
                console.error('Error creating controls record:', error);
                setSnackbarMessage('There was a problem creating controls');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        }
    };

    const controlsCategoryOptions = [
        { value: 'Business Process', label: 'Business Process' },
        { value: 'IT', label: 'IT' },
        { value: 'Operational', label: 'Operational' },
        { value: 'Entity Level', label: 'Entity Level' },
    ];

    const controlsDomainOptions = [
        { value: 'Access Security', label: 'Access Security' },
        { value: 'Change Management', label: 'Change Management' },
        { value: 'IT Operations', label: 'IT Operations' },
        { value: 'Account Balances', label: 'Account Balances' },
    ];

    const controlsTypeOptions = [
        { value: 'Preventive', label: 'Preventive' },
        { value: 'Detective', label: 'Detective' },
        { value: 'Monitoring', label: 'Monitoring' },
    ];

    const handleControlsTypeChange = (selectedType) => {
        const controlstype = selectedType.value
        setControlsType(selectedType)

        const updatedData = {
            ...newData,
            CONTROL_TYPE: controlstype
        };

        setNewData(updatedData);

    };

    const handleControlsCategoryChange = (selectedType) => {
        const controlscategory = selectedType.value
        setControlsCategory(selectedType)

        const updatedData = {
            ...newData,
            CONTROL_CATEGORY: controlscategory
        };

        setNewData(updatedData);

    };


    const handleControlsDomainChange = (selectedType) => {
        const controlsdomain = selectedType.value
        setControlsDomain(selectedType)

        const updatedData = {
            ...newData,
            CONTROL_DOMAIN: controlsdomain
        };

        setNewData(updatedData);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }
            const updatedData = {
                ...newData,
                [name]: value
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

            if (name === 'CONTROL_ID') {
                if (controlsExist.some(control => control.CONTROL_ID === value)) {
                    newErrors.CONTROL_ID = 'Controls ID already exists';
                } else {
                    newErrors.CONTROL_ID = '';
                }
            } else if (name === 'CONTROL_TITLE') {
                if (!value) {
                    newErrors.CONTROL_TITLE = 'This field is required';
                } else {
                    newErrors.CONTROL_TITLE = '';
                }
            } else if (name === 'CONTROL_DESCRIPTION') {
                if (!value) {
                    newErrors.CONTROL_DESCRIPTION = 'This field is required';
                } else {
                    newErrors.CONTROL_DESCRIPTION = '';
                }
            }
            setErrors(newErrors);

    };

    const [errors, setErrors] = useState({
        CONTROL_ID: '',
        CONTROL_TITLE: '',
        CONTROL_DESCRIPTION:'',
    });

    const validateForm = () => {
        let formIsValid = true;
        const newErrors = {};
    
        // Validate Control ID
        if (!newData.CONTROL_ID) {
            formIsValid = false;
            newErrors.CONTROL_ID = 'This field is required';
        } else if (controlsExist.some(control => control.CONTROL_ID === newData.CONTROL_ID)) {
            formIsValid = false;
            newErrors.CONTROL_ID = 'Controls ID already exists';
        }
    
        // Validate Control Title
        if (!newData.CONTROL_TITLE) {
            formIsValid = false;
            newErrors.CONTROL_TITLE = 'This field is required';
        }

         // Validate Description Title
         if (!newData.CONTROL_DESCRIPTION) {
            formIsValid = false;
            newErrors.CONTROL_DESCRIPTION = 'This field is required';
        }
    
        setErrors(newErrors);
        return formIsValid;
    };

    const drawerContent = (
        <mui.Box sx={{ padding: '20px' }}>
            <NormalTextField
                error={!!errors.CONTROL_ID}
                label="Control ID"
                name="CONTROL_ID"
                value={controlsData.CONTROL_ID}
                onChange={handleChange}
                onBlur={handleControlBlur}
                helperText={errors.CONTROL_ID || ' '}
            />

            <NormalTextField
                 error={!!errors.CONTROL_TITLE}
                label="Control Name"
                name="CONTROL_TITLE"
                value={controlsData.CONTROL_TITLE}
                onChange={handleChange}
                onBlur={handleControlBlur}
                helperText={errors.CONTROL_TITLE || ' '}
            />

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
                    color:'grey'
                }}>Control Category:</label>
                <div style={{
                    marginBottom: '18px',
                    position: 'relative',
                    zIndex: '99999'  // Lower z-index than the label
                }}>
                    <MultipleSelect
                        isMultiSelect={false}
                        defaultValue={controlsCategory ? controlsCategory:''}
                        placeholderText=""
                        selectOptions={controlsCategoryOptions}
                        selectedOptions={controlsCategory ? controlsCategory: ''}
                        handleChange={handleControlsCategoryChange}
                    />
                </div>
            </div>

            <NormalTextField
                error={!!errors.CONTROL_DESCRIPTION}
                label="Controls Description"
                name="CONTROL_DESCRIPTION"
                value={controlsData.CONTROL_DESCRIPTION}
                onChange={handleChange}
                onBlur={handleControlBlur}
                isMultiLine={true}
                rows="10"
                helperText={errors.CONTROL_DESCRIPTION || ' '}
            />

            <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                <label style={{
                    display: 'block',
                    width: '100px',
                    marginLeft: '10px',
                    zIndex: '1000000',
                    marginBottom: '-10px',
                    fontSize: '12px',
                    position: 'relative',
                    backgroundColor: 'white',
                    padding: '0px 5px',
                    color:'grey'
                }}>Control Domain</label>
                <div style={{
                    marginBottom: '18px',
                    position: 'relative',
                    zIndex: '99999'  // Lower z-index than the label
                }}>
                    <MultipleSelect
                        zIndex="99999"
                        isMultiSelect={false}
                        defaultValue={controlsDomain ? controlsDomain:''}
                        placeholderText=""
                        selectOptions={controlsDomainOptions}
                        selectedOptions={controlsDomain ? controlsDomain: ''}
                        handleChange={handleControlsDomainChange}
                    />
                   
                </div>
          
            </div>

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
                    color:'grey',
                    zIndex: '99998'
                }}>Control Type</label>
                <div style={{
                    marginBottom: '18px',
                    position: 'relative',
                    zIndex: '9999'  // Lower z-index than the label
                }}>
                    <MultipleSelect
                        isMultiSelect={false}
                        defaultValue={controlsType ? controlsType:''}
                        placeholderText=""
                        selectOptions={controlsTypeOptions}
                        selectedOptions={controlsType ? controlsType: ''}
                        handleChange={handleControlsTypeChange}
                    />
                   
                </div>
          
            </div>

            <mui.Button variant="contained" onClick={createControls} size="small" sx={{
                position: 'absolute',
                right: 35,
            }}>
                Create Control
            </mui.Button>

        </mui.Box>

    );

    const customMainContent = (

        <div>
            <ResponsiveContainer>
                <mui.Breadcrumbs aria-label="breadcrumb">
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        My Dashboard
                    </mui.Link>
                    <mui.Typography color="text.primary"> Controls Library</mui.Typography>

                </mui.Breadcrumbs>

                <SearchAppBar title="Controls Library" icon={<GppGoodIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage and document controls that are relevant to the organization
                </mui.Typography>
                <Separator />

                <DynamicDrawer
                    open={open} onClose={toggleDrawer(false)}
                >
                    {drawerContent}
                </DynamicDrawer>

                <CustomSpeedDial onClick={toggleDrawer(true)} />

                <DynamicSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                    onClose={handleSnackbarClose}
                />

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

    return (
        <Suspense fallback="Loading...">
            <div>
                <IASideBar mainContent={customMainContent} />
            </div>
        </Suspense>
    );



}
export default ControlsLibrary;