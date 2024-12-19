import React, { useState, useEffect, Suspense } from 'react';
import SysOwnerSideBar from './SysOwnerSidebar';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import GridViewIcon from '@mui/icons-material/GridView';
import Paper from '@mui/material/Paper';
import { styled, alpha } from '@mui/material/styles';
import appService from '../../../services/ApplicationService';
import userService from '../../../services/UserService';
import companyService from '../../../services/CompanyService';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LaunchIcon from '@mui/icons-material/Launch';
import DynamicTabs from '../../common/DynamicTabs';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import policyService from '../../../services/PoliciesService';
import appPasswordService from '../../../services/PasswordService';
import DonutChart from '../../common/DonutChart';
import Modal from '../../common/Modal';
import NormalTextField from '../../common/NormalTextField';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { gridColumnVisibilityModelSelector } from '@mui/x-data-grid';

const DataTable = React.lazy(() => import('../../common/DataGrid'));

const SysOwnerCompliance = () => {

    const [apps, setApps] = useState([]);

    const [appsProvisioning, setAppsProvisioning] = useState([]);
    const [appsTermination, setAppsTermination] = useState([]);
    const [incompleteSetupAuth, setIncompleteSetupAuth] = useState([]);
    const [withExceptions, setWithExceptions] = useState([]);
    const [withProvExceptions, setWithProvExceptions] = useState([]);
    const [authCount, setAuthCount] = useState([]);
    const [authPolicyViolationCount, setAuthPolicyViolationCount] = useState([]);
    const [authIncompleteCount, setAuthIncompleteCount] = useState([]);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [openProvisioningModal, setOpenProvisioningModal] = useState(false);
    const [openTerminationModal, setOpenTerminationModal] = useState(false);
    const [passwordRows, setPasswordRows] = useState([]);
    //PROVISIONING
    const [provisioningRowDetails, setProvisioningRowsDetails] = useState([]);
    const [provisioningMissingDocsRowDetails, setProvisioningMissingDocsRowsDetails] = useState([]);
    const [provisioningLateApprovalRowDetails, setProvisioningLateApprovalRowsDetails] = useState([]);
    //TERMINATION
    const [terminationRowDetails, setTerminationRowsDetails] = useState([]);
    const [terminationLateRemovalDetails, setTerminationLateRemovalRowsDetails] = useState([]);

    // PROVISIONING DONUTS
    const [provNoDocCount, setProvNoDocCount] = useState([]);
    const [provLateCount, setProvLateCount] = useState([]);

    //TERMINATION DONUT
    const [lateremovalCount, setLateRemovalCount] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentUser = await userService.fetchCurrentUser()
                if (currentUser) {
                    const assignedApps = await appService.fetchAppsByOwner(currentUser.id)

                    if (assignedApps) {

                        setApps(assignedApps);

                        //GET ALL THE PASSWORD DATA
                        const passwordPolicyPromises = assignedApps.map(async (app) => {
                            if (app.id) {
                                try {
                                    return { id: app.id, policy: await appPasswordService.fetchAppPasswordByApp(app.id) };
                                } catch (err) {
                                    console.error('Error fetching policy for company ID', app.COMPANY_NAME, ':', err);
                                    return { id: app.id, policy: null };
                                }
                            } else {
                                return { id: app.id, policy: null };
                            }
                        });

                        const passwordPolicies = await Promise.all(passwordPolicyPromises);

                        if (passwordPolicies) {

                            const combinedDataMap = passwordPolicies.reduce((acc, { id, policy }) => {
                                acc[id] = {
                                    passwordPolicy: policy ? policy.pw_policy : null,
                                    passwordConfigured: policy ? policy.data : null,
                                    complianceStatus: policy ? policy.compliance_status : null,
                                };
                                return acc;
                            }, {});

                            // Enhance assignedApps with combined data
                            const appsWithCombinedData = assignedApps.map((app) => ({
                                ...app,
                                passwordPolicy: combinedDataMap[app.id]?.passwordPolicy || null,
                                passwordConfigured: combinedDataMap[app.id]?.passwordConfigured || null,
                                complianceStatus: combinedDataMap[app.id]?.complianceStatus || null
                            }));

                            // Set the combined data in state
                            setApps(appsWithCombinedData);

                            const statusValues = appsWithCombinedData.map(app => app.complianceStatus?.status).map(status => status === undefined ? 'undefined' : status);

                            const statusCounts = statusValues.reduce((counts, status) => {
                                counts[status] = (counts[status] || 0) + 1;
                                return counts;
                            }, {});

                            const formattedStatusCounts = Object.keys(statusCounts).map(status => ({
                                label: status === 'undefined' ? 'Incomplete Setup' : status,
                                value: statusCounts[status]
                            }));

                            setIncompleteSetupAuth(formattedStatusCounts)

                            setWithExceptions(formattedStatusCounts)

                            const statusesToCount = ['Needs Review', 'Incomplete Setup'];

                            const policyViolationTocount = ['Needs Review'];
                            const incompleteTocount = ['Incomplete Setup'];

                            const policyViolation = formattedStatusCounts
                                .filter(item => policyViolationTocount.includes(item.label))
                                .reduce((total, item) => total + item.value, 0);

                            setAuthPolicyViolationCount(policyViolation)

                            const incompleteSetup = formattedStatusCounts
                                .filter(item => incompleteTocount.includes(item.label))
                                .reduce((total, item) => total + item.value, 0);

                            setAuthIncompleteCount(incompleteSetup)
                            

                            const authcount = formattedStatusCounts
                                .filter(item => statusesToCount.includes(item.label))
                                .reduce((total, item) => total + item.value, 0);

                            setAuthCount(authcount)
                        }

                        //GET ALL PROVISIONING DATA

                        const provisioningDataPromises = assignedApps
                            .filter(app => app.id)  // Filter out apps without valid `id`
                            .map(async (app) => {
                                try {
                                    return { id: app.id, data: await appService.fetchAppsRecordByIdAndGrantDate(app.id) };
                                } catch (err) {
                                    console.error('Error fetching application record for', app.COMPANY_NAME, ':', err);
                                    return { id: app.id, data: null };
                                }
                            });

                        const provisioningData = await Promise.all(provisioningDataPromises);

                        if (provisioningData.length > 0) {

                            const combinedProvisioningDataMap = provisioningData.reduce((acc, { id, data }) => {
                                acc[id] = {
                                    data: data ? data : null,
                                };
                                return acc;
                            }, {});

                            // Enhance assignedApps with combined data
                            const appsWithCombinedProvisioningData = assignedApps.map((app) => ({
                                ...app,
                                data: combinedProvisioningDataMap[app.id]?.data || null,
                            }));

                            setAppsProvisioning(appsWithCombinedProvisioningData);

                        } else {
                            console.error('No provisioning data fetched');
                        }

                          //GET TERMINATION DATA

                        const terminationDataPromises = assignedApps
                          .filter(app => app.id)  // Filter out apps without valid `id`
                          .map(async (app) => {
                              try {
                                  return { id: app.id, data: await appService.fetchAppsRecordByIdAndRemoveDate(app.id) };
                              } catch (err) {
                                  console.error('Error fetching application record for', app.COMPANY_NAME, ':', err);
                                  return { id: app.id, data: null };
                              }
                          });

                        const terminationData = await Promise.all(terminationDataPromises);

                        if (terminationData.length > 0) {

                            const combinedTerminationDataMap = terminationData.reduce((acc, { id, data }) => {
                                acc[id] = {
                                    data: data ? data : null,
                                };
                                return acc;
                            }, {});

                            // Enhance assignedApps with combined data
                            const appsWithCombinedTerminationData = assignedApps.map((app) => ({
                                ...app,
                                data: combinedTerminationDataMap[app.id]?.data || null,
                            }));

                            setAppsTermination(appsWithCombinedTerminationData);

                        } else {
                            console.error('No provisioning data fetched');
                        }

                        console.log('This is the termination data', terminationData)
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();

    }, []);

    useEffect(() => {

        let totalUniqueApprovalCount = 0;
        let totalLateApprovalCount = 0;
        let totalLateRemovalCount = 0;
    
        appsProvisioning.forEach(app => {
          const dataLength = app.data.new_users_per_app.length;
    
          const uniqueApproval = app.data.with_approval.filter((value, index, self) => {
            return index === self.findIndex((t) => (
              t.email === value.email && t.role === value.role
            ));
          });
    
          const lateApproval = app.data.late_approval.filter((value, index, self) => {
            return index === self.findIndex((t) => (
              t.email === value.email && t.role === value.role
            ));
          });
    
          const uniqueApprovalCount = uniqueApproval.length;
          const noApproval = dataLength - uniqueApprovalCount;
          const lateApprovalCount = lateApproval.length;
    
          if (noApproval > 0) {
            totalUniqueApprovalCount += 1;
          }
    
          if (lateApprovalCount > 0) {
            totalLateApprovalCount += 1;
          }
        });
    
        setProvNoDocCount(totalUniqueApprovalCount);
        setProvLateCount(totalLateApprovalCount);

        //Termination

        appsTermination.forEach(app => {
           
            const lateRemoval = app.data.late_removal.filter((value, index, self) => {
              return index === self.findIndex((t) => (
                t.email === value.email && t.role === value.role
              ));
            });
      
            const lateRemovalCount = lateRemoval.length;
      
            if (lateRemovalCount > 0) {
                totalLateRemovalCount += 1;
            }
          });
      
          setLateRemovalCount(totalLateRemovalCount);

      }, [appsProvisioning, appsTermination]); 


    const allException = apps.map(status => ({
        label: status.complianceStatus,
        value: 0
    }));

    //DATA FOR AUTHENTICATION TABLE

    const columns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'APP_NAME', headerName: 'Application Name', flex: 1 },
        { field: 'COMPANY_NAME', headerName: 'Company', flex: 1 },
        { field: 'AUTHENTICATION_TYPE', headerName: 'Authentication Type', sortable: false, flex: 1 },
        { field: 'complianceStatus', headerName: 'Compliance Status', sortable: false, flex: 1 },
        { field: 'nonCompliantCount', headerName: 'Count', sortable: false, width: 1 },
        { field: 'nonCompliantFields', headerName: 'Field Names', sortable: false, flex: 1 },

    ];

    const rows = apps.map((app, index) => {
        const nonCompliantFields = app.complianceStatus?.non_compliant_fields;
        const nonCompliantCount = Array.isArray(nonCompliantFields) ? nonCompliantFields.length : 0;

        return {
            id: index + 1,
            APP_NAME: app.APP_NAME || '-',
            COMPANY_NAME: app.COMPANY_NAME || '-',
            AUTHENTICATION_TYPE: app.AUTHENTICATION_TYPE || '-',
            appID: app.id,
            geninfo: app.SETUP_GENINFO,
            userdata: app.SETUP_USERDATA,
            process: app.SETUP_PROCESS,
            complianceStatus: (app.complianceStatus && 'status' in app.complianceStatus && app.complianceStatus.status) ? app.complianceStatus.status : 'Needs Review',
            nonCompliantFields: Array.isArray(nonCompliantFields) ? nonCompliantFields.join(', ') : 'INCOMPLETE SETUP',
            nonCompliantCount: nonCompliantCount,
            passwordPolicy: app.passwordPolicy ? app.passwordPolicy : '',
            passwordConfigured: app.passwordConfigured ? app.passwordConfigured : ''

        };
    });


    //DATA FOR PROVISIONING TABLE SUMMARY

    const provisioningcolumns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'APP_NAME', headerName: 'Application Name', flex: 1 },
        { field: 'COMPANY_NAME', headerName: 'Company', flex: 1 },
        { field: 'TOTALGRANTED', headerName: 'New Roles/Users', sortable: false, flex: 1 },
        { field: 'NOAPPROVAL', headerName: 'No Approval', sortable: false, flex: 1 },
        { field: 'LATEAPPROVAL', headerName: 'Late Approval', sortable: false, flex: 1 },
        { field: 'COMPLIANCESTATUS', headerName: 'Compliance Status', sortable: false, flex: 1 },
    ];

    const provisioningrows = appsProvisioning.map((app, index) => {

        const dataLength = app.data.new_users_per_app.length;

        const uniqueApproval = app.data.with_approval.filter((value, index, self) => {
            return index === self.findIndex((t) => (
                t.email === value.email && t.role === value.role
            ));
        });

        const lateApproval = app.data.late_approval.filter((value, index, self) => {
            return index === self.findIndex((t) => (
                t.email === value.email && t.role === value.role
            ));
        });

        const uniqueApprovalCount = uniqueApproval.length;
        const noApproval = dataLength - uniqueApprovalCount
        const lateApprovalCount = lateApproval.length;
        const exceptionCount = noApproval + lateApprovalCount


        let complianceStatus

        if (exceptionCount > 0) {
            complianceStatus = "Needs Review"
        }

        return {
            id: index + 1,
            APP_NAME: app.APP_NAME || '-',
            COMPANY_NAME: app.COMPANY_NAME || '-',
            TOTALGRANTED: dataLength || '-',
            NOAPPROVAL: noApproval || '-',
            LATEAPPROVAL: lateApprovalCount || '-',
            COMPLIANCESTATUS: complianceStatus || '-',
            appID: app.id,
        };

    });

     //DATA FOR TERMINATION TABLE SUMMARY

     const terminationcolumns = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'APP_NAME', headerName: 'Application Name', flex: 1 },
        { field: 'COMPANY_NAME', headerName: 'Company', flex: 1 },
        { field: 'TOTALTERMINATED', headerName: 'Termed Users', sortable: false, flex: 1 },
        { field: 'STILL_ACTIVE', headerName: 'Still Active', sortable: false, flex: 1 },
        { field: 'LATEREMOVAL', headerName: 'Late Removal', sortable: false, flex: 1 },
        { field: 'COMPLIANCESTATUS', headerName: 'Compliance Status', sortable: false, flex: 1 },
    ];

    const terminationrows = appsTermination.map((app, index) => {

        const dataLength = app.data.removal_per_app.length;

        const uniqueremoval = app.data.removal_per_app.filter((value, index, self) => {
            return index === self.findIndex((t) => (
                t.email === value.email && t.role === value.role
            ));
        });

        const lateremoval = app.data.late_removal.filter((value, index, self) => {
            return index === self.findIndex((t) => (
                t.email === value.email && t.role === value.role
            ));
        });

        const uniqueremovalcount = uniqueremoval.length;
        const lateremovalcount = lateremoval.length;

        let complianceStatus

        if (lateremovalcount > 0) {
            complianceStatus = "Needs Review"
        }

        return {
            id: index + 1,
            APP_NAME: app.APP_NAME || '-',
            COMPANY_NAME: app.COMPANY_NAME || '-',
            TOTALTERMINATED: dataLength || '-',
            LATEREMOVAL: lateremovalcount || '-',
            COMPLIANCESTATUS: complianceStatus || '-',
            appID: app.id,
        };

    });

    //DATA FOR PROVISIONING TABLE DETAILS
   
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

    const [anchorEl, setAnchorEl] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState([]);

    const mapPasswordPolicyToRows = (configure, policy) => [
        createData('Password Length', policy.LENGTH, configure.LENGTH, configure.LENGTH >= policy.LENGTH ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningAmberIcon style={{ color: 'orange' }} />),
        createData('Password Age', policy.AGE, configure.AGE, configure.AGE <= policy.AGE ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningAmberIcon style={{ color: 'orange' }} />),
        createData('Password History', policy.HISTORY, configure.HISTORY, configure.HISTORY >= policy.HISTORY ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningAmberIcon style={{ color: 'orange' }} />),
        createData('Account Lockout Attempts', policy.LOCKOUT_ATTEMPT, configure.LOCKOUT_ATTEMPT, configure.LOCKOUT_ATTEMPT <= policy.LOCKOUT_ATTEMPT ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningAmberIcon style={{ color: 'orange' }} />),
        createData('Require Special Character', policy.SPECIAL_CHAR ? 'Yes' : 'No', configure.SPECIAL_CHAR ? 'Yes' : 'No', configure.SPECIAL_CHAR === policy.SPECIAL_CHAR ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningAmberIcon style={{ color: 'orange' }} />),
        createData('Require Upper Case', policy.UPPER ? 'Yes' : 'No', configure.UPPER ? 'Yes' : 'No', configure.UPPER === policy.UPPER ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningAmberIcon style={{ color: 'orange' }} />),
        createData('Require Lower Case', policy.LOWER ? 'Yes' : 'No', configure.LOWER ? 'Yes' : 'No', configure.LOWER === policy.LOWER ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningAmberIcon style={{ color: 'orange' }} />),
        createData('Require Number', policy.NUMBER ? 'Yes' : 'No', configure.NUMBER ? 'Yes' : 'No', configure.NUMBER === policy.NUMBER ? <CheckCircleIcon style={{ color: 'green' }} /> : <WarningAmberIcon style={{ color: 'orange' }} />),
    ];


    const handleClick = (event, app) => {
        setAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
        setSelectedApp(app);

        const matchingPolicy = app.passwordPolicy
        const matchingConfiguration = app.passwordConfigured

        if (matchingPolicy || matchingConfiguration) {

            const policyData = matchingPolicy || {};
            const configData = matchingConfiguration || {};
            const passwordRows = mapPasswordPolicyToRows(configData, policyData);
            setPasswordRows(passwordRows);

        } else {

            setPasswordRows([]);
        }

        setOpenPasswordModal(true)
    };

    const provisioningColumnsDetails = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'APP_NAME', headerName: 'Application Name', flex: 1 },
        { field: 'FIRST_NAME', headerName: 'First Name', flex: 1 },
        { field: 'LAST_NAME', headerName: 'Last Name', flex: 1 },
        { field: 'ROLE_NAME', headerName: 'Role', flex: 1 },
        { field: 'DATE_GRANTED', headerName: 'Date Granted', flex: 1 },
       
    ];

    const provisioningLateApprovalColumnsDetails = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'APP_NAME', headerName: 'Application Name', flex: 1 },
        { field: 'FIRST_NAME', headerName: 'First Name', flex: 1 },
        { field: 'LAST_NAME', headerName: 'Last Name', flex: 1 },
        { field: 'ROLE_NAME', headerName: 'Role', flex: 1 },
        { field: 'DATE_APPROVED', headerName: 'Date Approved', flex: 1 },
        { field: 'DATE_GRANTED', headerName: 'Date Granted', flex: 1 },   
    ];

    const terminationColumnsDetails = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'APP_NAME', headerName: 'Application Name', flex: 1 },
        { field: 'FIRST_NAME', headerName: 'First Name', flex: 1 },
        { field: 'LAST_NAME', headerName: 'Last Name', flex: 1 },
        { field: 'ROLE_NAME', headerName: 'Role', flex: 1 },
        { field: 'DATE_REVOKED', headerName: 'Date Removed', flex: 1 },
       
    ];

    const terminationLateRemovalColumnsDetails = [
        { field: 'id', headerName: '#', width: 50 },
        { field: 'APP_NAME', headerName: 'Application Name', flex: 1 },
        { field: 'FIRST_NAME', headerName: 'First Name', flex: 1 },
        { field: 'LAST_NAME', headerName: 'Last Name', flex: 1 },
        { field: 'ROLE_NAME', headerName: 'Role', flex: 1 },
        { field: 'HR_TERMED_DATE', headerName: 'HR Termed Date', flex: 1 },
        { field: 'SYSTEM_TERMED_DATE', headerName: 'System Removal Date', flex: 1 },   
    ];

    const handleProvisioningClick = (event, app) => {

        setAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
        setSelectedApp(app);

        // Filter the appsProvisioning array based on the selected app
        const filteredApps = appsProvisioning.filter(provisioningApp => provisioningApp.id === app.appID);

        console.log(filteredApps)

        const allNewUsers = filteredApps.map(provision => {
            return provision.data.new_users_per_app.map((user, index) => {
              return {
                id: index + 1,
                APP_NAME: provision.APP_NAME,
                FIRST_NAME: user.FIRST_NAME,
                LAST_NAME: user.LAST_NAME,
                EMAIL_ADDRESS: user.EMAIL_ADDRESS,
                ROLE_NAME: user.ROLE_NAME,
                DATE_GRANTED: user.DATE_GRANTED,
              };
            });
          }).flat();  // .flat() is used to flatten the array of arrays into a single array

        const missingDocuments = filteredApps.map(provision => {
            return provision.data.without_approval.map((user, index) => {
              return {
                id: index + 1,
                APP_NAME: provision.APP_NAME,
                FIRST_NAME: user.FIRST_NAME,
                LAST_NAME: user.LAST_NAME,
                ROLE_NAME: user.ROLE_NAME,
                DATE_GRANTED: user.DATE_GRANTED,
              };
            });
          }).flat();  // .flat() is used to flatten the array of arrays into a single array


        const lateApproval = filteredApps.map(provision => {
            return provision.data.late_approval.map((user, index) => {
              return {
                id: index + 1,
                APP_NAME: provision.APP_NAME,
                FIRST_NAME: user.FIRST_NAME,
                LAST_NAME: user.LAST_NAME,
                ROLE_NAME: user.ROLE_NAME,
                DATE_APPROVED: user.DATE_APPROVED,
                DATE_GRANTED: user.DATE_GRANTED,
              };
            });
          }).flat();  // .flat() is used to flatten the array of arrays into a single array


       
        // Set the filtered provisioning rows to be used in your modal
        setProvisioningRowsDetails(allNewUsers);
        setProvisioningMissingDocsRowsDetails(missingDocuments)
        setProvisioningLateApprovalRowsDetails(lateApproval)
        
        setOpenProvisioningModal(true)

    };

    const handleTerminationClick = (event, app) => {

        setAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
        setSelectedApp(app);

        // Filter the appsProvisioning array based on the selected app
        const filteredApps = appsTermination.filter(terminationApp => terminationApp.id === app.appID);

        const allTermedUsers = filteredApps.map(provision => {
            return provision.data.removal_per_app.map((user, index) => {
              return {
                id: index + 1,
                APP_NAME: provision.APP_NAME,
                FIRST_NAME: user.FIRST_NAME,
                LAST_NAME: user.LAST_NAME,
                EMAIL_ADDRESS: user.EMAIL_ADDRESS,
                ROLE_NAME: user.ROLE_NAME,
                DATE_REVOKED: user.DATE_REVOKED,
              };
            });
          }).flat();  // .flat() is used to flatten the array of arrays into a single array

        const lateRemoval = filteredApps.map(term => {
            return term.data.late_removal.map((user, index) => {
              return {
                id: index + 1,
                APP_NAME: term.APP_NAME,
                FIRST_NAME: user.FIRST_NAME,
                LAST_NAME: user.LAST_NAME,
                ROLE_NAME: user.ROLE_NAME,
                SYSTEM_TERMED_DATE: user.SYSTEM_TERMED_DATE,
                HR_TERMED_DATE:user.HR_TERMED_DATE
              };
            });
          }).flat();  // .flat() is used to flatten the array of arrays into a single array

        // Set the filtered provisioning rows to be used in your modal
        setTerminationRowsDetails(allTermedUsers);
        setTerminationLateRemovalRowsDetails(lateRemoval)
        
        setOpenTerminationModal(true)

    };


    const renderActionButton = (params) => {
        const app = params.row;

        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="View Details" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleClick(event, app)}
                    >
                        <LaunchIcon sx={{ fontSize: '18px' }} />
                    </mui.IconButton>
                </Tooltip>
            </ThemeProvider>
        );
    };

    const renderProvActionButton = (params) => {
        const app = params.row;

        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="View Details" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleProvisioningClick(event, app)}
                    >
                        <LaunchIcon sx={{ fontSize: '18px' }} />
                    </mui.IconButton>
                </Tooltip>
            </ThemeProvider>
        );
    };

    const renderTermActionButton = (params) => {
        const app = params.row;

        return (
            <ThemeProvider theme={theme}>
                <Tooltip title="View Details" arrow>
                    <mui.IconButton
                        sx={{ color: theme.palette.primary.main }}
                        size="small"
                        onClick={(event) => handleTerminationClick(event, app)}
                    >
                        <LaunchIcon sx={{ fontSize: '18px' }} />
                    </mui.IconButton>
                </Tooltip>
            </ThemeProvider>
        );
    };

    // Add edit and action buttons to columns
    const columnsWithActions = [
        ...columns,
        {
            field: 'compliance',
            headerName: 'View Details',
            width: 200,
            sortable: false,
            renderCell: renderActionButton,
        },
    ];

    const columnsWithActionsProvisioning = [
        ...provisioningcolumns,
        {
            field: 'compliance',
            headerName: 'View Details',
            width: 200,
            sortable: false,
            renderCell: renderProvActionButton,
        },
    ];

    const columnsWithActionsProvisioningDetails = [
        ...provisioningColumnsDetails,
        {
            field: 'compliance',
            headerName: 'View Details',
            width: 200,
            sortable: false,
            renderCell: renderProvActionButton,
        },
    ];

    const columnsProvisioningLateApproval = [
        ...provisioningLateApprovalColumnsDetails,
        {
            field: 'compliance',
            headerName: 'View Details',
            width: 200,
            sortable: false,
            renderCell: renderProvActionButton,
        },
    ];

    //Termination Columns

    const columnsWithActionsTermination = [
        ...terminationcolumns,
        {
            headerName: 'View Details',
            width: 200,
            sortable: false,
            renderCell: renderTermActionButton,
        },
    ];

    const columnsWithActionsTerminationDetails = [
        ...terminationColumnsDetails,
        {
            field: 'compliance',
            headerName: 'View Details',
            width: 200,
            sortable: false,
            renderCell: renderTermActionButton,
        },
    ];


    const columnsWithActionsLateRemovalDetails = [
        ...terminationLateRemovalColumnsDetails,
        {
            field: 'compliance',
            headerName: 'View Details',
            width: 200,
            sortable: false,
            renderCell: renderTermActionButton,
        },
    ];


    const tabs = [
        {
            value: '1',
            label: (<div>
                Authentication
            </div>),
            content: (
                <div>
                    <mui.Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                        <mui.Grid item xs={2}>
                            <Paper sx={{ height: '200px', padding: '20px' }}>
                                <DonutChart data={withExceptions} desc="Policy Exception" title={authPolicyViolationCount} />
                            </Paper>
                        </mui.Grid>

                        <mui.Grid item xs={2}>
                            <Paper sx={{ height: '200px', padding: '20px' }}>
                                <DonutChart data={incompleteSetupAuth} desc="Incomplete Setup" title={authIncompleteCount} />
                            </Paper>
                        </mui.Grid>
                    </mui.Grid>

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

        {
            value: '2',
            label: (<div>
                Access Provisioning
            </div>),
            content: (
                <div>

                    <mui.Grid container spacing={2} sx={{ marginBottom: '20px' }}>

                        <mui.Grid item xs={2}>
                            <Paper sx={{ height: '200px', padding: '20px' }}>
                                <DonutChart data={withExceptions} desc="No Documentation" title={provNoDocCount} />
                            </Paper>
                        </mui.Grid>

                        <mui.Grid item xs={2}>
                            <Paper sx={{ height: '200px', padding: '20px' }}>
                                <DonutChart data={withExceptions} desc="Late Approval" title={provLateCount} />
                            </Paper>
                        </mui.Grid>

                    </mui.Grid>
                    

                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={provisioningrows}
                            columns={provisioningcolumns}
                            columnsWithActions={columnsWithActionsProvisioning}
                        />
                    </Suspense>

                </div>
            ),
        },
        {
            value: '3',
            label: (<div>
                Access Termination
            </div>),
            content: (
                <div>

                    <mui.Grid container spacing={2} sx={{ marginBottom: '20px' }}>

                    <mui.Grid item xs={2}>
                        <Paper sx={{ height: '200px', padding: '20px' }}>
                            <DonutChart data={withExceptions} desc="Late Removal" title={lateremovalCount} />
                        </Paper>
                    </mui.Grid>

                    </mui.Grid>


                    <Suspense fallback={<div>Loading...</div>}>
                    <DataTable
                        rows={terminationrows}
                        columns={terminationcolumns}
                        columnsWithActions={columnsWithActionsTermination}
                    />
                    </Suspense>

                </div>
            ),
        },
        {
            value: '4',
            label: (<div>
                User Access Review
            </div>),
            content: (
                <div>

                </div>
            ),
        },
        {
            value: '5',
            label: (<div>
                Privileged Access
            </div>),
            content: (
                <div>

                </div>
            ),
        },
    ]

    const provisioningTabs = [
        {
            value: '1',
            label: (<div>
                New Roles/User Assignment
            </div>),
            content: (
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={provisioningRowDetails? provisioningRowDetails: ''}
                            columns={provisioningColumnsDetails}
                            columnsWithActions={columnsWithActionsProvisioningDetails}
                        />
                    </Suspense>
                </div>
            ),
        },

        {
            value: '2',
            label: (<div>
                Missing Documentation
            </div>),
            content: (
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                             rows={provisioningMissingDocsRowDetails? provisioningMissingDocsRowDetails: ''}
                             columns={provisioningColumnsDetails}
                             columnsWithActions={columnsWithActionsProvisioningDetails}
                        />
                    </Suspense>

                </div>
            ),
        },
        {
            value: '3',
            label: (<div>
                Late Approval
            </div>),
            content: (
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={provisioningLateApprovalRowDetails}
                            columns={provisioningLateApprovalColumnsDetails}
                            columnsWithActions={columnsProvisioningLateApproval}
                        />
                    </Suspense>
                </div>
            ),
        },

    ]

    const terminationTabs = [
        {
            value: '1',
            label: (<div>
                Termination List
            </div>),
            content: (
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                            rows={terminationRowDetails? terminationRowDetails: ''}
                            columns={terminationColumnsDetails}
                            columnsWithActions={columnsWithActionsTerminationDetails}
                        />
                    </Suspense>
                </div>
            ),
        },

        {
            value: '2',
            label: (<div>
                Late Removal
            </div>),
            content: (
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DataTable
                             rows={terminationLateRemovalDetails? terminationLateRemovalDetails: ''}
                             columns={terminationLateRemovalColumnsDetails}
                             columnsWithActions={columnsWithActionsLateRemovalDetails}
                        />
                    </Suspense>

                </div>
            ),
        },

    ]

    const handleClosePasswordModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenPasswordModal(true)
        }
        else {
            setOpenPasswordModal(false);
        }
    };

    const handleCloseProvisioningModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenProvisioningModal(true)
        }
        else {
            setOpenProvisioningModal(false);
        }
    };

    const handleCloseTerminationModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenTerminationModal(true)
        }
        else {
            setOpenTerminationModal(false);
        }
    };



    function createData(name, policy, configured, result) {
        return { name, policy, configured, result };
    }

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
                    <mui.Typography color="text.primary">Compliance</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Audit Compliance Status" icon={<GridViewIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    View and manage compliance to IT controls
                </mui.Typography>

                <Separator />

                <mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center' }}>
                    
                    <mui.Tooltip title="Manage Monitoring">
                        <mui.IconButton>
                            <SettingsRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                        </mui.IconButton>
                    </mui.Tooltip>

                    <mui.Tooltip title="Download Compliance Report">
                        <mui.IconButton>
                            <DownloadRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                        </mui.IconButton>
                    </mui.Tooltip>

                </mui.Box>

                <DynamicTabs tabs={tabs} />


                <Modal
                    open={openPasswordModal}
                    size="md"
                    onClose={handleClosePasswordModal}
                    header={`${selectedApp.APP_NAME} Password Details`}
                    body={
                        <>
                            <mui.Typography variant="subtitle2">
                                Below is the detailed comparison of the password configured in {selectedApp.APP_NAME} against the requirement of the password policy.
                            </mui.Typography>

                            <mui.Box sx={{ marginTop: '20px' }}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Password Parameters</TableCell>
                                                <TableCell align="center">Password Policy Requirement</TableCell>
                                                <TableCell align="center">Password Configured</TableCell>
                                                <TableCell align="center">Result</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {passwordRows.map((row) => (
                                                <TableRow
                                                    key={row.name}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="center">{row.policy}</TableCell>
                                                    <TableCell align="center">{row.configured}</TableCell>
                                                    <TableCell align="center">{row.result}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </mui.Box>
                        </>
                    }
                    footer={
                        <>
                            <mui.Button sx={{ marginBottom: '20px' }} onClick={handleClosePasswordModal} color="primary">
                                Close
                            </mui.Button>
                        </>
                    }
                />

                <Modal
                    open={openProvisioningModal}
                    size="lg"
                    onClose={handleCloseProvisioningModal}
                    header={`${selectedApp.APP_NAME} Provisioning Summary`}
                    body={
                        <>
                            <mui.Typography variant="subtitle2">
                                Below is the detailed summary of the provisioning report for {selectedApp.APP_NAME}.
                            </mui.Typography>

                            <mui.Box sx={{ marginTop: '20px' }}>

                                <DynamicTabs tabs={provisioningTabs} />

                            </mui.Box>
                        </>
                    }
                    footer={
                        <>
                            <mui.Button sx={{ marginBottom: '20px' }} onClick={handleCloseProvisioningModal} color="primary">
                                Close
                            </mui.Button>
                        </>
                    }
                />

                <Modal
                    open={openTerminationModal}
                    size="lg"
                    onClose={handleCloseTerminationModal}
                    header={`${selectedApp.APP_NAME} Termination Summary`}
                    body={
                        <>
                            <mui.Typography variant="subtitle2">
                                Below is the detailed summary of the user termination report for {selectedApp.APP_NAME}.
                            </mui.Typography>

                            <mui.Box sx={{ marginTop: '20px' }}>

                                <DynamicTabs tabs={terminationTabs} />

                            </mui.Box>
                        </>
                    }
                    footer={
                        <>
                            <mui.Button sx={{ marginBottom: '20px' }} onClick={handleCloseTerminationModal} color="primary">
                                Close
                            </mui.Button>
                        </>
                    }
                />


            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SysOwnerSideBar mainContent={customMainContent} />
        </div>
    );


}

export default SysOwnerCompliance;