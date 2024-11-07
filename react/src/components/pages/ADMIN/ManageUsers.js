import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import ResponsiveContainer from '../../layout/Container';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CustomSpeedDial from '../../common/SpeedDial';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '../../common/Modal';
import NormalTextField from '../../common/NormalTextField';
import permissionService from '../../../services/PermissionService';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DynamicAvatarList from '../../common/AvatarName';
import UserCard from '../../common/UserCard';
import userService from '../../../services/UserService';
import LoginIcon from '@mui/icons-material/Login';
import roleService from '../../../services/RoleService';
import MultipleSelect from '../../common/MultipleSelect';
import companyService from '../../../services/CompanyService';
import userrolesService from '../../../services/UserRoleService';
import DynamicSnackbar from '../../common/Snackbar';


const ManageUsers = () => {

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const [selectedCompany, setSelectedCompany] = useState({
        USERNAME: '',
        COMPANY_ID:[],
    });

    const [userData, setNewUsers] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        is_active:false,
        groups:null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUsers({ ...userData, [name]: value });
    };

    const handleCompanyChange = (selectedCompany) => {
        setSelectedCompany(selectedCompany);
      };
    
    const handleRoleChange = (selectedRoles) => {
        setSelectedRoles(selectedRoles);
      };

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

    const createUser = async (e) => {
        e.preventDefault();
        try {

            setFormSubmitted(true);
           
            //CREATE USER 
            const userDataWithRoles = {
                ...userData,
                groups: selectedRoles.map(role => role.value),
            };
        
            const userResponse = await userService.createUser(userDataWithRoles);

            const companyIdArray = selectedCompany.map(company => (company.value));
            const userroleData = {
                COMPANY_ID: companyIdArray,
                USERNAME: userResponse.id
            };

            const userRolesResponse = await userrolesService.create(userroleData);

            handleCloseCreateModal();

            setSnackbarMessage('User successfully created');
            setSnackbarSeverity('success');
            setSnackbarOpen(true); 

            setUsers([...users, userResponse]); 

        } catch (error) {
            setSnackbarMessage('There was a problem creating a new user');
            setSnackbarSeverity('error');
            setSnackbarOpen(true); 
        }
    };

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    const fetchUsers = async () => {
        try {
            const response = await userService.fetchUsers(); 
            setUsers(response); 
          } catch (error) {
            console.error('Error fetching users:', error);
          }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    
    const fetchRoles = async () => {
        try {
            const response = await roleService.fetchRoles(); 
            setRoles(response); 
          } catch (error) {
            console.error('Error fetching companies:', error);
          }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const roleList = roles.map(role => ({
        value: role.id, 
        label: role.name 
      }));

    
    const [companies, setCompanies] = useState([]); 

    const fetchCompanies = async () => {
        try {
            const response = await companyService.fetchCompanies(); 
            setCompanies(response); 
          } catch (error) {
            console.error('Error fetching companies:', error);
          }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);


    const companyList = companies.map(item => ({
        value: item.id,
        label: item.COMPANY_NAME 
      }));
    const emptyRole = formSubmitted & selectedRoles.length === 0;
    const emptyCompany = formSubmitted & selectedCompany.length === 0;
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
                    <mui.Typography color="text.primary">Users</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage Users" icon={<PeopleAltIcon />} />
                
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Create, manage, and update users
                </mui.Typography>

                <Separator />

                <mui.Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={3}
                >
                    {users.map(user => (
                        user.first_name ? (
                            <mui.Grid item key={user.id}>
                            <UserCard
                                icon={<DynamicAvatarList names={`${user.first_name} ${user.last_name}`} />}
                                title={`${user.first_name} ${user.last_name}`} 
                                email={user.email}
                                status={user.is_active ? <mui.Chip label="Active" sx={{backgroundColor: 'lightblue'}} /> : <mui.Chip label="Inactive" sx={{backgroundColor: 'lightgrey'}} />} 
                                to={`/ManageUsers/${user.username}`}
                                buttonlabel={<React.Fragment>
                                   <LoginIcon/>
                                </React.Fragment>}
                            />
                            </mui.Grid>
                        ) : <mui.Grid item key={user.id}>
                        <UserCard

                            icon={  <DynamicAvatarList names={user.username}/>}
                            title={user.username}
                            email ="Unknown"
                            status={user.is_active ? <mui.Chip label="Active" sx={{backgroundColor: 'lightblue'}} /> : <mui.Chip label="Inactive" sx={{backgroundColor: 'lightgrey'}} />} 
                            to={`/ManageUsers/${user.username}`}
                            buttonlabel={<React.Fragment>
                                <LoginIcon/>
                             </React.Fragment>}
                            
                        />
                    </mui.Grid>

                    ))}

                </mui.Grid>

                <CustomSpeedDial onClick={handleOpenCreateModal} />

                <Modal
                    open={openCreateModal}
                    onClose={handleCloseCreateModal}
                    header="Setup New User"
                    body={
                        <>

                            <NormalTextField
                                label="Username"
                                name="username"
                                value={userData.username}
                                onChange={handleChange} 
                                required={true}  
                            />
                            <NormalTextField
                                label="First Name"
                                name="first_name"
                                value={userData.first_name}
                                onChange={handleChange} 
                                required={true}  
                            />

                            <NormalTextField
                                label="Last Name"
                                name="last_name"
                                value={userData.last_name}
                                onChange={handleChange} 
                                required={true}  
                            />

                            <NormalTextField
                                label="Email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange} 
                                required={true}  
                            />

                            <div style={{ width: '500px', marginTop: '18px'}}>
                                <MultipleSelect
                                    isMultiSelect={true}
                                    placeholderText="Select Roles*"
                                    selectOptions={roleList}
                                    value={selectedRoles}
                                    handleChange={handleRoleChange}
                                    required={emptyRole} 
                                    label = "Roles"
                                />
                            </div>

                            <div style={{ width: '500px', marginTop: '18px'}}>
                                <MultipleSelect
                                    isMultiSelect={true}
                                    placeholderText="Select Company*"
                                    selectOptions={companyList}
                                    value={selectedCompany}
                                    handleChange={handleCompanyChange}
                                    required={emptyCompany} 
                                />
                            </div>
                           
                        </>
                    }
                    footer={
                        <>
                            <mui.Button onClick={handleCloseCreateModal} color="primary">
                                Cancel
                            </mui.Button>
                            <mui.Button onClick={createUser} color="primary" variant="contained">
                                Create
                            </mui.Button>
                        </>
                    }
                />

                <DynamicSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                    onClose={handleSnackbarClose}
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

export default ManageUsers;
