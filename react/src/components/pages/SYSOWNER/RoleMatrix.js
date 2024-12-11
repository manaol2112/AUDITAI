import React, { useState, useEffect, useRef, Suspense } from 'react';
import SysOwnerSideBar from './SysOwnerSidebar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import ErrorBoundary from '../../common/ErrorBoundery';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useParams } from 'react-router-dom';
import appService from '../../../services/ApplicationService';
import HRService from '../../../services/HrService';
import Select from 'react-select'; // Import react-select
import './styles.css'; 
import roleService from '../../../services/RoleService';

const DataTable = React.lazy(() => import('../../common/DataGrid'));

const RoleMatrix = () => {

    const [app, setApp] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [roleOwnerList, setRoleOwnerList] = useState([]);
    const [selectedOwners, setSelectedOwners] = useState({});


    useEffect(() => {

        const fetchRoles = async () => {
            try {
                // Fetch the roles
                const roles = await appService.fetchAppsRecordById(id);
        
                if (Array.isArray(roles)) {
                    // Extract unique role names
                    const roleNames = [...new Set(roles.map(item => item.ROLE_NAME))];
        
                    // Check and create RoleOwners if they don't exist
                    const roleOwnerData = await Promise.all(
                        roleNames.map(async (roleName) => {
                            try {
                                // Step 1: Check if the RoleOwner already exists
                                const existingRoleOwner = await roleService.fetchRoleOwnerById(id, roleName);
                            
                                // If RoleOwner exists, skip creation
                                if (!(existingRoleOwner && existingRoleOwner.length > 0)) {
                            
                                    // Step 2: Create a new RoleOwner if it doesn't exist
                                    console.log(`Creating RoleOwner for ROLE_NAME "${roleName}".`);
                            
                                    const data = {
                                        APP_NAME: id,
                                        ROLE_NAME: roleName,
                                    };
                            
                                    // Create the new RoleOwner and return the response
                                    return await roleService.createRoleOwner(data);
                                } else {
                                    console.log(`RoleOwner already exists for ROLE_NAME "${roleName}".`);
                                }
                            } catch (error) {
                                console.error(`Error checking or creating RoleOwner for ROLE_NAME "${roleName}":`, error);
                                return null;  // Handle error, return null or an error object
                            }
                            
                        })
                    );
        
                    // Step 3: Create formatted role names for setting the state
                    const formattedRoleName = roleNames.map(item => ({
                        value: item,
                        label: item,
                    }));
        
                    // Set state for roles
                    setRoles(formattedRoleName);
                }
        
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };
        

        const fetchApp = async () => {
            try {
                const app = await appService.fetchAppsById(id);
                setApp(app)

            } catch (error) {
                console.error('Error fetching applist:', error);
            }
        };

        const fetchRoleOwner = async () => {
            try {
                const hrList = await HRService.fetchHRRecordByEmail();

                if (hrList) {
                    // Use a Set to store unique emails
                    const uniqueEmailList = Array.from(
                        new Map(
                            hrList.map(item => [item.EMAIL_ADDRESS, item]) 
                        ).values()
                    );

                    const email = uniqueEmailList.map(item => ({
                        value: item.id,
                        label: `${item.FIRST_NAME} ${item.LAST_NAME}  (${item.EMAIL_ADDRESS})`
                    }));

                    setRoleOwnerList(email);

                    console.log('This is the role owner list', email)
                }

            } catch (error) {
                console.error('Error fetching role owner:', error);
            }
        };

        fetchRoles();
        fetchApp()
        fetchRoleOwner()

    }, []);

    // Handle the role owner change event
  const handleRoleOwnerChange = (e, rowId) => {
    const selectedRoleOwner = e.target.value;
    setSelectedOwners(prevState => ({
      ...prevState,
      [rowId]: selectedRoleOwner, 
    }));
  };

// Define the columns for the table
const columns = [
    { field: 'id', headerName: '#', width: 50 },
    { field: 'ROLE_NAME', headerName: 'Role Name', flex: 1 },
    {
      field: 'ROLE_OWNER',
      headerName: 'Role Owner',
      flex: 1,
      renderCell: (params) => {
        const rowId = params.row.ROLE_NAME;
        // Use selected owner from the state or the initial value if not selected
        const roleOwner = selectedOwners[rowId] || params.row.ROLE_OWNER;

        return (
          <select
            value={roleOwner || ''}
            onChange={(e) => handleRoleOwnerChange(e, rowId)}
          >
            <option value="">Select Owner</option>
            {roleOwnerList.map((hr) => (
              <option key={hr.value} value={hr.value}>
                {hr.label}
              </option>
            ))}
          </select>
        );
      }
    },
  ];

    const rows = roles.map((app, index) => ({
        id: index + 1,
        ROLE_NAME: app.value || '-',
        ROLE_OWNER: app.roleOwner || '', // Adding ROLE_OWNER here (could be blank or initial value)
    }));

    const columnsWithActions = [
        ...columns,
    ];


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
                    <mui.Typography color="text.primary"> Role Matrix </mui.Typography>
                    <mui.Typography color="text.primary"> {app?.APP_NAME} </mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage Role Ownership" icon={<AssignmentIndIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    View and manage role ownership and responsibilities
                </mui.Typography>

                <Separator />

                <Suspense fallback={<div>Loading...</div>}>
                    <DataTable
                        rows={rows}
                        columns={columns}
                        columnsWithActions={columnsWithActions}
                    />
                </Suspense>

            </ResponsiveContainer>
        </div>
    )

    return (
        <ErrorBoundary fallback={<p>Failed to load data.</p>} error={error}>
            <Suspense fallback="Loading...">
                <div>
                    <SysOwnerSideBar mainContent={customMainContent} />
                </div>
            </Suspense>
        </ErrorBoundary>
    );
};

export default RoleMatrix;
