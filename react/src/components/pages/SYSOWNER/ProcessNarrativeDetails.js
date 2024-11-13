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
import { useParams } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded';
import Divider from '@mui/material/Divider';
import KeyIcon from '@mui/icons-material/Key';
import StorageIcon from '@mui/icons-material/Storage';
import SettingsIcon from '@mui/icons-material/Settings';
import appPasswordService from '../../../services/PasswordService';
import InfoIcon from '@mui/icons-material/Info';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';

const ProcessNarrativeDetails = () => {

    const { id } = useParams();
    const { company } = useParams();
    const [apps, setApps] = useState([]);
    const [network, setNetwork] = useState([]);
    const [pwdata, setPWData] = useState([]);
    const [provisioningData, setProvisioningData] = useState([]);
    const [terminationData, setTerminationData] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch apps and users in parallel
                const appsResponse = await appService.fetchAppsById(id)
                if (appsResponse) {
                    setApps(appsResponse);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchNetwork = async () => {
            try {
                // Fetch apps and users in parallel
                const networkResponse = await appService.fetchAppsById(apps?.NETWORK)
                if (networkResponse) {
                    setNetwork(networkResponse);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchPwData = async () => {
            try {
                const pwDataresponse = await appPasswordService.fetchAppPasswordByApp(id)
                if (pwDataresponse) {
                    setPWData(pwDataresponse);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        const fetchProvisioningData = async () => {
            try {
                const provisioingDataresponse = await appService.getProvisioningProcessByID(id)
                if (provisioingDataresponse) {
                    setProvisioningData(provisioingDataresponse);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }


        const fetchTerminationData = async () => {
            try {
                const terminationDataresponse = await appService.getTerminationProcessByID(id)
                console.log(terminationDataresponse)
                if (terminationDataresponse) {
                    setTerminationData(terminationDataresponse);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }


        fetchData();
        fetchPwData();
        fetchProvisioningData();
        fetchTerminationData();
        fetchNetwork();

    }, []);

    const getAppDetails = (app) => {

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
                    <mui.Link underline="hover" color="inherit" href="/processNarrative">
                        Process Narrative
                    </mui.Link>

                    <mui.Typography color="text.primary">{company}</mui.Typography>

                    <mui.Typography color="text.primary">{apps.APP_NAME}</mui.Typography>

                </mui.Breadcrumbs>

                <SearchAppBar title={apps.APP_NAME ? apps.APP_NAME : ''} icon={<GridViewIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    View and download process narrative report for {apps.APP_NAME}
                </mui.Typography>

                <Separator />

                <mui.Box sx={{ backgroundColor: 'whitesmoke', minHeight: '80vh', padding: '20px' }}>
                    <mui.Grid
                        container spacing={3}
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                    >

                        <mui.Grid item
                            xs={sidebarVisible ? 3 : 0}
                            sx={{
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, width 0.3s ease', // Smooth transition for both transform and width
                                transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',

                            }}>

                            <mui.Paper sx={{ flex: 1, maxHeight: '80vh', minHeight: '80vh', overflow: 'auto' }}>
                                {/* <mui.IconButton
                                    onClick={toggleSidebar}
                                    sx={{ position: 'absolute', top: 20, right: 0, zIndex:999999 }}
                                >
                                    <MenuIcon />
                                </mui.IconButton> */}
                                <List
                                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Quick Links
                                        </ListSubheader>
                                    }
                                >

                                    <ListItemButton onClick={handleClick}>
                                        <ListItemIcon>
                                            <KeyIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Access Security" />
                                    </ListItemButton>

                                    <Divider />

                                    <ListItemButton onClick={handleClick}>
                                        <ListItemIcon>
                                            <SettingsIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Change Management" />
                                    </ListItemButton>

                                    <Divider />

                                    <ListItemButton onClick={handleClick}>
                                        <ListItemIcon>
                                            <StorageIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="IT Operations" />
                                    </ListItemButton>

                                </List>

                            </mui.Paper>

                        </mui.Grid>

                        <mui.Grid item
                            xs={sidebarVisible ? 9 : 12}
                            sx={{ transition: 'margin-left 0.3s ease', marginLeft: sidebarVisible ? 0 : 3 }} >
                            <mui.Paper sx={{ maxHeight: '80vh', minHeight: '80vh', padding: '20px', overflow: 'auto' }}>
                                <mui.Box sx={{ margin: '50px' }}>
                                    <mui.Typography sx={{ fontWeight: 'bold' }} variant="h6">Password/Authentication</mui.Typography>

                                    {apps.AUTHENTICATION_TYPE ? (
                                        <mui.Typography sx={{ marginTop: '20px' }} variant="body2">
                                            {apps.APP_NAME}
                                            {apps.AUTHENTICATION_TYPE === "Native/Direct" ? ' is authenticating users directly within the system and not currently utilizing single sign-on (SSO). ' :
                                                apps.AUTHENTICATION_TYPE === 'Single-Sign-On (SSO)' ? ' is authenticating all users via single sign-on (SSO). ' :
                                                    apps.AUTHENTICATION_TYPE === 'Both Native and SSO' ? ' is authenticating users via both single sign-on (SSO) and direct login. ' :
                                                        ' authentication documentation is not currently provided. Proceed to the general information section to complete the details.'}
                                            {apps.COMPANY_NAME}
                                            {apps.PW_CONFIGURABLE === "Yes" ?
                                                ` has access to modify the password settings of ${apps.APP_NAME} ` :
                                                ' does not have the capability to modify the password configuration and it is managed by the vendor.'}
                                        </mui.Typography>
                                    ) : (
                                        <mui.Typography sx={{ marginTop: '20px' }} variant="body2">
                                            {apps.APP_NAME} authentication documentation is not currently provided. Proceed to the general information section to complete the details. {apps.COMPANY_NAME}
                                        </mui.Typography>
                                    )}


                                    {apps.AUTHENTICATION_TYPE === 'Native/Direct' || apps.AUTHENTICATION_TYPE === 'Both Native and SSO' ?

                                        <mui.Paper sx={{ marginTop: '20px', overflow: 'auto', backgroundColor: 'whitesmoke' }}>
                                            <mui.Box sx={{ padding: '20px', overflow: 'auto' }}> {/* Margin for the entire box */}

                                                <mui.Typography variant="body2" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                                    <InfoIcon sx={{ marginRight: 1, color: '#4287f5' }} />
                                                    {apps.COMPANY_NAME} has configured the following password settings for {apps.APP_NAME}:
                                                </mui.Typography>


                                                <mui.Typography sx={{ marginTop: '10px', marginBottom: '10px' }} variant="subtitle2">
                                                    Password Length: <span style={{ fontStyle: 'italic' }}> {pwdata.LENGTH ? pwdata.LENGTH : 'Not set'} characters </span>
                                                </mui.Typography>

                                                <mui.Typography sx={{ marginTop: '10px', marginBottom: '10px' }} variant="subtitle2">
                                                    Password History: <span style={{ fontStyle: 'italic' }}> {pwdata.HISTORY ? pwdata.HISTORY : 'Not set'} passwords remembered </span>
                                                </mui.Typography>

                                                <mui.Typography sx={{ marginTop: '10px', marginBottom: '10px' }} variant="subtitle2">
                                                    Password Expiry: <span style={{ fontStyle: 'italic' }}> {pwdata.AGE ? pwdata.AGE : 'Not set'} days </span>
                                                </mui.Typography>

                                                <mui.Typography sx={{ marginTop: '10px', marginBottom: '10px' }} variant="subtitle2">
                                                    Account Lockout: <span style={{ fontStyle: 'italic' }}> {pwdata.LOCKOUT_ATTEMPT ? pwdata.LOCKOUT_ATTEMPT : 'Not set'} failed attempts  </span>
                                                </mui.Typography>

                                                <mui.Typography sx={{ marginTop: '20px', marginBottom: '10px' }} variant="body2">
                                                    The following complexity requirements are also configured for {apps.APP_NAME}
                                                </mui.Typography>

                                                <mui.Typography sx={{ marginTop: '10px', marginBottom: '10px' }} variant="subtitle2">
                                                    Special Character:  <span style={{ fontStyle: 'italic' }}> {pwdata.SPECIAL_CHAR === true ? 'Enabled' : 'Not set'}  </span>
                                                </mui.Typography>

                                                <mui.Typography sx={{ marginTop: '10px', marginBottom: '10px' }} variant="subtitle2">
                                                    Upper Case:  <span style={{ fontStyle: 'italic' }}> {pwdata.UPPER === true ? 'Enabled' : 'Not set'}  </span>
                                                </mui.Typography>

                                                <mui.Typography sx={{ marginTop: '10px', marginBottom: '10px' }} variant="subtitle2">
                                                    Lower Case: <span style={{ fontStyle: 'italic' }}> {pwdata.LOWER === true ? 'Enabled' : 'Not set'}  </span>
                                                </mui.Typography>

                                                <mui.Typography sx={{ marginTop: '10px', marginBottom: '10px' }} variant="subtitle2">
                                                    Numeric: <span style={{ fontStyle: 'italic' }}> {pwdata.NUMBER === true ? 'Enabled' : 'Not set'}  </span>
                                                </mui.Typography>

                                            </mui.Box>
                                        </mui.Paper>

                                        : ''}

                                    <Divider sx={{ marginTop: '30px' }} />

                                    <mui.Typography sx={{ fontWeight: 'bold', marginTop: '20px' }} variant="h6">Access Provisioning</mui.Typography>

                                    {provisioningData?.FORM ? (
                                        <>
                                            <mui.Typography sx={{ marginTop: '20px' }} variant="body2">
                                                {apps.COMPANY_NAME} has established the following process to govern requests, approval, and granting of user's access in {apps.APP_NAME}.
                                            </mui.Typography>

                                            <mui.Typography sx={{ marginTop: '20px', fontWeight: 'bold' }} variant="body2">
                                                Access Request Documentation and Approval
                                            </mui.Typography>

                                            <mui.Typography sx={{ marginTop: '10px' }} variant="body2">
                                                Users that require access to {apps.APP_NAME} submit and document their access requests, including roles and permissions needed, via{" "}
                                                {provisioningData.FORM.replace(",", " and ")}. Approval of {provisioningData.APPROVERS.replace(",", " and ")} must be provided prior to granting access within the system.  Once the approval is obtained, {provisioningData.GRANTOR ? provisioningData.GRANTOR.replace(",", " and ") : '(Grantor not set)'} will provision the access requested in the {apps.APP_NAME}.
                                            </mui.Typography>

                                            <mui.Typography sx={{ marginTop: '10px' }} variant="body2">

                                            </mui.Typography>

                                            <mui.Typography sx={{ marginTop: '20px', fontWeight: 'bold' }} variant="body2">
                                                Provisioning of Regular Employees vs. Temporary/Contract Based Workers
                                            </mui.Typography>


                                            <mui.Typography sx={{ marginTop: '10px' }} variant="body2">
                                                {provisioningData.PROCESS_DIFFERENCE === "Yes" ? (
                                                    <>
                                                        {apps.COMPANY_NAME} has implemented a separate process between regular and temporary workers.
                                                        Temporary-based workers are provisioned based on this process:{" "}
                                                        <mui.Typography component="span" sx={{ fontStyle: 'italic' }} variant="body2">
                                                            {provisioningData.PROCESS_DIFFERENCE_OTHER}
                                                        </mui.Typography>.
                                                    </>
                                                ) : (
                                                    `The provisioning process described above applies to both regular and temporary/contract-based workers. No difference on how access is requested, approved, and granted within ${apps.APP_NAME}.`
                                                )}
                                            </mui.Typography>


                                        </>
                                    ) : (
                                        <mui.Typography sx={{ marginTop: '20px' }} variant="body2">
                                            There is no available access request documentation or approval process at the moment.
                                        </mui.Typography>
                                    )}

                                    <Divider sx={{ marginTop: '30px' }} />

                                    <mui.Typography sx={{ fontWeight: 'bold', marginTop: '20px' }} variant="h6">Access Termination</mui.Typography>

                                    {terminationData?.NETWORK_RELIANCE ? (
                                        <>
                                            <mui.Typography sx={{ marginTop: '10px' }} variant="body2">
                                                {terminationData.NETWORK_RELIANCE === 'Yes - Full Reliance' && (
                                                    `${apps.COMPANY_NAME} is fully relying on the effectiveness of the network termination process. When a user's network access is terminated, the user will no longer be able to access ${apps.APP_NAME}. ${network?.APP_NAME ? `Refer to ${network?.APP_NAME} documentation for more details on the network termination process.` : ''}`
                                                )}

                                                {terminationData.NETWORK_RELIANCE === 'Yes - Partial Reliance' && (
                                                    `${apps.COMPANY_NAME} is relying on the effectiveness of the network termination process. When a user's network access is terminated, the user will no longer be able to access ${apps.APP_NAME}. However, there are also users logging in directly into the system. As such, access for those users is revoked on the system layer by the administrator during the termination process.`
                                                )}
                                                {terminationData.NETWORK_RELIANCE === 'No - Not Relying' && (
                                                    `${apps.COMPANY_NAME} does not rely on the network termination process, and access for users within ${apps.APP_NAME} is revoked at the application layer.`
                                                )}
                                            </mui.Typography>

                                            {(terminationData.NETWORK_RELIANCE === 'Yes - Partial Reliance' || terminationData.NETWORK_RELIANCE === 'No - Not Relying') && (
                                                <mui.Typography sx={{ marginTop: '20px', fontWeight: 'bold' }} variant="body2">
                                                    Application Layer Termination Process
                                                </mui.Typography>
                                            )}

                                            <mui.Typography sx={{ marginTop: '20px' }} variant="body2">
                                                Termination process for {apps.APP_NAME} is iniated when {terminationData?.TERM_NOTIFYER?.replace(",", " and ")} notify the system administrator via {terminationData?.TERM_DOCUMENTATION?.replace(",", " and ")} of the details of the termed user. Upon receipt of the notification, the user's account will be {terminationData?.DISABLE_TYPE?.replace(",", " and ")} by the system administrator {terminationData?.TERM_PROCESS === "Manual"
                                                    ? 'manually within the system.'
                                                    : terminationData?.TERM_PROCESS === "Automated"
                                                        ? 'through an automated process.'
                                                        : terminationData?.TERM_PROCESS
                                                            ? `through ${terminationData?.TERM_PROCESS.replace(",", " and ")} process.`
                                                            : 'in an unspecified manner.'}
                                            </mui.Typography>

                                            <mui.Typography sx={{ marginTop: '10px' }} variant="body2">
                                                The required timeline to revoke the access within {apps.APP_NAME} is within {terminationData.TIMELINESS} days from user's last working date.
                                            </mui.Typography>

                                            <mui.Typography sx={{ marginTop: '20px', fontWeight: 'bold' }} variant="body2">
                                                Termination of Regular Employees vs. Temporary/Contract Based Workers
                                            </mui.Typography>

                                            <mui.Typography sx={{ marginTop: '10px' }} variant="body2">
                                                {terminationData.PROCESS_DIFFERENCE === "Yes" ? (
                                                    <>
                                                        {apps.COMPANY_NAME} has implemented a separate process between regular and temporary workers.
                                                        Temporary-based workers are terminated based on this process:{" "}
                                                        <mui.Typography component="span" sx={{ fontStyle: 'italic' }} variant="body2">
                                                            {terminationData.PROCESS_DIFFERENCE_OTHER}
                                                        </mui.Typography>.
                                                    </>
                                                ) : (
                                                    `The termination process described above applies to both regular and temporary/contract-based workers. No difference on how access is revoked within ${apps.APP_NAME}.`
                                                )}
                                            </mui.Typography>

                                        </>
                                    ) : (
                                        <mui.Typography sx={{ marginTop: '20px' }} variant="body2">
                                            There is no available termination process at the moment.
                                        </mui.Typography>
                                    )}


                                   

                                    {/* //User Access Review */}

                                    <Divider sx={{ marginTop: '30px' }} />

                                    <mui.Typography sx={{ fontWeight: 'bold', marginTop: '20px' }} variant="h6">User Access Review</mui.Typography>

                                    <mui.Typography sx={{ marginTop: '10px' }} variant="body2">
                                        A work in progress—exciting things coming soon!
                                    </mui.Typography>


                                    {/* //Administrative Acounts */}

                                    <Divider sx={{ marginTop: '30px' }} />

                                    <mui.Typography sx={{ fontWeight: 'bold', marginTop: '20px' }} variant="h6">Privileged Accounts</mui.Typography>

                                    <mui.Typography sx={{ marginTop: '10px' }} variant="body2">
                                        We’re busy fine-tuning—can’t wait to show you what's next!
                                    </mui.Typography>


                                </mui.Box>

                            </mui.Paper>
                        </mui.Grid>

                    </mui.Grid>
                </mui.Box>

            </ResponsiveContainer>
        </div>
    );


    return (
        <div>
            <SysOwnerSideBar mainContent={customMainContent} />

        </div>
    );

}


export default ProcessNarrativeDetails;