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
import { useNavigate } from 'react-router-dom';

const Workpapers = () => {
    const [selectedProject, setSelectedProject] = useState([])
    const [apps, setApps] = useState([])
    const [selectedApp, setSelectedApp] = useState([])
    const { id } = useParams();
    const [riskData, setRiskData] = useState([]);
    const [workpapers, setWorkpapers] = useState([]);
    const navigate = useNavigate();

    const [companyID, setCompanyID] = useState([]);
    const [appID, setAppID] = useState([]);

    const [open, setOpen] = React.useState(true);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    
    const handleClick = () => {
        setOpen(!open);
    };

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

                fetchWorkpapers(appRecord[0].id,projectRecord.COMPANY_ID)

            } catch (fetchError) {
                console.error('Error fetching company:', fetchError);
                setSelectedProject([])
            }
        }

        fetchProjectbyID()
    }, []);

    const getAppDetails = (app) => {
        setSelectedApp(app)
        fetchWorkpapers(app.id, companyID)
    }

    const fetchWorkpapers = async (app_id, company_id) => {
        
        let controls;
        try {
            controls = await auditService.fetchWorkpapersByApp(app_id, company_id);
            // Handle the data here, e.g., set state
        } catch (error) {
            // Handle errors here
            console.error('Failed to fetch data:', error);
        }

        if (controls) {
            const workpapers = controls.filter(control => control.FOLDER === "Workpaper");
            setWorkpapers(workpapers)
        } else {
            setWorkpapers([])
        }
    };

    const handleTitleClick = (row) => {

        navigate(`/Audit/Workpapers/Project/${id}/Control/${row.ctrlID}`)
        // const url = `/Audit/Workpapers/Project/${id}/Control/${row.ctrlID}`;
        // window.open(url, '_blank'); // Open the URL in a new tab
    };

    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'CONTROL_ID', headerName: 'Control ID', flex: 1,
        renderCell: (params) => (
            <span
                style={{ cursor: 'pointer',
                textDecoration: 'underline'}}
                onClick={() => handleTitleClick(params.row)}
            >
                {params.value}
            </span>
        ) },
        { field: 'CONTROL_TITLE', headerName: 'Control Name', flex: 1 },
        { field: 'CURRENTLY_WITH', headerName: 'Currently With', flex: 1 },
        { field: 'STATUS', headerName: 'Status', flex: 1 },
        { field: 'TYPE', headerName: 'Type', flex: 1 },
    
    ];

    const rows = Array.isArray(workpapers) ? workpapers.map((wp, index) => ({
        id: index + 1,
        CONTROL_ID: wp.CONTROL_DETAILS.CONTROL_ID|| '-',
        CONTROL_TITLE: wp.CONTROL_DETAILS.CONTROL_TITLE || '-',
        CURRENTLY_WITH: wp.CURRENTLY_WITH || '-',
        STATUS: wp.STATUS || '-',
        TYPE: wp.TYPE || '-',
        ctrlID: wp.id,
    })) : [];

    const renderAuditPrepButton = (params) => {
        const app = params.row;
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

    const renderWorkpaperPBC = (params) => {
        const app = params.row;
        return (
                <Tooltip title="View Request Status" arrow>
                    <mui.IconButton
                        size="small"
                        onClick={(event) => handleClick(event, app)}
                    >
                    <FolderOpenIcon sx={{fontSize: '18px'}} />
                    </mui.IconButton>
                </Tooltip>   
        );
    };

    const renderNotesCount = (params) => {
        const app = params.row;
        return (
            <div>
                <Tooltip title="Review Notes" arrow>
                    <mui.IconButton
                        size="small"
                        onClick={(event) => handleClick(event, app)}
                    >
                        <MarkChatUnreadOutlinedIcon sx={{ fontSize: '18px', }} />
                    </mui.IconButton>
                </Tooltip>
              
            </div>

        );
    };


    const renderSignoff = (params) => {
        const app = params.row;
        return (
            <div>
                <Tooltip title="Sign-off" arrow>
                    <mui.IconButton
                        size="small"
                        onClick={(event) => handleClick(event, app)}
                    >
                        <HistoryEduIcon sx={{ fontSize: '18px' }} />
                    </mui.IconButton>
                </Tooltip>
                
              
            </div>

        );
    };

    const renderComments = (params) => {
        const app = params.row;
        return (
                <Tooltip title="Add Comment" arrow>
                    <mui.IconButton
                        size="small"
                        onClick={(event) => handleClick(event, app)}
                    >
                    <CommentIcon sx={{fontSize: '18px'}} />
                    </mui.IconButton>
                </Tooltip>   
        );
    };

    const renderSendWP = (params) => {
        const app = params.row;
        return (
                <Tooltip title="Send Workpaper" arrow>
                    <mui.IconButton
                        size="small"
                        onClick={(event) => handleClick(event, app)}
                    >
                    <SendIcon sx={{fontSize: '18px'}} />
                    </mui.IconButton>
                </Tooltip>   
        );
    };
    
    const columnsWithActions = [
        ...columns,
       
        {
            field: 'pbc',
            headerName: 'PBC',
            flex: 1,
            sortable: false,
            renderCell: renderWorkpaperPBC,
        },
       
        {
            field: 'signoff',
            headerName: 'Sign-Off',
            flex: 1,
            sortable: false,
            renderCell: renderSignoff,
        },
        
        {
            field: 'comment',
            headerName: 'Comments',
            flex: 1,
            sortable: false,
            renderCell: renderComments,
        },
        {
            field: 'notes',
            headerName: 'Review Notes',
            flex: 1,
            sortable: false,
            renderCell: renderNotesCount,
        },
        {
            field: 'send',
            headerName: 'Send',
            flex: 1,
            sortable: false,
            renderCell: renderSendWP,
        },
        
    ];

    
    const tabs = [

        {
            value: '1',
            label: (<div>
                Workpapers
            </div>),
            content: (
                <div>

                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={rows}
                            columns={columns}
                            columnsWithActions={columnsWithActions}
                        />
                    </Suspense>


                </div>),
        },
        {
            value: '2',
            label: (<div>
                Planning Documents
            </div>),
            content: (

                <div>

                </div>
                ),
        },
        {
            value: '3',
            label: (<div>
                Deficiencies
            </div>),
            content: (

                <div>
                    
                </div>
                ),
        },
        {
            value: '4',
            label: (<div>
                Remediation
            </div>),
            content: (

                <div>
                    
                </div>
                ),
        },
        {
            value: '5',
            label: (<div>
                Document Requests
            </div>),
            content: (

                <div>
                    
                </div>
                ),
        },
        {
            value: '6',
            label: (<div>
               Risk Assessments
            </div>),
            content: (

                <div>
                    
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
                    <mui.Typography color="text.primary">Workpapers</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title={selectedProject.AUDIT_NAME} icon={<FolderSpecialRoundedIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage, create, and review workpapers
                </mui.Typography>
                <Separator />

                <mui.Box sx={{ backgroundColor: 'whitesmoke', minHeight: '80vh', padding: '20px' }}>
                    <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <mui.Grid item
                            xs={sidebarVisible ? 3 : 0}
                            sx={{
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, width 0.3s ease', // Smooth transition for both transform and width
                                transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',

                            }}>
                            <mui.Paper sx={{ flex: 1, maxHeight: '80vh',minHeight: '80vh', overflow: 'auto' }}>
                                {/* <mui.IconButton
                                    onClick={toggleSidebar}
                                    sx={{ position: 'absolute', top: 20, right: 0, zIndex:999999 }}
                                >
                                    <MenuIcon />
                                </mui.IconButton> */}
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Quick Links
                                        </ListSubheader>
                                    }
                                >
                                    <ListItemButton onClick={handleClick}>
                                        <ListItemIcon>
                                            <GridViewRoundedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Applications" />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {apps.map((app) => (
                                                <React.Fragment key={app.id}>
                                                    <ListItemButton
                                                    onClick={() => getAppDetails(app)}>
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'green' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={app.APP_NAME} style={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />
                                    <ListItemButton onClick={handleClick}>
                                        <ListItemIcon>
                                            <AccountBalanceIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Assets" />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {apps.map((app) => (
                                                <React.Fragment key={app.id}>
                                                    <ListItemButton
                                                    onClick={() => getAppDetails(app)}>
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'green' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={app.APP_NAME} style={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />
                                    <ListItemButton onClick={handleClick}>
                                        <ListItemIcon>
                                            <CreditCardIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Liabilities" />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {apps.map((app) => (
                                                <React.Fragment key={app.id}>
                                                    <ListItemButton
                                                    onClick={() => getAppDetails(app)}>
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'green' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={app.APP_NAME} style={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />
                                    <ListItemButton onClick={handleClick}>
                                        <ListItemIcon>
                                            <SavingsIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Equity" />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {apps.map((app) => (
                                                <React.Fragment key={app.id}>
                                                    <ListItemButton
                                                    onClick={() => getAppDetails(app)}>
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'green' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={app.APP_NAME} style={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />
                                    <ListItemButton onClick={handleClick}>
                                        <ListItemIcon>
                                            <ShoppingBagIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Revenue" />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {apps.map((app) => (
                                                <React.Fragment key={app.id}>
                                                    <ListItemButton
                                                    onClick={() => getAppDetails(app)}>
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'green' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={app.APP_NAME} style={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />
                                    <ListItemButton onClick={handleClick}>
                                        <ListItemIcon>
                                            <PointOfSaleIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Expenses" />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {apps.map((app) => (
                                                <React.Fragment key={app.id}>
                                                    <ListItemButton
                                                    onClick={() => getAppDetails(app)}>
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'green' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={app.APP_NAME} style={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />
                                    <ListItemButton onClick={handleClick}>
                                        <ListItemIcon>
                                            <AccountBalanceWalletIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Other Audit Areas" />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {apps.map((app) => (
                                                <React.Fragment key={app.id}>
                                                    <ListItemButton
                                                    onClick={() => getAppDetails(app)}>
                                                        <ListItemIcon>
                                                            <RadioButtonCheckedRoundedIcon style={{ fontSize: '12px', color: 'green' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={app.APP_NAME} style={{ fontSize: '10px' }} />
                                                    </ListItemButton>
                                                </React.Fragment>
                                            ))}
                                        </List>
                                    </Collapse>
                                    <Divider />
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <AssignmentTurnedInRoundedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Planning Documents" />
                                    </ListItemButton>
                                    <Divider />
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <FolderSpecialRoundedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Workpapers" />
                                    </ListItemButton>
                                    <Divider />
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <AnnouncementRoundedIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Deficiencies" />
                                    </ListItemButton>
                                </List>
                            </mui.Paper>
                        </mui.Grid>

                        <mui.Grid item
                            xs={sidebarVisible ? 9 : 12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >
                            <mui.Paper sx={{ maxHeight: '80vh', minHeight: '80vh', padding: '20px' }}>
                               
                                    <mui.Typography variant="h6"> {selectedApp.APP_NAME}</mui.Typography>
                             
                                <Divider sx={{marginTop: '10px'}}/>
                                <mui.Stack direction="row" spacing={1} sx={{marginTop: '20px'}} >
                                    <mui.Box sx={{ flexGrow: 1 }}>
                                        <mui.Stack direction="row" spacing={1}>
                                            <Chip label="My Queue" color="primary" variant="outlined" onClick={() => { }} size="small" />
                                            <Chip label="Assigned To Me" color="primary" variant="outlined" onClick={() => { }} size="small" />
                                            <Chip label="Not Assigned" color="primary" variant="outlined" onClick={() => { }} size="small" />
                                            <Chip label="Show All Items" color="primary" variant="outlined" onClick={() => { }} size="small" />
                                        </mui.Stack>
                                    </mui.Box>
                                    <Chip icon={<TimelineOutlinedIcon />} onClick={() => { }} color="primary"  size="small" label="Stats" variant="outlined" sx={{ marginLeft: 'auto' }} />
                                    <Chip icon={<FilterAltIcon />} onClick={() => { }} color="primary"  size="small" label="Filter" variant="outlined" sx={{ marginLeft: 'auto' }} />
                                </mui.Stack>
                                <Divider sx={{marginTop: '20px'}}/>

                                <DynamicTabs tabs={tabs} />
                            </mui.Paper>
                        </mui.Grid>

                    </mui.Grid>
                </mui.Box>

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
export default Workpapers;