import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import ResponsiveContainer from '../../layout/Container';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import DataTable from '../../common/DataGrid';
import appService from '../../../services/ApplicationService';
import userService from '../../../services/UserService';
import companyService from '../../../services/CompanyService';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import Tooltip from '@mui/material/Tooltip';



const InterfacesApp = () => {

    const [apps, setApps] = useState([]);
    const navigate = useNavigate();


    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'COMPANY_NAME', headerName: 'Company', flex: 1 },
        { field: 'APP_NAME', headerName: 'Application Name', flex: 1 },
        {
            field: 'APP_DESCRIPTION',
            headerName: 'Description',
            sortable: false,
            flex: 1
        },
    ];

    const rows = apps.map((app, index) => ({
        id: index + 1,
        COMPANY_NAME: app.COMPANY_NAME || '-',
        APP_NAME: app.APP_NAME || '-',
        APP_DESCRIPTION: app.APP_DESCRIPTION || '-',
        appID: app.id
    }));

    const createCompany = () => {
        alert('Haha')
    };

    const handleEditClick = (row) => {
        // Handle edit action, e.g., open a modal or navigate to edit page
        console.log('Edit clicked for row:', row);
    };

    const handleActionClick = (row) => {
        alert('Edit is clicked')
        // Handle custom action, e.g., delete or view details
        console.log('Action clicked for row:', row);
    };


    const handleUsersClick = (row) => {
        console.log('This is the row content', row.appID)
        navigate('/Applications/Users/' + row.appID);
    };


    const renderEditButton = (params) => {
        return (
            <Tooltip title="Edit Application" arrow>
                <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEditClick(params.row)}
                >
                    <CreateOutlinedIcon />
                </IconButton>
            </Tooltip>
        );
    };
        
    const renderActionButton = (params) => {
        return (
            <Tooltip title="More Actions" arrow>
                <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleActionClick(params.row)}
                >
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>
        );
    };
    
    const renderUsersButton = (params) => {
        return (
            <Tooltip title="Manage Users" arrow>
                <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleUsersClick(params.row)}
                >
                    <PeopleRoundedIcon />
                </IconButton>
            </Tooltip>
        );
    };
    
    const renderControlsButton = (params) => {
        return (
            <Tooltip title="View Controls" arrow>
                <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleActionClick(params.row)}
                >
                    <VerifiedUserRoundedIcon />
                </IconButton>
            </Tooltip>
        );
    };


    // Add edit and action buttons to columns
    const columnsWithActions = [
        ...columns,
  
        { 
            field: 'users',
            headerName: 'Users',
            width: 100,
            sortable: false,
            renderCell: renderUsersButton,
        },
        { 
            field: 'controls',
            headerName: 'Controls',
            width: 100,
            sortable: false,
            renderCell: renderControlsButton,
        },
        { 
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            sortable: false,
            renderCell: renderEditButton,
        },
        { 
            field: 'action',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: renderActionButton,
        },
    ];

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
                    <mui.Typography color="text.primary">Application Data</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Application Data Sources" icon={<RecentActorsIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage and configure application data source
                </mui.Typography>
                <Separator />


                <DataTable
                 rows={rows}
                 columns={columns}
                 columnsWithActions={columnsWithActions}
                />
                

            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>
    );
}

export default InterfacesApp;
