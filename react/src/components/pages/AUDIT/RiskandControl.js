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
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DeveloperBoardRoundedIcon from '@mui/icons-material/DeveloperBoardRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import LaptopWindowsRoundedIcon from '@mui/icons-material/LaptopWindowsRounded';
import CellTowerRoundedIcon from '@mui/icons-material/CellTowerRounded';
import DevicesOtherRoundedIcon from '@mui/icons-material/DevicesOtherRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import StartRoundedIcon from '@mui/icons-material/StartRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import GppGoodRoundedIcon from '@mui/icons-material/GppGoodRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';

const RiskandControlMapping = () => {
    const [selectedProject, setSelectedProject] = useState([])
    const [apps, setApps] = useState([])
    const { id } = useParams();

    const [open, setOpen] = React.useState(true);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    
    const handleClick = () => {
        setOpen(!open);
    };

    const toggleSidebar = () => {
        // setSidebarVisible(!sidebarVisible);
    };
    

    useEffect(() => {

        const fetchProjectbyID = async () => {
            try {
                const projectRecord = await auditService.fetchProjectsById(id)
                if (projectRecord) {
                    setSelectedProject(projectRecord);

                } else {
                    setSelectedProject([]);
                }

                const appRecord = await appService.fetchAppsByCompany(projectRecord.COMPANY_ID)

                if (appRecord) {
                    setApps(appRecord);

                } else {
                    setApps([]);
                }


            } catch (fetchError) {
                console.error('Error fetching company:', fetchError);
                setSelectedProject([])
            }
        }

        fetchProjectbyID()
    }, []);


    const getIconForType = (appType) => {
        switch (appType) {
            case 'Application':
                return <DeveloperBoardRoundedIcon style={{ color: '#046FB2', marginRight: '5px' }} />;
            case 'Database':
                return <StorageRoundedIcon style={{ color: '#046FB2', marginRight: '5px' }} />; // Replace with actual icon
            case 'Operating System':
                return <LaptopWindowsRoundedIcon style={{ color: '#046FB2', marginRight: '5px' }} />; // Replace with actual icon
            case 'Network':
                return <CellTowerRoundedIcon style={{ color: '#046FB2', marginRight: '5px' }} />; // Replace with actual icon   
            default:
                return <DevicesOtherRoundedIcon style={{ color: '#046FB2', marginRight: '5px' }} />;
        }
    };

    const handleRiskAssessment = (appId) => {
        return () => {
            // Open a new tab and navigate to the specified URL
            window.open(`/Audit/RiskandControlMapping/Application/${selectedProject.COMPANY_ID}/${appId}`, '_blank');
        };
    };

    const tabs = [

        {
            value: '1',
            label: (<div>
                Applications
            </div>),
            content: (
                <div>
                    <mui.Typography variant="subtitle2">
                        Select from the application below to start Risk Assessment and Control Mapping
                    </mui.Typography>
                    <mui.Box sx={{ backgroundColor: 'whitesmoke', padding: '20px', maxHeight:'70vh', overflow: 'auto', marginTop: '20px' }}>
                        {apps.map((app) => (
                            <React.Fragment key={app.id}>
                                <mui.Paper sx={{ padding: '20px', marginTop: '15px' }}>
                                    <mui.Grid
                                        container
                                        spacing={3}
                                        direction="row"
                                        justifyContent="flex-start"
                                        alignItems="flex-start" // Align all items to the top
                                    >
                                        <mui.Grid item xs={2}>
                                            <mui.Typography variant="caption">
                                                Application Name
                                            </mui.Typography>
                                            <mui.Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'flex-start' }}>
                                                {app.APP_NAME || 'N/A'}
                                            </mui.Typography>
                                        </mui.Grid>

                                        <mui.Grid item xs={2}>
                                            <mui.Typography variant="caption">
                                                Type
                                            </mui.Typography>
                                            <mui.Typography variant="subtitle2">
                                            {getIconForType(app.APP_TYPE)}{app.APP_TYPE || 'N/A'}
                                            </mui.Typography>
                                        </mui.Grid>

                                        <mui.Grid item xs={5}>
                                            <mui.Typography variant="caption">
                                                Description
                                            </mui.Typography>
                                            <mui.Typography variant="subtitle2">
                                                {app.APP_DESCRIPTION || 'N/A'}
                                            </mui.Typography>
                                        </mui.Grid>

                                        <mui.Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Tooltip title="Relevant Risk">
                                                <mui.IconButton>
                                                    <WarningAmberRoundedIcon style={{color: 'orange'}} />
                                                </mui.IconButton>
                                            </Tooltip>
                                        </mui.Grid>

                                        <mui.Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Tooltip title="Mapped Controls">
                                                <mui.IconButton>
                                                    <GppGoodRoundedIcon style={{color: 'green'}} />
                                                </mui.IconButton>
                                            </Tooltip>
                                        </mui.Grid>

                                        <mui.Grid item xs={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Tooltip title="Start Assessment">
                                                
                                                <mui.IconButton onClick={handleRiskAssessment(app.id)}>
                                                    <OpenInNewRoundedIcon/>
                                                </mui.IconButton>

                                            </Tooltip>
                                        </mui.Grid>

                                    </mui.Grid>
                                </mui.Paper>
                            </React.Fragment>
                        ))}
                    </mui.Box>

                </div>),
        },
    ]


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
                    <mui.Link underline="hover" color="inherit" href={`/Audit/Projects/${selectedProject.id}`}>
                        {selectedProject.AUDIT_NAME}
                    </mui.Link>
                    <mui.Typography color="text.primary">Risk and Control Mapping</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Risk and Control Mapping" icon={<ReviewsRoundedIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Map risk to relevant control to address the risk
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
                            <mui.Paper sx={{ flex: 1, minHeight: '80vh', overflow: 'auto' }}>
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
                                                    <ListItemButton sx={{ pl: 5 }}>
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
                            <mui.Paper sx={{ minHeight: '80vh', padding: '20px' }}>
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
export default RiskandControlMapping;