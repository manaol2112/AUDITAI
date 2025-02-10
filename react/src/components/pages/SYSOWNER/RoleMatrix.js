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
import DynamicTabs from '../../common/DynamicTabs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import LaunchIcon from '@mui/icons-material/Launch';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LinkIcon from '@mui/icons-material/Link';
import AddLinkIcon from '@mui/icons-material/AddLink';
import Modal from '../../common/Modal';
import MultipleSelect from '../../common/MultipleSelect';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';


const DataTable = React.lazy(() => import('../../common/DataGrid'));

const RoleMatrix = () => {

    const [app, setApp] = useState([]);
    const [roles, setRoles] = useState([]);
    const [roleOwnerData, setRoleOwnerdata] = useState([]);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [roleOwnerList, setRoleOwnerList] = useState([]);
    const [selectedOwners, setSelectedOwners] = useState({});
    const [assignedOwner, setAssignedOwner] = useState({});

    const [selectedRole, setSelectedRole] = useState({});
    const [saved, setSaved] = useState(false);

    const [unassignedCount, setunassignedCount] = useState(0);
    const [roleData, setRoleData] = useState({});


    const [openMappingModal, setOpenMappingModal] = useState(false);

    const handleOpenMappingModal = () => {
        setOpenMappingModal(true);
    };

    const handleCloseMappingModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenMappingModal(true)
        }
        else {
            setOpenMappingModal(false);
        }
    };

    const [mappedRoles, setMappedRoles] = useState([]);


    const isRoleOwnerCreatedRef = useRef(false);

    useEffect(() => {
        // Declare async functions within the effect
        const fetchRoles = async () => {
            try {

                const existingRoleOwners = await roleService.fetchRoleOwnersByApp(id);

                setMappedRoles(existingRoleOwners)
                // Check if RoleOwners have already been created
                if (isRoleOwnerCreatedRef.current) {
                    console.log('Role owners have already been created. Skipping...');
                    return;  // Skip if the RoleOwners have already been created
                }

                // Fetch roles
                const roles = await appService.fetchAppsRecordById(id);

                const existingRoleNames = new Set(existingRoleOwners.map(owner => owner.ROLE_NAME));
                
                const filteredRoles = roles.filter(role => !existingRoleNames.has(role.ROLE_NAME));

                if (Array.isArray(filteredRoles)) {
                    const roleNames = [...new Set(filteredRoles.map(item => item.ROLE_NAME))];

                    // Format role names for state
                    const formattedRoleNames = roleNames.map(item => ({
                        value: item,
                        label: item,
                    }));

                    setunassignedCount(formattedRoleNames.length)
                    setRoles(formattedRoleNames);
                }

            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        const fetchApp = async () => {
            try {
                const app = await appService.fetchAppsById(id);
                setApp(app);

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
                }
            } catch (error) {
                console.error('Error fetching role owner:', error);
            }
        };

        // Fetch data only if `id` is defined, or if `saved` has changed
        if (id || saved) {
            fetchRoles();
            fetchApp();
            fetchRoleOwner();

            // Reset `saved` state after fetching
            if (saved) {
                setSaved(false);
            }
        }

    },  [saved]);


    // Define the columns for the table
    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'ROLE_NAME', headerName: 'Role Name', flex: .5 },
    ];

    const mappedcolumns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'ROLE_NAME', headerName: 'Role Name', flex: .5 },
        { field: 'ROLE_OWNER', headerName: 'Current Role Owner', flex: 1 },
    ];

    const rows = roles.map((app, index) => {
 
        return {
        id: index + 1,
        ROLE_NAME: app.value || '-',
        ROLE_OWNER: app.roleOwner || '', 
        }
    });

    const mappedrows = mappedRoles.map((role, index) => {
     
        const matchedOwner = roleOwnerList.find(owner => role.ROLE_OWNERS === owner.value);
        
        return {
            id: index + 1,  // Unique ID for each row
            ROLE_NAME: role.ROLE_NAME || '-',  // Default to '-' if ROLE_NAME is undefined
            ROLE_OWNER: matchedOwner ? `${matchedOwner.label}` : '-',  // Concatenate first name
        };
    });


    const theme = createTheme({
        palette: {
            primary: {
                main: '#4caf50', // Orange color
            },
            secondary: {
                main: '#4caf50', // Green color
            },
        },
    });

    const renderUpdateMapping = (params) => {

        const role = params.row;

        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="Update Owner" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleMappingClick(event, role)}
                    >
                        <ManageAccountsIcon sx={{ fontSize: '18px' }} />
                    </mui.IconButton>
                </Tooltip>
            </ThemeProvider>
        );

    };

    const handleMappingClick = (event, role) => {
        setSelectedRole(role);

        let data = {
            APP_NAME: '',
            ROLE_NAME: '',
            ...Object.keys(roleOwnerData).reduce((acc, key) => {
                acc[key] = '';
                return acc;
            }, {}),
        };

        data = {
            ...data,
            APP_NAME: id,
            ROLE_NAME: role.ROLE_NAME,
        };

        setRoleOwnerdata(data)

        setOpenMappingModal(true)
    };

    const renderMapping = (params) => {
        const role = params.row;

        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="Assign Owner" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleMappingClick(event, role)}
                    >
                        <AddLinkIcon sx={{ fontSize: '18px' }} />
                    </mui.IconButton>
                </Tooltip>
            </ThemeProvider>
        );
    };

    const columnsWithActionsUpdate = [
        ...mappedcolumns,
        {
            headerName: 'Update Owner',
            width: 200,
            sortable: false,
            renderCell: renderUpdateMapping,
        },
    ];

    const columnsWithActions = [
        ...columns,
        {
            headerName: 'Role Owner',
            width: 200,
            sortable: false,
            renderCell: renderMapping,
        },
    ];

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
          right: '2px',
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }));

    const tabs = [
        {
            value: '1',
            label: (<div>
                Role Assignment
            </div>),
            content: (
                <div>

                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={mappedrows}
                            columns={mappedcolumns}
                            columnsWithActions={columnsWithActionsUpdate}
                        />
                    </Suspense>

                </div>
            ),
        },

        {
            value: '2',
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    Unassigned
                    <IconButton aria-label="cart" style={{ marginLeft: '8px' }}>
                        <StyledBadge badgeContent={unassignedCount} color="primary">
                        </StyledBadge>
                    </IconButton>
                </div>
            ),
            content: (
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={rows}
                            columns={columns}
                            columnsWithActions={columnsWithActions}
                        />
                    </Suspense>
                </div>
            ),
        },
    ]

    const handleRoleOwnerSelect = (selectedOptions) => {

        const roleowner = selectedOptions.value;

        setAssignedOwner(roleowner)

        setSelectedOwners(selectedOptions)

        const updatedData = {
            ...roleOwnerData,
            ROLE_OWNERS: roleowner
        };

        console.log('Data with role owner', updatedData)

        setRoleData(updatedData)
    };

    const saveChanges = async () => {

        try {

        const recordExist = await roleService.fetchRoleOwnerById(id, selectedRole.ROLE_NAME)

        if (recordExist && recordExist.length > 0)  {

            const updateMapping = await roleService.updateRoleOwner(recordExist[0].id, roleData);
            console.log('Role owner data', roleData)

        } else {
            const roleMapping = await roleService.createRoleOwner(roleData)
        }

         setSaved(true);
         setSelectedOwners([])
         handleCloseMappingModal()
          
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

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

                <DynamicTabs tabs={tabs} />

                <Modal
                    open={openMappingModal}
                    size={'sm'}
                    onClose={handleCloseMappingModal}
                    body={
                        <div style={{ height: '250px', display: 'flex', flexDirection: 'column' }}>
                            <mui.Typography variant="subtitle2" sx={{ marginBottom: '20px' }}>
                                Role Owner:
                            </mui.Typography>

                            <MultipleSelect
                                isMultiSelect={false}
                                placeholderText="Select Role Owner"
                                selectedOptions={selectedOwners}
                                selectOptions={roleOwnerList}
                                value={selectedOwners}
                                handleChange={handleRoleOwnerSelect}
                            />
                        </div>
                    }
                    footer={
                        <>
                            <mui.Button onClick={handleCloseMappingModal} color="primary">
                                Cancel
                            </mui.Button>
                            <mui.Button onClick={saveChanges} color="primary" variant="contained">
                                Confirm
                            </mui.Button>
                        </>
                    }
                />




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
