import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import BusinessIcon from '@mui/icons-material/Business';
import ResponsiveContainer from '../../layout/Container';
import DynamicTabs from '../../common/DynamicTabs';
import NormalTextField from '../../common/NormalTextField';
import NetworkService from '../../../services/NetworkService';
import Notification from '../../common/Notification';

const NetworkLayer = () => {

    const [ldap, setLDAP] = useState({});
    const [ldapExist, setLDAPExist] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState({});
    const [alertMessage, setAlertMessage] = useState({});
    const [ldapID, setLDAPID] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLDAP({ ...ldap, [name]: value });
    };

    useEffect(() => {

        const fetchNetworkAuth = async () => {
            try {
                const response = await NetworkService.fetchNetworkAuth();  // Fetch app details by ID
                if (response && response.length > 0) {
                    setLDAP(response[0])
                    setLDAPID(response[0].id)
                    setLDAPExist(true)
                }

            } catch (error) {
                console.error('Error fetching LDAP data:', error);
            }
        };

        fetchNetworkAuth();

    }, []);

    const createNetworkAuth = async (e) => {
        e.preventDefault();
        try {

            const response = await NetworkService.createNetworkAuth(ldap);
            if (response) {
                setLDAPExist(true)
                setAlertTitle('Successful')
                setAlertMessage('Successfully configured LDAP configuration')
                setShowAlert(true)
            }

        } catch (error) {
            console.error(error)
        }
    };

    const updateNetworkAuth = async (e) => {
        e.preventDefault();
        try {

            const response = await NetworkService.updateNetworkAuth(ldapID, ldap);
            if (response) {
                setLDAPExist(true);
                setAlertTitle('Successful')
                setAlertMessage('Successfully updated LDAP configuration')
                setShowAlert(true);

                // Reload the page after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2500); // 2000 ms = 2 seconds
            }
        } catch (error) {
            console.error(error);
        }
    };

    const tabs = [

        {
            value: '1',
            label: 'LDAP Configuration',
            content: (
                <div>

                <mui.Box >

                        <NormalTextField

                            label="LDAP Server"
                            name="LDAP_SERVER"
                            value={ldap.LDAP_SERVER}
                            onChange={handleChange}
                            required={true}
                        />

                         <NormalTextField

                            label="LDAP Port"
                            name="LDAP_PORT"
                            value={ldap.LDAP_PORT}
                            onChange={handleChange}
                            required={true}
                        />

                          <NormalTextField

                            label="Base DN"
                            name="BASE_DN"
                            value={ldap.BASE_DN}
                            onChange={handleChange}
                            required={true}
                        />

                        <NormalTextField

                            label="Bind DN"
                            name="BIND_DN"
                            value={ldap.BIND_DN}
                            onChange={handleChange}
                            required={true}
                        />

                         <NormalTextField

                            label="Password"
                            name="LDAP_PW_HASHED"
                            value={ldap.LDAP_PW_HASHED}
                            onChange={handleChange}
                            type="password"
                            required={true}
                        />

                    
                        {ldapExist ? (
                            <>
                                <mui.Button sx={{ marginTop: '20px' }} onClick={updateNetworkAuth} color="primary" variant="contained">
                                    Update
                                </mui.Button>
                                <mui.Button sx={{ marginTop: '20px', marginLeft: '10px' }} onClick={''} color="primary" variant="contained">
                                    Test Connection
                                </mui.Button>
                            </>
                        ) : (
                            <mui.Button sx={{ marginTop: '20px' }} onClick={createNetworkAuth} color="primary" variant="contained">
                                Submit
                            </mui.Button>
                        )}


                    </mui.Box>

                </div>
            ),
        },
    ]

    const customMainContent = (
        <div>
            <ResponsiveContainer>
                <mui.Breadcrumbs aria-label="breadcrumb">
                    <mui.Link underline="hover" color="inherit" href="/dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/dashboard">
                        Dashboard
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/dashboard">
                        System Settings
                    </mui.Link>
                    <mui.Typography color="text.primary">Network Layer Setup</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Network Layer Setup" icon={<BusinessIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Configure network interfaces and manage automated access management
                </mui.Typography>
                <Separator />

                {showAlert && <Notification title={alertTitle} message={alertMessage} />}

                <DynamicTabs tabs={tabs} />

           
            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>
    );
}

export default NetworkLayer;
