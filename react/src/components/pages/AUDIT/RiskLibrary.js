import React, { useState, useEffect, useRef, Suspense, useCallback  } from 'react';
import IASideBar from './IASideBar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import BugReportIcon from '@mui/icons-material/BugReport';
import AuditService from '../../../services/AuditService';
import DynamicDrawer from '../../common/Drawer';
import CustomSpeedDial from '../../common/SpeedDial';
import NormalTextField from '../../common/NormalTextField';
import MultipleSelect from '../../common/MultipleSelect';
import DynamicSnackbar from '../../common/Snackbar';
import DataTable from '../../common/DataGrid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const AuditRiskLibrary = () => {
  
    const [users, setUsers] = useState([]);
    const [apps, setApps] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [riskData, setRiskData] = useState([]);
    const [newData, setNewData] = useState([]);
    const [riskType, setRiskType] = useState([]);
    const [riskCategory, setRiskCategory] = useState([]);
    const saveTimeout = useRef(null);
    const [riskExist, setRiskExist] = useState([]);

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
        const fetchRisk = async () => {
            try {
                const riskList = await AuditService.fetchRisk();
             
                if (riskList) {
                    setRiskData(riskList);
                    setRiskExist(riskList);
                }
            } catch (fetchError) {
                console.error('Error fetching apps:', fetchError);
                setRiskData([]); 
                setRiskExist([]);
            }
        };
        fetchRisk();
    }, []); 

    useEffect(() => {
        const isExistingRisk = riskExist.some(risk => risk.RISK_ID === riskData.RISK_ID);
        if (isExistingRisk) {
            setError('Risk ID already exists');
        } else {
            setError('');
        }
    }, [riskData]); 

   
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'RISK_ID', headerName: 'Risk ID', flex: .2 },
        { field: 'RISK_NAME', headerName: 'Risk Name', flex: .2 },
        { field: 'RISK_TYPE', headerName: 'Risk Type', flex: .2 },
        { field: 'RISK_DESCRIPTION', headerName: 'Risk Description', flex: 1 },

    ];

    const rows = Array.isArray(riskData) ? riskData.map((risk, index) => ({
        id: index + 1,
        RISK_ID: risk.RISK_ID || '-',
        RISK_NAME: risk.RISK_NAME || '-',
        RISK_TYPE: risk.RISK_TYPE || '-',
        RISK_DESCRIPTION: risk.RISK_DESCRIPTION || '-',
        appID: risk.id,
    })) : [];
    
   
    const renderAuditPrepButton = (params) => {
        const app = params.row;
        const readyforaudit = app.geninfo && app.userdata && app.process;

        return (
    
                <Tooltip title="Edit Risk" arrow>
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
    
    const createRisk = async (e) => {
        e.preventDefault();

        if (error) {
            setError('Risk ID already exists');
        } else {
            try {
                const newrisk = await AuditService.createRisk(newData);
                if (newrisk) {
                    setSnackbarMessage('Successfully created risk');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);

                setTimeout(() => {
                    window.location.reload(); // Reload the page
                }, 500);
                    
                }
            } catch (error) {
                console.error('Error creating risk record:', error);
                setSnackbarMessage('There was a problem creating risk');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        }
    };

    const riskTypeOptions = [
        { value: 'Business Process', label: 'Business Process' },
        { value: 'IT', label: 'IT' },
        { value: 'Operational', label: 'Operational' },
        { value: 'Entity Level', label: 'Entity Level' },
    ];

    const riskCategoryOptions = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
    ];

    const handleRiskTypeChange = (selectedType) => {
        const risktype = selectedType.value
        setRiskType(selectedType)

        const updatedData = {
            ...newData,
            RISK_TYPE: risktype
        };

        setNewData(updatedData);

    };

    const handleRiskCategoryChange = (selectedType) => {
        const riskcategory = selectedType.value
        setRiskCategory(selectedType)

        const updatedData = {
            ...newData,
            REQUIRED: riskcategory
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

    const handleRiskBlur = (e) => {
        const { name, value } = e.target;

            const updatedData = {
                ...newData,
                [name]: value
            };
     
            setNewData(updatedData);

            const isExistingRisk = riskExist.some(risk => risk.RISK_ID === updatedData.RISK_ID);

            if (isExistingRisk) {
                setError('Risk ID already exists');
            } else { 
                setError('');
            }

    };

    const drawerContent = (
        <mui.Box sx={{ padding: '20px' }}>
            <NormalTextField
                error={error}
                label="Risk ID"
                name="RISK_ID"
                value={riskData.RISK_ID}
                onChange={handleChange}
                onBlur={handleRiskBlur}
                helperText="Risk ID already exist"
            />

            <NormalTextField
                label="Risk Name"
                name="RISK_NAME"
                value={riskData.RISK_NAME}
                onChange={handleChange}
                onBlur={handleRiskBlur}
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
                    color:'grey'
                }}>Risk Type:</label>
                <div style={{
                    marginBottom: '18px',
                    position: 'relative',
                    zIndex: '99999'  // Lower z-index than the label
                }}>
                    <MultipleSelect
                        isMultiSelect={false}
                        defaultValue={riskType ? riskType:''}
                        placeholderText=""
                        selectOptions={riskTypeOptions}
                        selectedOptions={riskType ? riskType: ''}
                        handleChange={handleRiskTypeChange}
                    />
                </div>
            </div>

            <NormalTextField
                label="Risk Description"
                name="RISK_DESCRIPTION"
                value={riskData.RISK_DESCRIPTION}
                onChange={handleChange}
                onBlur={handleRiskBlur}
                isMultiLine={true}
                rows="8"
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
                }}>Relevant Risk</label>
                <div style={{
                    marginBottom: '18px',
                    position: 'relative',
                    zIndex: '99999'  // Lower z-index than the label
                }}>
                    <MultipleSelect
                        isMultiSelect={false}
                        defaultValue={riskCategory ? riskCategory:''}
                        placeholderText=""
                        selectOptions={riskCategoryOptions}
                        selectedOptions={riskCategory ? riskCategory: ''}
                        handleChange={handleRiskCategoryChange}
                    />
                   
                </div>
                <mui.Typography variant='caption' color="textSecondary">
                    Selecting 'Yes' will make this risk relevant to all accounts/applications by default but you can still customize the risk mapping in the Risk Mapping section if adjustments are needed 
                </mui.Typography>
                
            </div>

            <mui.Button variant="contained" onClick={createRisk} size="small" sx={{
                position: 'absolute',
                right: 35,
            }}>
                Create Risk
            </mui.Button>

        </mui.Box>

    );

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
                    <mui.Typography color="text.primary"> Risk Library</mui.Typography>

                </mui.Breadcrumbs>

                <SearchAppBar title="Risk Library" icon={<BugReportIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage and document risk that are relevant to the organization
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
export default AuditRiskLibrary;