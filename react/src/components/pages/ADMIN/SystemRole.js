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
import roleService from '../../../services/RoleService';
import OutlinedCard from '../../common/MediaCard';
import GrainIcon from '@mui/icons-material/Grain';
import NormalTextField from '../../common/NormalTextField';
import permissionService from '../../../services/PermissionService';
import ExtensionIcon from '@mui/icons-material/Extension';
import DynamicSnackbar from '../../common/Snackbar';



const SystemRoles = () => {

    const navigate = useNavigate();
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const [roles, setRoles] = useState([]);

    const [newrole, setNewRoles] = useState({
        name: ''
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    
    const [perm, setPerm] = useState([]);

    const fetchPermission = async () => {
        try {
            const response = await permissionService.fetchPermission(); 
            setPerm(response); 
          } catch (error) {
            console.error('Error fetching permission:', error);
          }
    };

    useEffect(() => {
        fetchPermission();
    }, []);


    const [checked, setChecked] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRoles({ ...newrole, [name]: value });
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

    const createRoles = async (e) => {
        e.preventDefault();
        try {
        const response = await roleService.createRoles(newrole);
        setRoles([...roles, response]);
        setSnackbarMessage('Role successfully created');
        setSnackbarSeverity('success');
        setSnackbarOpen(true); 
        handleCloseCreateModal()
       
        } catch (error) {
        setSnackbarMessage('There was a problem creating a new role');
        setSnackbarSeverity('error');
        setSnackbarOpen(true); 
        }

  };

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';


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
                    <mui.Typography color="text.primary">Roles and Permission</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage System Roles" icon={<ExtensionIcon />} />
                
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Create, manage, and update roles and permissions
                </mui.Typography>

                <Separator />

                <mui.Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={3}
                >
                    {roles.map(role => (
                        <mui.Grid item key={role.id}>
                            <OutlinedCard
                                icon={<GrainIcon sx={{fontSize: '35px'}} />}
                                title={role.name}
                                to={`/SystemRoles/${role.id}`}
                                buttonlabel={<React.Fragment>
                                    View Permissions
                                </React.Fragment>}
                            />
                        </mui.Grid>
                    ))}
                    
                </mui.Grid>

                <CustomSpeedDial onClick={handleOpenCreateModal} />

                <Modal
                    open={openCreateModal}
                    onClose={handleCloseCreateModal}
                    header="Setup New Role"
                    body={
                        <>
                            <NormalTextField
                                label="Role Name"
                                name="name"
                                value={newrole.name}
                                onChange={handleChange} 
                                required 
                            />
                           
                        </>
                    }
                    footer={
                        <>
                            <mui.Button onClick={handleCloseCreateModal} color="primary">
                                Cancel
                            </mui.Button>
                            <mui.Button onClick={createRoles} color="primary" variant="contained">
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

export default SystemRoles;
