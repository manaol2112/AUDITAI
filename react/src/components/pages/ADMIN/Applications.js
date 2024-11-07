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
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Modal from '../../common/Modal';
import NormalTextField from '../../common/NormalTextField';
import DynamicSnackbar from '../../common/Snackbar';
import MultipleSelect from '../../common/MultipleSelect';
import companyService from '../../../services/CompanyService';
import SettingsIcon from '@mui/icons-material/Settings';
import userService from '../../../services/UserService';
import userrolesService from '../../../services/UserRoleService';

const ManageApplications = () => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [companies, setCompanies] = useState([]);
    const [apps, setApps] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [appData, setAppData] = useState({
        COMPANY_ID: '',
        APP_NAME: '',
        APP_DESCRIPTION: '',
        APPLICATION_OWNER: '',
    });

    const appDataWithOwner = {
        ...appData,
        APPLICATION_OWNER: selectedUser.map(id => id.value),
    };

    const createApp = async (e) => {
        e.preventDefault();
        console.log('This is the data to be sent', appDataWithOwner)
        try {
            const response = await appService.createApp(appDataWithOwner);
            setApps([...apps, response]);
            setSnackbarMessage('Company successfully created');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleCloseCreateModal()
        } catch (error) {
            setSnackbarMessage('There was a problem creating the company');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const fetchApps = async () => {
        try {
            const response = await appService.fetchApps();
            setApps(response);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await companyService.fetchCompanies();
            setCompanies(response);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    useEffect(() => {
        fetchApps();
        fetchCompanies();
    }, []);

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
        setAppData({ ...appData, [name]: value });
    };

    const companyList = companies.map(company => ({
        value: company.id,
        label: company.COMPANY_NAME
    }));

    const [userList, setUserList] = useState([]);

    const handleCompanyChange = async (selectedCompany) => {
        setSelectedCompany(selectedCompany);
        
        // Assuming setAppData is synchronous and doesn't require async/await
        setAppData(prevAppData => ({
            ...prevAppData,
            COMPANY_ID: selectedCompany.value
        }));
    
        try {
            const response = await userrolesService.getUserbyCompanies(selectedCompany.value);
            setUsers(response);
            console.log('This has the list of users under the selected company', response)


            // Initialize an empty array to collect mapped user data
            const newUserList = [];

            response.forEach(user => {
                if (user.USERNAME && user.USERNAME.length > 0) {
                    user.USERNAME.forEach(username => {
                        // Assuming username.id and username.first_name are valid fields
                        newUserList.push({
                            value: username.id,
                            label: `${username.first_name} ${username.last_name}` // Adjust label as needed
                        });
                    });
                }
            });

            // Set the newUserList to state to update userList
            setUserList(newUserList);

        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    

    const handleUserChange = (selectedOptions) => {
        setSelectedUser(selectedOptions); 
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
                    <mui.Typography color="text.primary">Applications</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage Applications" icon={<GridViewIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage, Create, Modify, and Delete Applications
                </mui.Typography>

                <Separator />

                <mui.Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={3}
                >
                    {apps.map(app => (
                        <mui.Grid item key={app.id}>
                            <OutlinedCard
                                // icon={<AppRegistrationIcon sx={{fontSize: '30px'}} />}
                                title={
                                    <React.Fragment>
                                      
                                        <mui.Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary'}}>
                                            [{app.COMPANY_NAME}]
                                        </mui.Typography>
                                        <AppRegistrationIcon sx={{ fontSize: '20px', marginRight: '3px' }} /> {/* Icon component */}
                                        <mui.Typography variant="subtitle1" component="span">
                                            {app.APP_NAME}
                                        </mui.Typography>{" "}
                                        
                                    </React.Fragment>
                                }
                                to={`/applications/${app.id}`}
                                buttonlabel={<React.Fragment>
                                    Configure <SettingsIcon sx={{ marginLeft: '5px' }} />
                                </React.Fragment>}
                            />
                        </mui.Grid>
                    ))}
                </mui.Grid>

                <Modal
                    open={openCreateModal}
                    onClose={handleCloseCreateModal}
                    header="Setup New Application"
                    body={
                        <>

                            <div style={{ width: '500px', marginTop: '10px', marginBottom: '10px' }}>
                                <MultipleSelect
                                    isMultiSelect={false}
                                    placeholderText="Select Company"
                                    selectOptions={companyList}
                                    value={selectedCompany}
                                    handleChange={handleCompanyChange}

                                />
                            </div>

                            <NormalTextField
                                label="Application Name"
                                name="APP_NAME"
                                value={appData.APP_NAME}
                                onChange={handleChange}
                            />
                            <NormalTextField
                                label="Description"
                                name="APP_DESCRIPTION"
                                value={appData.APP_DESCRIPTION}
                                onChange={handleChange}
                                isMultiLine={true}
                                rows="5"
                            />

                            <div style={{ width: '500px', marginTop: '10px', marginBottom: '10px' }}>
                                <MultipleSelect
                                    isMultiSelect={true}
                                    placeholderText="Select Application Owner"
                                    selectOptions={userList}
                                    value={selectedUser}
                                    handleChange={handleUserChange}
                                />
                            </div>

                        </>
                    }
                    footer={
                        <>
                            <mui.Button onClick={handleCloseCreateModal} color="primary">
                                Cancel
                            </mui.Button>
                            <mui.Button onClick={createApp} color="primary" variant="contained">
                                Create
                            </mui.Button>
                        </>
                    }
                />

                <CustomSpeedDial onClick={handleOpenCreateModal} />

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
        <div>
            <SideBar mainContent={customMainContent} />
        </div>

    );
}
export default ManageApplications;