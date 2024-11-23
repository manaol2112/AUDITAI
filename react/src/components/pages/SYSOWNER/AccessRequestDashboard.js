import React, { useState, useEffect, useRef, Suspense } from 'react';
import SysOwnerSideBar from './SysOwnerSidebar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import userService from '../../../services/UserService';
import appService from '../../../services/ApplicationService';
import OutlinedCard from '../../common/MediaCard';
import Separator from '../../layout/Separator';
import companyService from '../../../services/CompanyService';
import ErrorBoundary from '../../common/ErrorBoundery';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DynamicTabs from '../../common/DynamicTabs';
import MultipleSelect from '../../common/MultipleSelect';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import NormalTextField from '../../common/NormalTextField';
import HRService from '../../../services/HrService';
import RequestService from '../../../services/RequestService';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import { validate as isValidUUID } from 'uuid';

// Now you can use isValidUUID to validate UUIDs


const AccessRequestDashboard = () => {

    const [users, setUsers] = useState([]);
    const [apps, setApps] = useState([]);
    const [rolesSelection, setRolesSelection] = useState([]);
    const [emailSelection, setEmailSelection] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [requestor, setRequestor] = useState([]);
    const [approver, setApprover] = useState([]);
    const [requesttype, setRequestType] = useState([]);
    const [approverList, setApproverList] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);

    const [accessRequestData, setAccessRequestData] = useState([]);
    const [accessApproverData, setAccessApproverData] = useState([]);

    const [systemSelection, setSystemSelection] = useState([]);
    const [selectedSystem, setSelectedSystem] = useState([]);

    const saveTimeout = useRef(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppList = async () => {
            try {

                const appList = await appService.fetchApps()

                if (appList) {

                    const apps = appList.map(item => ({
                        value: item.id,
                        label: `${item.APP_NAME} (${item.COMPANY_NAME})`
                    }));

                    setSystemSelection(apps)

                }

            } catch (error) {
                console.error(`Error fetching application data: ${error.message}`);
            }
        };

        const fetchHRList = async () => {
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

                    setEmailSelection(email);
                }
            } catch (error) {
                console.error(`Error fetching HR data: ${error.message}`);
            }
        };

        fetchAppList();

        fetchHRList();

        // Empty dependency array ensures this effect runs only once on mount
    }, []);

    const handleRoleChange = (selectedOptions) => {

        const selectedRoles = selectedOptions.map(option => option.value);

        const rolesString = selectedRoles.join(',');

        setSelectedRoles(selectedOptions)

        const updatedData = {
            ...accessRequestData,
            ROLES: rolesString
        };

        setAccessRequestData(updatedData);

    };

    const handleRequestor = (selectedOptions) => {

        const requestor = selectedOptions.map(option => option.value);

        const requestorString = requestor.join(',');

        setRequestor(selectedOptions)

        const updatedData = {
            ...accessRequestData,
            REQUESTOR: requestorString
        };

        setAccessRequestData(updatedData);

        setApproverList([])
        setApprover([])

        // Filter the emailSelection to remove any items whose value is in the requestor array
        const approverList = emailSelection.filter(item => !requestor.includes(item.value));
        setApproverList(approverList);

    };

    const handleApprover = (selectedOptions) => {

        const approver = selectedOptions.map(option => option.value);
        const approverString = requestor.join(',');

        setApprover(selectedOptions)

        const updatedData = {
            ...accessApproverData,
            APPROVER: approver
        };

        setAccessApproverData(updatedData);

    };

    const handleRequestType = (selectedOptions) => {
        const requesttype = selectedOptions.value;

        setRequestType(selectedOptions)

        const updatedData = {
            ...accessRequestData,
            REQUEST_TYPE: requesttype
        };

        setAccessRequestData(updatedData);

    };

    const handleComments = (e) => {
        const { name, value } = e.target;

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }
        const updatedData = {
            ...accessRequestData,
            [name]: value
        };

        setAccessRequestData(updatedData);

    };

    const handleCommentsBlur = (e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...accessRequestData,
            [name]: value
        };

        setAccessRequestData(updatedData)
    };


    const handleSystemSelectionChange = async (selectedOptions) => {
        const selectedSystem = selectedOptions.value;

        console.log(selectedSystem)

        // Update the selected system state
        setSelectedSystem(selectedOptions);

        const updatedData = {
            ...accessRequestData,
            APP_NAME: selectedSystem,
        };

        try {

            const roles = await appService.fetchAppsRecordById(selectedSystem);
            if (roles) {

                if (roles && Array.isArray(roles)) {
                    const roleNames = [...new Set(roles.map(item => item.ROLE_NAME))];

                    const formattedRoleName = roleNames.map(item => ({
                        value: item,
                        label: item,
                    }));

                    setRolesSelection([])

                    setRolesSelection(formattedRoleName);

                }
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }

        setAccessRequestData(updatedData);

    };

    const submitRequest = async (e) => {
        e.preventDefault();
        try {

            const response = await RequestService.fetchRequestID();
            const now = new Date().toISOString();

            if (response) {

                if (requesttype.value === 'Pending Approval') {

                    const updatedData = {
                        ...accessRequestData,
                        
                        REQUEST_ID: 'REQ_ID#' + response.request_id_counter,
                        DATE_REQUESTED: now,
                        STATUS: 'Pending Approval',
                        LAST_MODIFIED: now
                    };

                    const request = await RequestService.createRequest(updatedData)

                    const approvers = approver; // This is your array of approvers, each having a 'value' field with the UUID

                // Iterate through the approvers and create a separate approval record for each one
                for (const approver of approvers) {
                    const approverUUID = approver?.value; // Extract the UUID from the 'value' field

                    // Validate if the approver's UUID is valid
                    if (!isValidUUID(approverUUID)) {
                        console.error(`Invalid UUID for approver: ${approverUUID}`);
                        continue; // Skip if the UUID is invalid
                    }

                    // Define approverData for each approver separately
                    const approverData = {
                        ...approver,
                        APPROVER: accessApproverData.APPROVER, // Assuming this is the global access approver
                        APPROVED_BY: approverUUID, // Store the UUID in the APPROVED_BY field
                        REQUEST_ID: request?.id,
                        DATE_REQUESTED: now,
                        STATUS: 'Pending Approval',
                        LAST_MODIFIED: now
                    };

                    // Create approval record for the current approver
                    const approval = await RequestService.createApproval(approverData);

                    // Send email after creating approval record
                    if (approval) {
                        const sendmail = await RequestService.sendEmailApproval(approverData);
                    }

                  
                }
                
                  window.location.href = `/accessrequest/success/${request.id}`;

                } else if (requesttype.value === 'Pre-Approval') {

                    const updatedData = {
                        ...accessRequestData,
             
                        REQUEST_ID: 'REQ_ID#' + response.request_id_counter,
                        DATE_REQUESTED: now,
                        STATUS: 'Approved',
                        LAST_MODIFIED: now
                    };

                    const request = await RequestService.createRequest(updatedData)

                    const approvers = approver;
                    
                    for (const approver of approvers) {

                        const approverUUID = approver?.value; // Extract the UUID from the 'value' field

                        // Validate if the approver's UUID is valid
                        if (!isValidUUID(approverUUID)) {
                            console.error(`Invalid UUID for approver: ${approverUUID}`);
                            continue; // Skip if the UUID is invalid
                        }

                        const approverData = {
                            ...approver,
                            APPROVER: accessApproverData.APPROVER, // Assuming this is the global access approver
                            APPROVED_BY: approverUUID, // Store the UUID in the APPROVED_BY field
                            REQUEST_ID: request?.id,
                            DATE_REQUESTED: now,
                            STATUS: 'Approved', // Or adjust the status as needed
                            LAST_MODIFIED: now,
                            DATE_APPROVED: now

                        };

                        const approval = await RequestService.createApproval(approverData);

                        if (approval) {
                            const sendmail = await RequestService.sendEmailApproval(approverData)
                        }

                    }

                    window.location.href = `/accessrequest/success/${request.id}`;
                }
                else {
                    console.error('No request ID returned from API');
                }
            }

        } catch (error) {
            console.error('Error generating request ID:', error);
        }
    };

    const requestTypeSelection = [
        { value: 'Pre-Approval', label: 'Pre-Approved Request' },
        { value: 'Pending Approval', label: 'Requires Approval' },
    ];


    const customMainContent = (
        <div>
            <ResponsiveContainer>
              
                <SearchAppBar title="Access Request Form" icon={<DashboardIcon />} />

                <Separator />

                <mui.Paper sx={{ padding: '20px' }}>

                    <mui.Box sx={{ margin: '20px' }}>

                        <mui.Typography variant="subtitle2">
                            Request Type:
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                placeholderText="Select System"
                                selectedOptions={requesttype}
                                selectOptions={requestTypeSelection}
                                value={requesttype}
                                handleChange={handleRequestType}
                            />

                        </div>

                        <mui.Typography variant="subtitle2">
                            System Name:
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                placeholderText="Select System"
                                selectedOptions={selectedSystem}
                                selectOptions={systemSelection}
                                value={selectedSystem}
                                handleChange={handleSystemSelectionChange}
                            />

                        </div>

                        <mui.Typography variant="subtitle2">
                            Role Name:
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Role"
                                selectedOptions={selectedRoles}
                                selectOptions={rolesSelection}
                                value={selectedRoles}
                                handleChange={handleRoleChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                            Role Assignee:
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Requestor"
                                selectedOptions={requestor}
                                selectOptions={emailSelection}
                                value={requestor}
                                handleChange={handleRequestor}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                            Approver:
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Approver"
                                selectedOptions={approver}
                                selectOptions={approverList}
                                value={approver}
                                handleChange={handleApprover}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                            Comments:
                        </mui.Typography>

                        <NormalTextField
                            name="COMMENTS"
                            value={accessRequestData.COMMENTS}
                            onChange={handleComments}
                            onBlur={handleCommentsBlur}
                            isMultiLine={true}
                            rows={5}
                        />

                        <mui.Button sx={{ marginLeft: 'auto', display: 'block', marginTop: '20px' }} onClick={submitRequest} color="primary" variant="contained">
                            Submit Request
                        </mui.Button>


                    </mui.Box>

                </mui.Paper>


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

export default AccessRequestDashboard;
