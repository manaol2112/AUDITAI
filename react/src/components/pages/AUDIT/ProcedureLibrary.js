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
import StairsIcon from '@mui/icons-material/Stairs';
import Modal from '../../common/Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PagesIcon from '@mui/icons-material/Pages';


const ProcedureLibrary = () => {

    const [users, setUsers] = useState([]);
    const [apps, setApps] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [controlsData, setControlsData] = useState([]);
    const [proceduresData, setProceduresData] = useState([]);
    const [newData, setNewData] = useState({});
    const [controlsType, setControlsType] = useState([]);
    const [controlID, setControlID] = useState([]);
    const [procedureCategory, setProcedureCategory] = useState([]);
    const [controlsDomain, setControlsDomain] = useState([]);
    const [controlsList, setControlsList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [procedureDomain, setProceduresDomain] = useState([]);
    const [procedurePhase, setProceduresPhase] = useState([]);
    const [controlName, setControlName] = useState([]);
    const [selectedControl, setSelectedControl] = useState([]);
    const saveTimeout = useRef(null);
    const [controlsExist, setControlsExist] = useState([]);
    const [proceduresExist, setProceduresExist] = useState([]);

    const [designProcedure, setDesignProcedure] = useState('');
    const [interimProcedure, setInterimProcedure] = useState('');
    const [rollforwardProcedure, setRollForwardProcedure] = useState('');
    const [finalProcedure, setFinalProcedure] = useState('');

    const [expanded, setExpanded] = useState(true);

    const [anchorEl, setAnchorEl] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [existingProcedure, setExistingProcedure] = useState(false);

    const [openModal, setOpenModal] = useState(false);

    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    const handleSwitchChange = (event) => {
        // Prevent the event from propagating to the AccordionSummary
        event.stopPropagation();
        // Handle the switch change logic here
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenModal(true)
        }
        else {
            setOpenModal(false);
        }
    };
    
    const handleClick = (event, app) => {
        setAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
        setSelectedApp(app); 
    };

    const toggleDrawer = (open) => () => {
        setOpen(open);
    };

    useEffect(() => {
        const fetchProcedures = async () => {
            try {
                const procedureList = await auditService.fetchProcedures();
             
                if (procedureList) {
                    setProceduresData(procedureList);
                    setProceduresExist(procedureList);
                }
            } catch (fetchError) {
                console.error('Error fetching apps:', fetchError);
                setProceduresData([]); 
                setProceduresExist([]);
            }
        };
        fetchProcedures();

        const fetchControls = async () => {

            let controls;
            try {
                controls = await auditService.fetchControls();
            } catch (fetchError) {
                console.error('Error fetching apps:', fetchError);
                setControlsList([]); 
            }

            if (controls) {

                const controlsformat = controls.map(item => ({
                    value: item.id,
                    label: item.CONTROL_TITLE,
                }));
                setControlName(controlsformat);

            }
        }

        fetchControls();
    }, []); 

    useEffect(() => {
        const isExistingControls = proceduresExist.some(procedures => procedures.PROCEDURE_NAME === proceduresData.PROCEDURE_NAME);
        if (isExistingControls) {
            setError('Procedure already exists');
        } else {
            setError('');
        }
    }, [proceduresData]); 


    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'CONTROL_TITLE', headerName: 'Control Name', flex: .5 },
        {
            field: 'DESIGN_PROCEDURES',
            headerName: 'Design Procedures',
            flex: 1,
            renderCell: (params) => (
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(params.value || '') }}
              />
            ),
          },

          {
            field: 'INTERIM_PROCEDURES',
            headerName: 'Interim Procedures',
            flex: 1,
            renderCell: (params) => (
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(params.value || '') }}
              />
            ),
          },

          {
            field: 'ROLLFORWARD_PROCEDURES',
            headerName: 'Rollforward Procedures',
            flex: 1,
            renderCell: (params) => (
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(params.value || '') }}
              />
            ),
          },

          {
            field: 'FINAL_PROCEDURES',
            headerName: 'Final Procedures',
            flex: 1,
            renderCell: (params) => (
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(params.value || '') }}
              />
            ),
          },
    ];

    const rows = Array.isArray(proceduresData) ? proceduresData.map((controls, index) => ({
        id: index + 1,
        CONTROL_TITLE: controls.CONTROL_TITLE || '-',
        DESIGN_PROCEDURES: controls.DESIGN_PROCEDURES || '-',
        INTERIM_PROCEDURES: controls.INTERIM_PROCEDURES || '-',
        ROLLFORWARD_PROCEDURES: controls.ROLLFORWARD_PROCEDURES || '-',
        FINAL_PROCEDURES: controls.FINAL_PROCEDURES || '-',
        appID: controls.id,
    })) : [];
    
    const renderAuditPrepButton = (params) => {
        const app = params.row;

        return (
    
                <Tooltip title="Edit Procedure" arrow>
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
            headerName: 'Manage',
            width: 200,
            sortable: false,
            renderCell: renderAuditPrepButton,
        },
    ];
    
    const createControls = async (e) => {
        e.preventDefault();

        const savedControlID = localStorage.getItem('controlID');
        if (savedControlID) {
            try {
                const existingProcedure = await auditService.fetchProceduresById(savedControlID);
        
                // If the record exists, update it
                const updatedData = { ...newData, CONTROL_ID: savedControlID };
                const updatedControls = await auditService.updateProcedures(savedControlID, updatedData);
                
                if (updatedControls) {
                    setNewData(updatedControls)
                    setSnackbarMessage('Successfully updated controls');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
        
                    setTimeout(() => {
                        window.location.reload(); // Reload the page
                    }, 200);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // Handle 404 error (record does not exist)
                    try {
                        const newControls = await auditService.createProcedures({ ...newData, CONTROL_ID: savedControlID });
                        
                        if (newControls) {
                            setNewData(newControls)
                            setSnackbarMessage('Successfully created controls');
                            setSnackbarSeverity('success');
                            setSnackbarOpen(true);
        
                            setTimeout(() => {
                                window.location.reload(); // Reload the page
                            }, 200);
                        }
                    } catch (createError) {
                        console.error('Error creating procedure:', createError);
                        setSnackbarMessage('Failed to create controls');
                        setSnackbarSeverity('error');
                        setSnackbarOpen(true);
                    }
                } else {
                    // Handle other errors
                    console.error('Error fetching procedure:', error);
                    setSnackbarMessage('An error occurred while fetching controls');
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                }
            }
        }
        
    };

    const procedurePhaseOptions = [
        { value: 'Design', label: 'Design' },
        { value: 'Interim', label: 'Interim' },
        { value: 'Rollforward', label: 'Rollforward' },
        { value: 'Final', label: 'Final' },
    ];

    useEffect(() => {
        console.log(newData);
    }, [newData]);

    const handleControlChange = (selectedType) => {

        const selectedControl = selectedType.value
        
        setSelectedControl(selectedType)

        setControlID(selectedControl)

        localStorage.setItem('controlID', selectedControl); 

        const selectedProcedure = proceduresData.filter(
            proc => proc.CONTROL_ID === selectedType.value || proc.CONTROL_ID === selectedControl
        );
        
        if (selectedProcedure.length > 0) {
            setExistingProcedure(true);
            const design_procedure = selectedProcedure[0]?.DESIGN_PROCEDURES
            setDesignProcedure(design_procedure);

            const interim_procedure = selectedProcedure[0]?.INTERIM_PROCEDURES
            setInterimProcedure(interim_procedure);

            const rollforward_procedure = selectedProcedure[0]?.ROLLFORWARD_PROCEDURES
            setRollForwardProcedure(rollforward_procedure);

            const final_procedure = selectedProcedure[0]?.FINAL_PROCEDURES
            setFinalProcedure(final_procedure);

            const updatedData = {
                ...newData,
                DESIGN_PROCEDURES: design_procedure,
                INTERIM_PROCEDURES: interim_procedure,
                ROLLFORWARD_PROCEDURES: rollforward_procedure,
                FINAL_PROCEDURES: final_procedure
            };

            setNewData(updatedData)
            console.log(updatedData)

        } else {
            setExistingProcedure(false);
            setDesignProcedure('');
            setInterimProcedure('');
            setRollForwardProcedure('');
            setFinalProcedure('');
        }
    };

    const handleDesignChange = (content) => {

        const sanitizedContent = DOMPurify.sanitize(content);

        if (sanitizedContent) {
            setDesignProcedure(sanitizedContent)

            const updatedData = {
                ...newData,
                DESIGN_PROCEDURES: sanitizedContent
            };

            setNewData(updatedData);

        } else {
            setDesignProcedure('')
        }

    };

    const handleInterimChange = (content) => {

        const sanitizedContent = DOMPurify.sanitize(content);
    
        if (sanitizedContent) {
            setInterimProcedure(sanitizedContent)

            const updatedData = {
                ...newData,
                INTERIM_PROCEDURES: sanitizedContent
            };

            setNewData(updatedData);

        } else {
            setInterimProcedure('')
        }
    };

    const handleRollForwardChange = (content) => {

        const sanitizedContent = DOMPurify.sanitize(content);

        if (sanitizedContent) {
         
        setRollForwardProcedure(sanitizedContent)

        const updatedData = {
            ...newData,
            ROLLFORWARD_PROCEDURES: sanitizedContent
        };

        setNewData(updatedData);

        } else {
            setRollForwardProcedure('')
        }
    };

    const handleFinalChange = (content) => {
        const sanitizedContent = DOMPurify.sanitize(content);

        if (sanitizedContent) {
         
            setFinalProcedure(sanitizedContent)

            const updatedData = {
                ...newData,
                FINAL_PROCEDURES: sanitizedContent
            };
            
            setNewData(updatedData);

            } else {
                setFinalProcedure('')
            }
         
    };

    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          [{ 'font': [] }], // Font family options
          [{ 'size': ['small', 'medium', 'large', 'huge'] }], // Font size options
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['clean']
        ],
      }

    const formats = [
        'header',
        'font', // Font family
        'size', // Font size
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
       
      ]

    const [errors, setErrors] = useState({
        CONTROL_ID: '',
        CONTROL_TITLE: '',
        CONTROL_DESCRIPTION:'',
    });


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
                    <mui.Typography color="text.primary"> Procedures Library</mui.Typography>

                </mui.Breadcrumbs>

                <SearchAppBar title="Procedures Library" icon={<StairsIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage and document procedures that are used in control testing
                </mui.Typography>

                <Separator />

                <CustomSpeedDial onClick={setOpenModal} />

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

                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    header="Create Test Procedures"
                    size="lg"
                    body={
                        <>
                            <mui.Box sx={{ padding: '20px' }}>

                            <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                    <label style={{
                                        display: 'block',
                                        width: '90px',
                                        marginLeft: '10px',
                                        zIndex: '99999',
                                        marginBottom: '-10px',
                                        fontSize: '12px',
                                        position: 'relative',
                                        backgroundColor: 'white',
                                        padding: '0px 5px',
                                        color: 'grey'
                                    }}>Control Name</label>
                                    <div style={{
                                        marginBottom: '18px',
                                        position: 'relative',
                                        zIndex: '99998'  // Lower z-index than the label
                                    }}>
                                        <MultipleSelect
                                            zIndex="99997"
                                            isMultiSelect={false}
                                            defaultValue={selectedControl ? selectedControl : ''}
                                            placeholderText="Select Control"
                                            selectOptions={controlName ? controlName : ''}
                                            selectedOptions={selectedControl ? selectedControl : ''}
                                            handleChange={handleControlChange}
                                        />

                                    </div>

                                </div>
                

                                <Accordion >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <mui.Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                            <mui.Box sx={{ flexGrow: 1 }}>
                                                <mui.Stack direction="row" spacing={1} alignItems="center">
                                                    <mui.Typography variant="subtitle1">
                                                        <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Design Procedures
                                                    </mui.Typography>
                                                </mui.Stack>
                                            </mui.Box>

                                        </mui.Stack>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{height: '350px'}}>
                                        <ReactQuill
                                            theme="snow"
                                            value={designProcedure}
                                            onChange={handleDesignChange}
                                            modules={modules}
                                            formats={formats}
                                            style={{ marginTop: '20px', height: '200px' }}
                                        />

                                    </AccordionDetails>

                                </Accordion>

                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <mui.Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                            <mui.Box sx={{ flexGrow: 1 }}>
                                                <mui.Stack direction="row" spacing={1} alignItems="center">
                                                    <mui.Typography variant="subtitle1">
                                                        <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Interim Procedures

                                                    </mui.Typography>
                                                </mui.Stack>
                                            </mui.Box>

                                        </mui.Stack>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{height: '350px'}}>
                                        

                                        <ReactQuill
                                            theme="snow"
                                            value={interimProcedure}
                                            onChange={handleInterimChange}
                                            modules={modules}
                                            formats={formats}
                                            style={{ marginTop: '20px', height: '250px' }}
                                        />

                                    </AccordionDetails>

                                </Accordion>

                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <mui.Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                            <mui.Box sx={{ flexGrow: 1 }}>
                                                <mui.Stack direction="row" spacing={1} alignItems="center">
                                                    <mui.Typography variant="subtitle1">
                                                        <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Rollforward Procedures

                                                    </mui.Typography>
                                                </mui.Stack>
                                            </mui.Box>

                                        </mui.Stack>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{height: '350px'}}>
                                       

                                        <ReactQuill
                                            theme="snow"
                                            value={rollforwardProcedure}
                                            onChange={handleRollForwardChange}
                                            modules={modules}
                                            formats={formats}
                                            style={{ marginTop: '20px', height: '250px' }}
                                        />

                                    </AccordionDetails>

                                </Accordion>

                                <Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1-content"
                                        id="panel1-header"
                                    >
                                        <mui.Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                            <mui.Box sx={{ flexGrow: 1 }}>
                                                <mui.Stack direction="row" spacing={1} alignItems="center">
                                                    <mui.Typography variant="subtitle1">
                                                        <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Final Procedures

                                                    </mui.Typography>
                                                </mui.Stack>
                                            </mui.Box>

                                        </mui.Stack>
                                    </AccordionSummary>

                                    <AccordionDetails sx={{height: '350px'}}>
                                     

                                        <ReactQuill
                                            theme="snow"
                                            value={finalProcedure}
                                            onChange={handleFinalChange}
                                            modules={modules}
                                            formats={formats}
                                            style={{ marginTop: '20px', height: '250px' }}
                                        />

                                    </AccordionDetails>

                                </Accordion>

                              
                            </mui.Box>
                        </>
                    }
                    footer={
                        <>
                            <mui.Button variant="contained" size="small" onClick={handleCloseModal} color="primary" sx={{
                                   
                                    marginBottom: '10px',
                                    marginTop: '10px',
                                }}>
                                Cancel
                            </mui.Button>

                            <mui.Button variant="contained" onClick={createControls} size="small" sx={{
                                    marginRight: '20px',
                                    marginBottom: '10px',
                                    marginTop: '10px',

                                }}>
                                    Save Procedure
                                </mui.Button>
                        </>
                    }
                />

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
export default ProcedureLibrary;