import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import { useParams } from 'react-router-dom';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import ResponsiveContainer from '../../layout/Container';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import roleService from '../../../services/RoleService';
import PermissionTable from '../../common/PermissionTable';

const RoleDetails = () => {

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    const { roleId } = useParams();

    const [roles, setRoleData] = useState({
        name: '', 
    });

    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await roleService.fetchRolesByID(roleId);
                setRoleData(response); 
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        if (roleId) {
            fetchRoles();
        }
    }, [roleId]);

    const navigate = useNavigate();

    const handleAssignPerm = async (e) => {
        e.preventDefault();
        console.log('Selected Permissions:', selectedPermissions);
        
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
                    <mui.Link underline="hover" color="inherit" href="/SystemRoles">
                        Roles and Permission
                    </mui.Link>
                    <mui.Typography color="text.primary">{roles.name}</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title={`${roles.name} Permissions`} icon={<ManageAccountsIcon />} />

                
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Create, manage, and update roles and permissions
                </mui.Typography>

                <Separator />

                <PermissionTable
                    selectedPermissions={selectedPermissions}
                    setSelectedPermissions={setSelectedPermissions}
                />

               <mui.Button sx={{marginTop: '16px'}} variant="contained" size="small" onClick={handleAssignPerm} color="primary">Save Changes</mui.Button>

            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>
    );
}

export default RoleDetails;
