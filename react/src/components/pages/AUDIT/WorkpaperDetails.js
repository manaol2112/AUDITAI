import React, { useState, useEffect, Suspense } from 'react';
import IASideBar from './IASideBar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import OutlinedCard from '../../common/MediaCard';
import Separator from '../../layout/Separator';
import ReviewsRoundedIcon from '@mui/icons-material/ReviewsRounded';
import auditService from '../../../services/AuditService';
import { useParams } from 'react-router-dom';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import appService from '../../../services/ApplicationService';
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded';
import AnnouncementRoundedIcon from '@mui/icons-material/AnnouncementRounded';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import DynamicTabs from '../../common/DynamicTabs';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SavingsIcon from '@mui/icons-material/Savings';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DataTable from '../../common/DataGrid';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import MarkChatUnreadOutlinedIcon from '@mui/icons-material/MarkChatUnreadOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import SpeakerNotesOutlinedIcon from '@mui/icons-material/SpeakerNotesOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import NormalTextField from '../../common/NormalTextField';
import { styled } from '@mui/system';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListIcon from '@mui/icons-material/List';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PagesIcon from '@mui/icons-material/Pages';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Modal from '../../common/Modal';
import MultipleSelect from '../../common/MultipleSelect';

const WorkpapersDetails = () => {
    const [selectedProject, setSelectedProject] = useState([])
    const [selectedApp, setSelectedApp] = useState([])
    const { id, controlref } = useParams();

    const [workpapers, setWorkpapers] = useState([]);
    const [testingInfo, setTestingInfo] = useState([]);

    const [companyID, setCompanyID] = useState([]);
    const [appID, setAppID] = useState([]);
    const [apps, setApps] = useState([]);

    const [procedureOptions, setProcedureOptions] = useState([]);
    const [selectedPhase, setSelectedPhase] = useState([]);
    const [selectedProcedureName, setSelectedProcedureName] = useState([]);
    const [selectedProcedures, setSelectedProcedures] = useState([]);
    const [proceduresData, setProceduresData] = useState([]);
    const [expanded, setExpanded] = useState(true);


    const [open, setOpen] = React.useState(true);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    useEffect(() => {

        const fetchProjectbyID = async () => {
            try {

                const projectRecord = await auditService.fetchProjectsById(id)
                if (projectRecord) {

                    setSelectedProject(projectRecord);
                    setCompanyID(projectRecord.COMPANY_ID)


                } else {
                    setSelectedProject([]);
                }

                const appRecord = await appService.fetchAppsByCompany(projectRecord.COMPANY_ID)

                if (appRecord) {
                    setApps(appRecord);
                    setSelectedApp(appRecord[0])
                    setAppID(appRecord[0].id)


                } else {
                    setApps([]);
                }

                if (controlref) (
                    await fetchTesting(controlref)
                )

            } catch (fetchError) {
                console.error('Error fetching company:', fetchError);
                setSelectedProject([])
            }
        }

        fetchProjectbyID()
        fetchProcedures()

    }, []);


    const fetchTesting = async (controlref) => {

        let testing;
        
        try {
            testing = await auditService.fetchWorkpapersById(controlref);
            // Handle the data here, e.g., set state
        } catch (error) {
            // Handle errors here
            console.error('Failed to fetch data:', error);
        }

        if (testing) {

            setTestingInfo(testing)
            try {
                const selectedControl = await auditService.fetchProceduresById(testing.CONTROL_ID)
                if (selectedControl) {
                    setDesignProcedure(selectedControl.DESIGN_PROCEDURES)
                    setInterimProcedure(selectedControl.INTERIM_PROCEDURES)
                }
            } catch (error) {
                // Handle errors here
                console.error('Failed to fetch data:', error);
            }

        } else {
            setTestingInfo([])
        }

    };

    const fetchProcedures = async () => {
        try {
            const procedureList = await auditService.fetchProcedures();

            if (procedureList) {
                setProceduresData(procedureList);


                const procedureName = procedureList.map(item => ({
                    value: item.CONTROL_TITLE,
                    label: item.CONTROL_TITLE
                }));

                setProcedureOptions(procedureName);

            }
        } catch (fetchError) {
            console.error('Error fetching apps:', fetchError);
            setProceduresData([]);

        }
    };

    const fetchTestProcedure = async (phase, procedureName) => {

        let procedure;
        try {
            procedure = await auditService.fetchWorkpapersById(phase);
            // Handle the data here, e.g., set state
        } catch (error) {
            // Handle errors here
            console.error('Failed to fetch data:', error);
        }

        if (procedure) {
            setSelectedProcedures(procedure)

        } else {
            setSelectedProcedures([])
        }

    };


    const [openModal, setOpenModal] = useState(false);

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


    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        {
            field: 'TITLE', headerName: 'Name', flex: 1,
            renderCell: (params) => (
                <span
                    style={{
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                // onClick={() => handleTitleClick(params.row)}
                >
                    {params.value}
                </span>
            )
        },
        { field: 'CURRENTLY_WITH', headerName: 'Currently With', flex: 1 },
        { field: 'STATUS', headerName: 'Status', flex: 1 },
        { field: 'TYPE', headerName: 'Type', flex: 1 },

    ];

    const rows = Array.isArray(workpapers) ? workpapers.map((wp, index) => ({
        id: index + 1,
        TITLE: wp.TITLE || '-',
        CURRENTLY_WITH: wp.CURRENTLY_WITH || '-',
        STATUS: wp.STATUS || '-',
        TYPE: wp.TYPE || '-',
        ctrlID: wp.id,
    })) : [];

    const HeaderContainer = styled(mui.Box)(({ theme }) => ({
        backgroundColor: theme.palette.grey, // Light grey background
        padding: '10px 20px', // Adjust padding as needed
        borderRadius: '\px 4px 0 0', // Rounded corners at the top
    }));

    const label = { inputProps: { 'aria-label': 'Switch demo' } };

    const handleSwitchChange = (event) => {
        // Prevent the event from propagating to the AccordionSummary
        event.stopPropagation();
        // Handle the switch change logic here
    };
    const [designProcedure, setDesignProcedure] = useState('');
    const [interimProcedure, setInterimProcedure] = useState('');
    const [interimResult, setInterimResult] = useState('');
    const [interimConclusion, setInterimConclusion] = useState('');

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            [{ 'font': [] }], // Font family options
            [{ 'size': ['small', 'medium', 'large', 'huge'] }], // Font size options
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ],
    }

    const formats = [
        'header',
        'font', // Font family
        'size', // Font size
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'color', 'background' // Add color and background formats
    ]

    const phaseOptions = [
        { value: 'Design', label: 'Design' },
        { value: 'Operating Effectiveness', label: 'Operating Effectiveness' },

    ];

    const handlePhaseChange = (selectedType) => {
        const phase = {
            label: selectedType.value,
            value: selectedType.value
        }
        setSelectedPhase(phase)

        setSelectedProcedureName([])
        setSelectedProcedures([])

    };

    const handleProcedureNameChange = (selectedType) => {

        const procedureName = {
            label: selectedType.value,
            value: selectedType.value
        }

        // Ensure selectedPhase has a valid value
        if (!selectedPhase || !selectedPhase.value) {
            console.error('Selected phase is not defined');
            return;
        }

        // Filter procedures data based on phase and procedure name
        const selectedProcedure = proceduresData.filter(
            proc => proc.CONTROL_TITLE === selectedType.value && proc.CONTROL_TITLE === selectedPhase.value
        );

        setSelectedProcedureName(procedureName);

        // Check if any procedures match the criteria before setting them
        if (selectedProcedure.length > 0) {
            setSelectedProcedures(selectedProcedure[0].PROCEDURE_DETAILS || []);
        } else {
            setSelectedProcedures([]);
        }

    };

    const tabs = [

        {
            value: '1',
            label: (<div>
                Overview
            </div>),
            content: (
                <div>

                    <mui.Paper sx={{ padding: '20px' }}>
                        <HeaderContainer>
                            <mui.Typography variant="h6" component="div">
                                Control Information
                            </mui.Typography>
                        </HeaderContainer>
                        <Divider></Divider>
                        <NormalTextField
                            name="CONTROL_ID"
                            label="Control ID"
                            value={testingInfo?.CONTROL_DETAILS?.CONTROL_ID ? testingInfo.CONTROL_DETAILS.CONTROL_ID : ''}
                        />
                        <NormalTextField
                            name="CONTROL_TITLE"
                            label="Control Title"
                            value={testingInfo?.CONTROL_DETAILS?.CONTROL_TITLE ? testingInfo.CONTROL_DETAILS.CONTROL_TITLE : ''}
                        />
                        <NormalTextField
                            name="CONTROL_DESCRIPTION"
                            label="Control Description"
                            isMultiLine={true}
                            rows="5"
                            value={testingInfo?.CONTROL_DETAILS?.CONTROL_DESCRIPTION ? testingInfo.CONTROL_DETAILS.CONTROL_DESCRIPTION : ''}
                        />
                        <NormalTextField
                            name="CONTROL_TYPE"
                            label="Control Type"
                            value={testingInfo?.CONTROL_DETAILS?.CONTROL_TYPE ? testingInfo.CONTROL_DETAILS.CONTROL_TYPE : ''}
                        />

                        <NormalTextField
                            name="CONTROL_DOMAIN"
                            label="Control Domain"
                            value={testingInfo?.CONTROL_DETAILS?.CONTROL_DOMAIN ? testingInfo.CONTROL_DETAILS.CONTROL_DOMAIN : ''}
                        />

                        <NormalTextField
                            name="CONTROL_CATEGORY"
                            label="Control Category"
                            value={testingInfo?.CONTROL_DETAILS?.CONTROL_CATEGORY ? testingInfo.CONTROL_DETAILS.CONTROL_CATEGORY : ''}
                        />

                    </mui.Paper>

                </div>),
        },
        {
            value: '2',
            label: (<div>
                Design and Implementation
            </div>),
            content: (

                <div>
                    <mui.Paper sx={{ padding: '20px', height: '450px' }}>

                        <mui.Stack direction="row" spacing={1} sx={{ width: '100%' }}>

                            <mui.Box sx={{ flexGrow: 1 }}>
                                <mui.Stack direction="row" spacing={1} alignItems="center">
                                    <mui.Typography variant="subtitle1">
                                        Design Procedures
                                    </mui.Typography>
                                </mui.Stack>
                            </mui.Box>

                            <Tooltip title="Procedure Library">
                                <mui.IconButton onClick={handleOpenModal}>
                                    <LibraryBooksIcon />
                                </mui.IconButton>
                            </Tooltip>

                            <Tooltip title="Analyze Procedure">
                                <mui.IconButton>
                                    <TipsAndUpdatesIcon />
                                </mui.IconButton>
                            </Tooltip>


                        </mui.Stack>

                        <ReactQuill
                            theme="snow"
                            value={designProcedure}
                            onChange={setDesignProcedure}
                            modules={modules}
                            formats={formats}
                            style={{ marginTop: '20px', height: '300px' }}
                        />
                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', height: '450px', marginTop: '20px' }}>
                        <mui.Typography variant="subtitle1">
                            Design Result
                        </mui.Typography>

                        <ReactQuill
                            theme="snow"
                            value={interimResult}
                            onChange={setInterimResult}
                            modules={modules}
                            formats={formats}
                            style={{ marginTop: '20px', height: '300px' }}
                        />
                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="subtitle1">
                            Design and Implementation Evidence
                        </mui.Typography>
                    </mui.Paper>
                    <mui.Paper sx={{ padding: '20px', height: '450px', marginTop: '20px' }}>
                        <mui.Typography variant="subtitle1">
                            Conclusion
                        </mui.Typography>

                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                            sx={{ marginTop: '20px' }}
                        >
                            <FormControlLabel
                                value="Effective"
                                control={<Radio />}
                                label="Effective"
                                sx={{ typography: 'body2', fontSize: '12px' }} // Set font size to 12px
                            />
                            <FormControlLabel
                                value="Not Effective"
                                control={<Radio />}
                                label="Not Effective"
                                sx={{ typography: 'body2', fontSize: '12px' }} // Set font size to 12px
                            />
                            <FormControlLabel
                                value="Inconclusive"
                                control={<Radio />}
                                label="Inconclusive"
                                sx={{ typography: 'body2', fontSize: '12px' }} // Set font size to 12px
                            />
                        </RadioGroup>

                        <mui.Typography variant="caption" sx={{ color: 'grey' }}>
                            Provide a brief explanation below to support your conclusion (Optional)
                        </mui.Typography>

                        <ReactQuill
                            theme="snow"
                            value={interimConclusion}
                            onChange={setInterimConclusion}
                            modules={modules}
                            formats={formats}
                            style={{ height: '150px', }}
                        />
                    </mui.Paper>

                </div>
            ),
        },
        {
            value: '3',
            label: (<div>
                Operating Effectiveness
            </div>),
            content: (

                <div>
                    <Accordion expanded={expanded}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <mui.Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                <mui.Box sx={{ flexGrow: 1 }}>
                                    <mui.Stack direction="row" spacing={1} alignItems="center">
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Interim

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>
                        </AccordionSummary>

                        <AccordionDetails>


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
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Rollforward

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>

                        </AccordionSummary>
                        <AccordionDetails>
                            <NormalTextField
                                name="CONTROL_DESCRIPTION"
                                label=""
                                isMultiLine={true}
                                rows="5"
                                value={testingInfo?.CONTROL_DETAILS?.CONTROL_DESCRIPTION ? testingInfo.CONTROL_DETAILS.CONTROL_DESCRIPTION : ''}
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
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Final

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>

                        </AccordionSummary>
                        <AccordionDetails>
                            <NormalTextField
                                name="CONTROL_DESCRIPTION"
                                label=""
                                isMultiLine={true}
                                rows="5"
                                value={testingInfo?.CONTROL_DETAILS?.CONTROL_DESCRIPTION ? testingInfo.CONTROL_DETAILS.CONTROL_DESCRIPTION : ''}
                            />
                        </AccordionDetails>
                    </Accordion>
                </div>
            ),
        },
        {
            value: '4',
            label: (<div>
                Conclusion
            </div>),
            content: (

                <div>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <mui.Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                <mui.Box sx={{ flexGrow: 1 }}>
                                    <mui.Stack direction="row" spacing={1} alignItems="center">
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Interim

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>
                        </AccordionSummary>
                        <AccordionDetails>


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
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Rollforward

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>

                        </AccordionSummary>
                        <AccordionDetails>
                            <NormalTextField
                                name="CONTROL_DESCRIPTION"
                                label=""
                                isMultiLine={true}
                                rows="5"
                                value={testingInfo?.CONTROL_DETAILS?.CONTROL_DESCRIPTION ? testingInfo.CONTROL_DETAILS.CONTROL_DESCRIPTION : ''}
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
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Final

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>

                        </AccordionSummary>
                        <AccordionDetails>
                            <NormalTextField
                                name="CONTROL_DESCRIPTION"
                                label=""
                                isMultiLine={true}
                                rows="5"
                                value={testingInfo?.CONTROL_DETAILS?.CONTROL_DESCRIPTION ? testingInfo.CONTROL_DETAILS.CONTROL_DESCRIPTION : ''}
                            />
                        </AccordionDetails>
                    </Accordion>
                </div>
            ),
        },
        {
            value: '5',
            label: (<div>
                Remediation
            </div>),
            content: (

                <div>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <mui.Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                <mui.Box sx={{ flexGrow: 1 }}>
                                    <mui.Stack direction="row" spacing={1} alignItems="center">
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Interim

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>
                        </AccordionSummary>
                        <AccordionDetails>


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
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Rollforward

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>

                        </AccordionSummary>
                        <AccordionDetails>
                            <NormalTextField
                                name="CONTROL_DESCRIPTION"
                                label=""
                                isMultiLine={true}
                                rows="5"
                                value={testingInfo?.CONTROL_DETAILS?.CONTROL_DESCRIPTION ? testingInfo.CONTROL_DETAILS.CONTROL_DESCRIPTION : ''}
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
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Final

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>

                        </AccordionSummary>
                        <AccordionDetails>
                            <NormalTextField
                                name="CONTROL_DESCRIPTION"
                                label=""
                                isMultiLine={true}
                                rows="5"
                                value={testingInfo?.CONTROL_DETAILS?.CONTROL_DESCRIPTION ? testingInfo.CONTROL_DETAILS.CONTROL_DESCRIPTION : ''}
                            />
                        </AccordionDetails>
                    </Accordion>
                </div>
            ),
        },
        {
            value: '6',
            label: (<div>
                Evidences
            </div>),
            content: (

                <div>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <mui.Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                                <mui.Box sx={{ flexGrow: 1 }}>
                                    <mui.Stack direction="row" spacing={1} alignItems="center">
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Interim

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>
                        </AccordionSummary>
                        <AccordionDetails>


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
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Rollforward

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>

                        </AccordionSummary>
                        <AccordionDetails>
                            <NormalTextField
                                name="CONTROL_DESCRIPTION"
                                label=""
                                isMultiLine={true}
                                rows="5"
                                value={testingInfo?.CONTROL_DETAILS?.CONTROL_DESCRIPTION ? testingInfo.CONTROL_DETAILS.CONTROL_DESCRIPTION : ''}
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
                                        <mui.Typography variant="h6">
                                            <PagesIcon sx={{ marginRight: '5px', color: 'grey' }} />Final

                                        </mui.Typography>
                                    </mui.Stack>
                                </mui.Box>

                                <mui.Switch {...label} sx={{ marginLeft: 'auto' }} onClick={handleSwitchChange} onChange={handleSwitchChange} />
                            </mui.Stack>

                        </AccordionSummary>
                        <AccordionDetails>
                            <NormalTextField
                                name="CONTROL_DESCRIPTION"
                                label=""
                                isMultiLine={true}
                                rows="5"
                                value={testingInfo?.CONTROL_DETAILS?.CONTROL_DESCRIPTION ? testingInfo.CONTROL_DETAILS.CONTROL_DESCRIPTION : ''}
                            />
                        </AccordionDetails>
                    </Accordion>
                </div>
            ),
        },
    ]


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
                    <mui.Link underline="hover" color="inherit" href={`/Audit/Projects/${selectedProject.id}`}>
                        {selectedProject.AUDIT_NAME}
                    </mui.Link>
                    <mui.Typography color="text.primary">{selectedApp.APP_NAME}</mui.Typography>
                    <mui.Link underline="hover" color="inherit" href={`/Audit/Workpapers/${selectedProject.id}`}>
                        Workpapers
                    </mui.Link>
                    <mui.Typography color="text.primary">{testingInfo?.CONTROL_DETAILS?.CONTROL_ID}</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar
                    title={`${testingInfo?.CONTROL_DETAILS?.CONTROL_ID || 'Loading ID'} / ${testingInfo?.CONTROL_DETAILS?.CONTROL_TITLE || 'Loading Title'}`}
                    icon={<PostAddOutlinedIcon />}
                />
                <Separator />

                <mui.Box sx={{ backgroundColor: 'whitesmoke', minHeight: '80vh', padding: '20px' }}>
                    <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <mui.Grid item
                            xs={12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >
                            <mui.Paper sx={{ padding: '20px' }}>

                                <mui.Stack direction="row" spacing={1} >
                                    <mui.Box sx={{ flexGrow: 1 }}>
                                        <mui.Stack direction="row" spacing={1}>
                                            <mui.Stack direction="row" spacing={1}>

                                                <Chip
                                                    avatar={<mui.Avatar>RM</mui.Avatar>}
                                                    label={testingInfo.STATUS ? testingInfo.STATUS : ''}
                                                    variant="outlined"
                                                    sx={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: '16px' }}
                                                    onClick={() => { }}
                                                    color="primary"
                                                />
                                            </mui.Stack>

                                        </mui.Stack>
                                    </mui.Box>

                                    <Chip icon={<DownloadOutlinedIcon sx={{ fontSize: '18px' }} />} color="primary" onClick={() => { }} label="Download" variant="outlined" sx={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: '16px' }} />
                                    <Chip icon={<HistoryEduIcon />} label="Sign-Off" onClick={() => { }} color="primary" variant="outlined" sx={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: '16px' }} />
                                    <Chip icon={<SpeakerNotesOutlinedIcon />} onClick={() => { }} color="primary" label="Notes" variant="outlined" sx={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: '16px' }} />
                                    <Chip icon={<SendIcon sx={{ fontSize: '18px' }} />} onClick={() => { }} color="primary" label="Send" variant="outlined" sx={{ marginLeft: 'auto', padding: '4px 8px', borderRadius: '16px' }} />
                                </mui.Stack>


                                <Divider sx={{ marginTop: '10px' }} />

                                <DynamicTabs tabs={tabs} />

                            </mui.Paper>
                        </mui.Grid>

                    </mui.Grid>
                </mui.Box>

                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    header="Test Procedures Library"
                    size="lg"
                    body={
                        <>

                            <Divider />

                            <mui.Box sx={{ overflow: 'auto' }}>
                                <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                    <label style={{
                                        display: 'block',
                                        width: '50px',
                                        marginLeft: '10px',
                                        zIndex: '1000000',
                                        marginBottom: '-10px',
                                        fontSize: '12px',
                                        position: 'relative',
                                        backgroundColor: 'white',
                                        padding: '0px 5px',
                                        color: 'grey'
                                    }}>Phase</label>
                                    <div style={{
                                        marginBottom: '18px',
                                        position: 'relative',
                                        zIndex: '99999'  // Lower z-index than the label
                                    }}>
                                        <MultipleSelect
                                            zIndex="99999"
                                            isMultiSelect={false}
                                            defaultValue={selectedPhase ? selectedPhase : ''}
                                            placeholderText=""
                                            selectOptions={phaseOptions}
                                            selectedOptions={selectedPhase ? selectedPhase : ''}
                                            handleChange={handlePhaseChange}
                                        />

                                    </div>

                                </div>

                                <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                                    <label style={{
                                        display: 'block',
                                        width: '110px',
                                        marginLeft: '10px',
                                        zIndex: '99',
                                        marginBottom: '-10px',
                                        fontSize: '12px',
                                        position: 'relative',
                                        backgroundColor: 'white',
                                        padding: '0px 5px',
                                        color: 'grey'
                                    }}>Procedure Name</label>
                                    <div style={{
                                        marginBottom: '18px',
                                        position: 'relative',
                                        zIndex: '98'  // Lower z-index than the label
                                    }}>
                                        <MultipleSelect
                                            zIndex="99999"
                                            isMultiSelect={false}
                                            defaultValue={selectedProcedureName ? selectedProcedureName : ''}
                                            placeholderText=""
                                            selectOptions={procedureOptions}
                                            selectedOptions={selectedProcedureName ? selectedProcedureName : ''}
                                            handleChange={handleProcedureNameChange}
                                        />

                                    </div>

                                </div>

                                <ReactQuill
                                    theme="snow"
                                    value={selectedProcedures}
                                    onChange={setSelectedProcedures}
                                    modules={modules}
                                    formats={formats}
                                    style={{ marginTop: '20px', height: '300px' }}
                                />


                            </mui.Box>
                        </>
                    }
                    footer={
                        <>


                            <mui.Button sx={{ marginBottom: '10px' }} onClick={handleCloseModal} variant="outlined" color="primary">
                                Cancel
                            </mui.Button>

                            <mui.Button sx={{ marginBottom: '10px', marginRight: '10px' }} onClick={handleCloseModal} variant="contained" color="primary">
                                Use Procedure
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
export default WorkpapersDetails;