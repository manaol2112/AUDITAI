import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import ResponsiveContainer from '../../layout/Container';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
import Modal from '../../common/Modal';
import NormalTextField from '../../common/NormalTextField';
import DynamicAvatarList from '../../common/AvatarName'
import userService from '../../../services/UserService';
import { useParams } from 'react-router-dom';
import MultipleSelect from '../../common/MultipleSelect';
import userrolesService from '../../../services/UserRoleService';
import companyService from '../../../services/CompanyService';
import roleService from '../../../services/RoleService';
import DynamicSnackbar from '../../common/Snackbar';


const ManageUsersDetails = () => {

    const { username } = useParams();

    const [users, setUsers] = useState([]);

    const [userData, setUserData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        is_active:false,
        groups:null
    });
    
    const [allcompanies, setAllCompanies] = useState([]);
    const [selectedcompanies, setSelectedCompanies] = useState([]);
    const [formattedAllCompany, setFormattedAllCompany] = useState([]);
    const [formattedSelectedCompanies, setFormattedSelectedCompanies] = useState([]);

    const [allRoles, setAllRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [formattedAllRoles, setFormattedAllRoles] = useState([]);
    const [formattedSelectRoles, setFormattedSelectRoles] = useState([]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    
    //FETCH USER RECORD
    useEffect(() => {
        const fetchUsersbyID = async () => {
            try {
                const response = await userService.fetchUsersById(username);
                setUsers(response);

                setUserData({
                    username: response.username,
                    first_name: response.first_name,
                    last_name: response.last_name,
                    email: response.email,
                    is_active: response.is_active,
                    groups: response.groups
                });

                // Extracted ALL Companies
                const selected_com = await userrolesService.getUserCompanies(response.id);
                setSelectedCompanies(selected_com.COMPANY_NAME);

                const formattedSelectedCompanies = selected_com.COMPANY_NAME.map(item => ({
                    value: item.id,
                    label: item.COMPANY_ID
                }));
                setFormattedSelectedCompanies(formattedSelectedCompanies);

                // Extracted SELECTED Companies
                const comp_response = await companyService.fetchCompanies();
                setAllCompanies(comp_response);

                const formattedAllCompany = comp_response.map(item => ({
                    value: item.id,
                    label: item.COMPANY_NAME
                }));
                setFormattedAllCompany(formattedAllCompany);
            
                // Extracted ALL Roles

                const allRoles = await roleService.fetchRoles();
                setAllRoles(allRoles)

                const formattedAllRoles = allRoles.map(item => ({
                    value: item.id,
                    label:item.name
                }));

                setFormattedAllRoles(formattedAllRoles)

                //Extracted SELECTED Roles

                const selectRoles = await userService.fetchUsersById(response.username)
                console.log('selected',selectRoles)
                setSelectedRoles(selectRoles.groups)

                const formattedSelectRoles = selectRoles.groups.map(item => ({
                    value: item.id,
                    label:item.name
                }))

                setFormattedSelectRoles(formattedSelectRoles)
       
            } catch (error) {
                console.error('Error fetching users:', error);

            }
        };

        fetchUsersbyID();
    }, [username]);


    //CODE TO UPDATE THE USER RECORD
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const userDataWithRoles = {
                ...userData,
                groups: formattedSelectRoles.map(role => role.value),
            };
            const response = await userService.updateUser(username, userDataWithRoles);

            const companyIdArray = formattedSelectedCompanies.map(company => (company.value));
            const userroleData = {
                COMPANY_ID: companyIdArray,
                USERNAME: response.id
            };

            const updateUserRole = await userrolesService.update(response.id,userroleData);
            setSnackbarMessage('Successfully updated user record');
            setSnackbarSeverity('success');
            setSnackbarOpen(true); 

        } catch (error) {
            setSnackbarMessage('There was a problem updating user record');
            setSnackbarSeverity('error');
            setSnackbarOpen(true); 

        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };
 
    const [selectedCompany, setSelectedCompany] = useState([]);

    const handleCompanyChange = (selectedCompany) => {
        setFormattedSelectedCompanies(selectedCompany);
    };

    const handleRoleChange = (selectedRole) => {
        setFormattedSelectRoles(selectedRole);
    };
    

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
                    <mui.Link underline="hover" color="inherit" href="/ManageUsers">
                        Manage Users
                    </mui.Link>
                    <mui.Typography color="text.primary">
                        {users.first_name ? `${users.first_name} ${users.last_name}` : users.username}
                    </mui.Typography>

                </mui.Breadcrumbs>

                <SearchAppBar title={users.first_name ? `${users.first_name} ${users.last_name}` : users.username} icon={<DynamicAvatarList names={`${users.first_name} ${users.last_name}`} />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage access and company assignment
                </mui.Typography>

                <Separator />

                <mui.Typography sx={{ marginTop: '20px' }} variant="h6" gutterBottom>
                    User Information:
                </mui.Typography>

                <NormalTextField
                    label="Username"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    required

                />

                <NormalTextField
                    label="First Name"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleChange}
                    required
                />

                <NormalTextField
                    label="Last Name"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleChange}
                    required
                />

                <NormalTextField
                    label="Email Address"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                />
                <Separator />
                <mui.Typography sx={{ marginTop: '20px' }} variant="h6" gutterBottom>
                    Company Assignment:
                </mui.Typography>

                <div style={{ marginTop: '18px' }}>
                    <MultipleSelect
                        isMultiSelect={true}
                        selectedValue={formattedSelectedCompanies}
                        placeholderText="Select Company*"
                        selectOptions={formattedAllCompany} 
                        selectedOptions={formattedSelectedCompanies}
                        handleChange={handleCompanyChange}
                    />
                </div>

                <Separator />

                <mui.Typography sx={{ marginTop: '20px' }} variant="h6" gutterBottom>
                    Assiged Roles:
                </mui.Typography>

                <div style={{ marginTop: '18px' }}>
                    <MultipleSelect
                        isMultiSelect={true}
                        defaultValue={formattedSelectedCompanies}
                        placeholderText="Select Company*"
                        selectOptions={formattedAllRoles}
                        selectedOptions={formattedSelectRoles}
                        handleChange={handleRoleChange}
                    />
                </div>

                <mui.Button onClick={handleUpdateUser} sx={{marginTop: '50px' }} color="primary" variant="contained">
                    Update Record
                </mui.Button>

               {users.is_active ? (
                    <mui.Button
                    onClick={handleUpdateUser} // Replace handleDisableUser with your actual handler function
                    sx={{ marginTop: '50px', marginLeft: '10px' }}
                    color="primary"
                    variant="contained"
                    >
                    Disable User
                    </mui.Button>
                ) : null}

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

export default ManageUsersDetails;
