import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import ResponsiveContainer from '../../layout/Container';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import NormalTextField from '../../common/NormalTextField';
import SwitchesGroup from '../../common/SwitchesGroup';
import roleService from '../../../services/RoleService';
import DynamicSnackbar from '../../common/Snackbar';

const PasswordSettings = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem('authToken');

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const [existingSettings, setExistingSettings] = useState([]);
    const [passwordData, setPasswordData] = useState({
        MIN_LENGTH: '',
        AGE: '',
        HISTORY: '',
        LOCKOUT: '',
        LOCKOUT_DURATION: '',
        HAS_SPECIALCHAR: false,
        HAS_NUMERIC: false,
        HAS_UPPER: false,
        HAS_LOWER: false,
        MFA_ENABLED: false,
        SESSION_LENGTH: '',
    });

    //FETCH USER RECORD
    useEffect(() => {
        const fetchPasswordSettings = async () => {
            try {
                const response = await roleService.getSystemPassword();
                if (response) {
                    setExistingSettings(response)
                    setPasswordData({
                        MIN_LENGTH: response[0].MIN_LENGTH || '',
                        AGE: response[0].AGE || '',
                        HISTORY: response[0].HISTORY || '',
                        LOCKOUT: response[0].LOCKOUT || '',
                        LOCKOUT_DURATION: response[0].LOCKOUT_DURATION || '',
                        HAS_SPECIALCHAR: response[0].HAS_SPECIALCHAR || false,
                        HAS_NUMERIC: response[0].HAS_NUMERIC || false,
                        HAS_UPPER: response[0].HAS_UPPER || false,
                        HAS_LOWER: response[0].HAS_LOWER || false,
                        MFA_ENABLED: response[0].MFA_ENABLED || false,
                        SESSION_LENGTH: response[0].SESSION_LENGTH || '',
                    });

                }
            } catch (error) {
                console.error('Error fetching password settings:', error);
            }
        };

        fetchPasswordSettings();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    }

    const handleSwitchChange = (name, checked) => {
        setPasswordData({ ...passwordData, [name]: checked });
    };

    const switches = [
        { name: 'HAS_UPPER', label: 'Upper Case', checked: passwordData.HAS_UPPER },
        { name: 'HAS_LOWER', label: 'Lower Case', checked: passwordData.HAS_LOWER },
        { name: 'HAS_NUMERIC', label: 'Numeric', checked: passwordData.HAS_NUMERIC },
        { name: 'HAS_SPECIALCHAR', label: 'Special Character', checked: passwordData.HAS_SPECIALCHAR },
        { name: 'MFA_ENABLED', label: 'MFA Enabled', checked: passwordData.MFA_ENABLED },
    ];

    const configurePassword = async (e) => {
        e.preventDefault();
        console.log('this is the existing setting', existingSettings);
        try {
            let response;
            if (existingSettings.length > 0) {
                response = await roleService.updateSystemPassword(existingSettings[0].id, passwordData);
                setSnackbarMessage('Password successfully updated');
                setSnackbarSeverity('success');
            } else {
                response = await roleService.createSystemPassword(passwordData);
                setSnackbarMessage('Password successfully configured');
                setSnackbarSeverity('success');
                window.location.reload()
            }
            setSnackbarOpen(true); // Open the snackbar after setting message and severity
        } catch (error) {
            console.error('Error configuring password:', error);
            setSnackbarMessage('Failed to configure password');
            setSnackbarSeverity('error');
            setSnackbarOpen(true); // Open the snackbar on error as well
        }
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
                    <mui.Link underline="hover" color="inherit" href="/Security">
                        System Security
                    </mui.Link>
                    <mui.Typography color="text.primary">Password Settings</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Password Settings" icon={<SecurityIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage and configure password settings
                </mui.Typography>
                <Separator />

                <NormalTextField
                    label="Password Length"
                    name="MIN_LENGTH"
                    type="number"
                    value={passwordData.MIN_LENGTH}
                    onChange={handleChange}
                    required
                />

                <NormalTextField
                    label="Password Age"
                    name="AGE"
                    type="number"
                    value={passwordData.AGE}
                    onChange={handleChange}
                    required
                />

                <NormalTextField
                    label="Password History"
                    name="HISTORY"
                    type="number"
                    value={passwordData.HISTORY}
                    onChange={handleChange}
                    required
                />

                <NormalTextField
                    label="Account Lockout"
                    name="LOCKOUT"
                    type="number"
                    value={passwordData.LOCKOUT}
                    onChange={handleChange}
                    required
                />

                <NormalTextField
                    label="Lockout Duration (in minutes)"
                    name="LOCKOUT_DURATION"
                    type="number"
                    value={passwordData.LOCKOUT_DURATION}
                    onChange={handleChange}
                    required
                />

                <NormalTextField
                    label="Session Expiry (in days)"
                    name="SESSION_LENGTH"
                    type="number"
                    value={passwordData.SESSION_LENGTH}
                    onChange={handleChange}
                    required
                />

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <SwitchesGroup title="Complexity Requirements" switches={switches} onChange={handleSwitchChange} />
                    <mui.Button onClick={configurePassword} sx={{ marginTop: '30px', width: '150px' }} color="primary" variant="contained">
                        Save Settings
                    </mui.Button>
                </div>

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

export default PasswordSettings;
