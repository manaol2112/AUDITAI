import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import OutlinedCard from '../../common/MediaCard';
import GridViewIcon from '@mui/icons-material/GridView';
import CustomSpeedDial from '../../common/SpeedDial';
import appService from '../../../services/ApplicationService';
import NormalTextField from '../../common/NormalTextField';
import DynamicSnackbar from '../../common/Snackbar';
import MultipleSelect from '../../common/MultipleSelect';
import companyService from '../../../services/CompanyService';
import { useParams } from 'react-router-dom';
import Modal from '../../common/Modal';
import userService from '../../../services/UserService';
import DynamicTabs from '../../common/DynamicTabs';

const ManageApplicationsDetails = () => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [companies, setCompanies] = useState([]);
    const [apps, setApps] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState([]);
    const [selectedusers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const showSnackbar = (message, severity = 'success', autoHideDuration = 1500) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
        
        // Automatically close snackbar after autoHideDuration milliseconds
        setTimeout(() => {
            setSnackbarOpen(false);
        }, autoHideDuration);
    };

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [appData, setAppData] = useState({
        COMPANY_ID: '',
        APP_NAME: '',
        APP_DESCRIPTION: '',
        APPLICATION_OWNER: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch apps and users in parallel
                const [appsResponse, usersResponse,] = await Promise.all([
                    appService.fetchAppsById(id),
                    userService.fetchUsers()
                ]);

                setApps(appsResponse);
    
                const selectedAppOwners = appsResponse.owners.map(user => ({
                    value: user.id,
                    label: `${user.first_name} ${user.last_name}`
                }));
                
                setSelectedUsers(selectedAppOwners);
                setUsers(usersResponse);
    
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    
        // Empty dependency array ensures this effect runs only once on mount
    }, []);

    const userList = users.map(user => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name} (${user.email})`
    }))

    const handleOpenCreateModal = () => {
        setOpenCreateModal(true);
    };

    const handleCloseCreateModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenCreateModal(true)
        }
        else {
            setOpenCreateModal(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setApps({ ...apps, [name]: value });
    };

    const appDataWithOwner = {
        ...apps,
        APPLICATION_OWNER: selectedusers.map(id => id.value),
    };

    const updateAppRecord = async (e) => {
        e.preventDefault();
        try {
            const response = await appService.updateApp(id, appDataWithOwner);
            showSnackbar('Application record successfully updated');
        } catch (error) {
            showSnackbar('There was a problem updating application record', 'error');
        }
    };

    const deleteAppRecord = async (e) => {
        e.preventDefault();
        try {
            const response = await appService.deleteApp(id);
            showSnackbar('Application successfully deleleted');
            // Delay navigation after showing snackbar
            setTimeout(() => {
                navigate('/Applications');
            }, 1500);
        } catch (error) {
            showSnackbar('There was a problem deleting application record', 'error');
          
            setTimeout(() => {
                navigate('/Applications');
            }, 1500);
        }
    };

    const handleUserChange = (selectedOptions) => {
        setSelectedUsers(selectedOptions); 
    }

    
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
                    <mui.Link underline="hover" color="inherit" href="/Applications">
                        Applications
                    </mui.Link>
                    <mui.Typography color="text.primary">{apps.APP_NAME}</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage Applications" icon={<GridViewIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage, Create, Modify, and Delete Applications
                </mui.Typography>

                <Separator />

                <NormalTextField
                    label="Company Name"
                    name="COMPANY_ID"
                    value={apps.COMPANY_NAME}
                    readonly={true}
                />

                <NormalTextField
                    label="Application Name"
                    name="APP_NAME"
                    value={apps.APP_NAME}
                    onChange={handleChange}
                />
                <NormalTextField
                    label="Description"
                    name="APP_DESCRIPTION"
                    value={apps.APP_DESCRIPTION}
                    onChange={handleChange}
                    isMultiLine={true}
                    rows="5"
                />


                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <MultipleSelect
                        isMultiSelect={true}
                        placeholderText="Select Application Owner"
                        selectOptions={userList}
                        selectedOptions={selectedusers}
                        handleChange={handleUserChange}
                    />
                </div>

                <DynamicSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                    onClose={handleSnackbarClose}
                />

                <mui.Button size="small" variant="contained" sx={{ marginRight: '10px', marginTop: '20px' }} onClick={updateAppRecord} >Update</mui.Button>
                <mui.Button size="small" variant="contained" sx={{ marginRight: '10px', marginTop: '20px' }} onClick={handleOpenCreateModal} >Delete</mui.Button>

                <Modal
                    open={openCreateModal}
                    onClose={handleCloseCreateModal}
                    header="Confirm Delete"
                    body={
                        <>
                            <mui.Typography>This will permanently delete {apps.APP_NAME} and its child record. This action cannot be reversed. Click confirm button to proceed. </mui.Typography>
                        </>
                    }
                    footer={
                        <>
                            <mui.Button size="small" onClick={handleCloseCreateModal} color="primary">
                                Cancel
                            </mui.Button>
                            <mui.Button size="small" onClick={deleteAppRecord} color="primary" variant="contained">
                                Confirm Delete
                            </mui.Button>
                        </>
                    }
                />

            </ResponsiveContainer>
        </div>

    )

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>

    );
}
export default ManageApplicationsDetails;