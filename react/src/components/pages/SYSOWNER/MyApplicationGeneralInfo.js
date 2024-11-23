import React, { useState, useEffect, useRef } from 'react';
import SysOwnerSideBar from './SysOwnerSidebar';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import GridViewIcon from '@mui/icons-material/GridView';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import appService from '../../../services/ApplicationService';
import userService from '../../../services/UserService';
import companyService from '../../../services/CompanyService';
import { useParams } from 'react-router-dom';
import DynamicTabs from '../../common/DynamicTabs';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import NormalTextField from '../../common/NormalTextField';
import MultipleSelect from '../../common/MultipleSelect';
import SwitchesGroup from '../../common/SwitchesGroup';
import appPasswordService from '../../../services/PasswordService';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const MyApplicationGeneralInfo = () => {
    const { id } = useParams();
    const [selectedApps, setSelectedApps] = useState({});
    const [selectedType, setformattedType] = useState([]);
    const [selectedHosting, setSelectedHosting] = useState([]);
    const [selectedDev, setSelectedDev] = useState([]);
    const [osList, setOSList] = useState([]);
    const [selectedOS, setSelectedOS] = useState([]);
    const [selectedDB, setSelectedDB] = useState([]);
    const [selectedNetwork, setSelectedNetwork] = useState([]);
    const [selectedAuth, setSelectedAuth] = useState([]);
    const [selectedConfig, setSelectedConfig] = useState([]);
    const [dbList, setDBList] = useState([]);
    const [toolList, setToolList] = useState([]);
    const [networkList, setNetworkList] = useState([]);
    const saveTimeout = useRef(null);
    const [pwExist, setPWExist] = useState([]);

    const [geninfo, setGenInfo] = useState(false);
    const [userdata, setUserData] = useState(false);
    const [process, setProcess] = useState(false);

    const [overview, setOverview] = useState(false);
    const [infrastructure, setInfrastructure] = useState(false);
    const [authentication, setAuthentication] = useState(false);
    const [hostingTypeVisibility, setHostingTypeVisibility] = useState('none');

    const [passwordData, setPasswordData] = useState({});


    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const handleBlur = (e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...selectedApps,
            [name]: value
        };

        setSelectedApps(updatedData);
        // Immediately save on blur without debounce
        saveChanges(updatedData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }

        const updatedData = {
            ...selectedApps,
            [name]: value
        };
              
        setSelectedApps(updatedData);

        saveTimeout.current = setTimeout(() => {
            saveChanges(updatedData);
        }, 1000);
    };

    const handleTypeChange = (selectedType) => {

        const apptype = selectedType.value
        setformattedType(selectedType)

        const updatedData = {
            ...selectedApps,
            APP_TYPE: apptype
        };
        saveChanges(updatedData);

    };

    const handleDevChange = (selectedType) => {

        const devtype = selectedType.value
        setSelectedDev(selectedType)

        const updatedData = {
            ...selectedApps,
            DEVTYPE: devtype
        };

        saveChanges(updatedData);
     
    };

    const handleHostingChange = (selectedType) => {

        const hosting = selectedType.value
        setSelectedHosting(selectedType)

        const visibility = hosting === 'On-premise' ? 'block' : 'none';
        setHostingTypeVisibility(visibility);


        const updatedData = {
            ...selectedApps,
            HOSTED: hosting
        };

        saveChanges(updatedData);

    };

    const handleOSChange = (selectedType) => {
        const OS = selectedType.value
        setSelectedOS(selectedType)

        const updatedData = {
            ...selectedApps,
            OS: OS
        };
        saveChanges(updatedData);
      
    };

    const handleDBChange = (selectedType) => {
        const DB = selectedType.value
        setSelectedDB(selectedType)

        const updatedData = {
            ...selectedApps,
            DATABASE: DB
        };
        saveChanges(updatedData);

    };

    const handleNetworkChange = (selectedType) => {
        const network = selectedType.value
        setSelectedNetwork(selectedType)

        const updatedData = {
            ...selectedApps,
            NETWORK: network
        };
        saveChanges(updatedData);
    };


    //AUTHENTICATION
    const handleAuthChange = (selectedType) => {
        const auth = selectedType.value
        setSelectedAuth(selectedType)

        const updatedData = {
            ...selectedApps,
            AUTHENTICATION_TYPE: auth
        };
        saveChanges(updatedData);
    };

    const handleConfigChange = (selectedType) => {
        const authconfigurable = selectedType.value
        setSelectedConfig(selectedType)

        const updatedData = {
            ...selectedApps,
            PW_CONFIGURABLE: authconfigurable
        };
        saveChanges(updatedData);
    };

    //TRIGGER THE CHECKMARK
    useEffect(() => {
        visibleCheckMark();
    }, [selectedApps, passwordData]);


    //SAVE CHANGES TO THE APPLICATION RECORD
    const saveChanges = async (updatedData) => {
        try {
            const response = await appService.updateApp(id, updatedData);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    //SAVE PASSWORD RECORD
    const savePWChanges = async (updatedData) => {
        if (updatedData) {
            let passwordFound;
            try {
                passwordFound = await appPasswordService.fetchAppPasswordByApp(id);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    const newData = { ...updatedData, APP_NAME: id };
                    const newRecord = await appPasswordService.createAppPassword(newData);
                    setPasswordData(newRecord)
                    setPWExist(true)
                    console.log("New Password Data Created")
                } else {
                    // Handle other types of errors
                    console.error('Error mapping record:', error);
                }
            }
            if (passwordFound){
                try {
                    const updated_record =  await appPasswordService.updateAppPassword(id, updatedData);
                    setPasswordData(updated_record)
                    setPWExist(true)
                    console.log("Updated Password")
                } catch (error) {
                    console.error('Error updating record:', error);
                }
            }
        }
        
    };
    
    const typeOptions = [
        { value: 'Application', label: 'Application' },
        { value: 'Operating System', label: 'Operating System' },
        { value: 'Database', label: 'Database' },
        { value: 'Network', label: 'Network' },
        { value: 'Tool', label: 'Tool' }
    ];

    const hostingOptions = [
        { value: 'Vendor Hosted', label: 'Vendor Hosted' },
        { value: 'On-premise', label: 'On-premise' },
    ];

    const developOptions = [
        { value: 'Third-party Provided', label: 'Third-party Provided' },
        { value: 'Custom Made', label: 'Custom Made' },
    ];

    const loginOptions = [
        { value: 'Native/Direct', label: 'Native/Direct' },
        { value: 'Single-Sign-On (SSO)', label: 'Single-Sign-On (SSO)' },
        { value: 'Both Native and SSO', label: 'Both Native and SSO' },
    ];

    const configureOptions = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const OS = 'Operating System';
            const DB = 'Database';
            const NETWORK = 'Network';
            const TOOL = 'Tool';
    
            // Helper function to fetch data with error handling
            const fetchWithErrorHandling = async (fetchFunction) => {
                try {
                    return await fetchFunction();
                } catch (error) {
                    console.error('Error fetching data:', error);
                    return null;
                }
            };
    
            // Fetch apps by ID
            const appsByIdResponse = await fetchWithErrorHandling(() => appService.fetchAppsById(id));
            
            // Fetch other categories concurrently
            const [OSResponse, DBResponse, NetworkResponse, ToolResponse, appPWResponse] = await Promise.all([
                fetchWithErrorHandling(() => appService.fetchAppsByType(OS)),
                fetchWithErrorHandling(() => appService.fetchAppsByType(DB)),
                fetchWithErrorHandling(() => appService.fetchAppsByType(NETWORK)),
                fetchWithErrorHandling(() => appService.fetchAppsByType(TOOL)),
                fetchWithErrorHandling(() => appPasswordService.fetchAppPasswordbyID(id))
            ]);
    
            // Process appByIdResponse if available
            if (appsByIdResponse) {
                setSelectedApps(appsByIdResponse);
    
                const formatType = { value: appsByIdResponse.APP_TYPE, label: appsByIdResponse.APP_TYPE };
                setformattedType(formatType);
    
                const hostFormat = { value: appsByIdResponse.HOSTED, label: appsByIdResponse.HOSTED };
                setSelectedHosting(hostFormat);
    
                const devFormat = { value: appsByIdResponse.DEVTYPE, label: appsByIdResponse.DEVTYPE };
                setSelectedDev(devFormat);
    
                const authFormat = { value: appsByIdResponse.AUTHENTICATION_TYPE, label: appsByIdResponse.AUTHENTICATION_TYPE };
                setSelectedAuth(authFormat);
    
                const configFormat = { value: appsByIdResponse.PW_CONFIGURABLE, label: appsByIdResponse.PW_CONFIGURABLE };
                setSelectedConfig(configFormat);
    
                const hosting = appsByIdResponse.HOSTED;
                const visibility = hosting === 'On-premise' ? 'block' : 'none';
                setHostingTypeVisibility(visibility);
            }
    
            // Process appPWResponse if available
            if (appPWResponse) {
                setPasswordData(appPWResponse);
                setPWExist(true);
            } else {
                setPasswordData([]);
                setPWExist(false);
            }
    
            // Process OSResponse if available
            if (OSResponse) {
                const formatOSList = OSResponse.map(item => ({
                    value: item.id,
                    label: item.APP_NAME
                }));
                setOSList(formatOSList);
    
                const selectedOS = await fetchWithErrorHandling(() => appService.fetchAppsById(appsByIdResponse?.OS));
                if (selectedOS) {
                    const formatOS = { value: selectedOS.id, label: selectedOS.APP_NAME };
                    setSelectedOS(formatOS);
                }
            } else {
                setOSList([]);
                setSelectedOS(null);
            }
    
            // Process DBResponse if available
            if (DBResponse) {
                const formatDBList = DBResponse.map(item => ({
                    value: item.id,
                    label: item.APP_NAME
                }));
                setDBList(formatDBList);
    
                const selectedDB = await fetchWithErrorHandling(() => appService.fetchAppsById(appsByIdResponse?.DATABASE));
                if (selectedDB) {
                    const formatDB = { value: selectedDB.id, label: selectedDB.APP_NAME };
                    setSelectedDB(formatDB);
                }
            } else {
                setDBList([]);
                setSelectedDB(null);
            }
    
            // Process NetworkResponse if available
            if (NetworkResponse) {
                const formatNetworkList = NetworkResponse.map(item => ({
                    value: item.id,
                    label: item.APP_NAME
                }));
                setNetworkList(formatNetworkList);
    
                const selectedNetwork = await fetchWithErrorHandling(() => appService.fetchAppsById(appsByIdResponse?.NETWORK));
                if (selectedNetwork) {
                    const formatNetwork = { value: selectedNetwork.id, label: selectedNetwork.APP_NAME };
                    setSelectedNetwork(formatNetwork);
                }
            } else {
                setNetworkList([]);
                setSelectedNetwork(null);
            }
    
            // Process ToolResponse (you can add further handling if needed)
            if (ToolResponse) {
               
                // Additional tool-related logic can go here if needed
            } else {
                setToolList([]);
            }
        };
    
        fetchData();
    }, [id]);
    


    const handleHostingTypeVisibility = () => {
        return hostingTypeVisibility;
    };

    const handleAuthenticationVisibility = () => {
        return selectedApps.AUTHENTICATION_TYPE === 'Native/Direct' ? 'block' : 'none';
    };

    const switches = [
        { name: 'UPPER', label: 'Upper Case', checked: passwordData.UPPER },
        { name: 'LOWER', label: 'Lower Case', checked: passwordData.LOWER },
        { name: 'NUMBER', label: 'Numeric', checked: passwordData.NUMBER },
        { name: 'SPECIAL_CHAR', label: 'Special Character', checked: passwordData.SPECIAL_CHAR },
        { name: 'MFA_ENABLED', label: 'MFA Enabled', checked: passwordData.MFA_ENABLED },
    ];

    const handleSwitchChange = (name, checked) => {
        const updatedData = {
            ...passwordData,
            [name]: checked
        };
        setPasswordData(updatedData)
        savePWChanges(updatedData);
    };

    const handleChangePWChange = (e) => {
        const { name, value } = e.target;

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }

        const updatedData = {
            ...passwordData,
            [name]: value
        };
        // Save changes with the updated state
        saveTimeout.current = setTimeout(() => {
            savePWChanges(updatedData);
        }, 1000); 

        setPasswordData(updatedData);
    }

    const handlePWBlur = (e) => {
        const { name, value } = e.target;

        const updatedData = {
            ...passwordData,
            [name]: value
        };

        setPasswordData(updatedData)
      
        savePWChanges(updatedData);
    };

    const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';
    const isValidInteger = (value) => Number.isInteger(value) && value > 0;

    const visibleCheckMark = () => {

        let generalInfoValid = false;
        let infrastructureValid = false;
        let authenticationValid = false;
       
        //GENERAL INFO
        if (
            isNonEmptyString(selectedApps.APP_NAME) &&
            isNonEmptyString(selectedApps.APP_TYPE) &&
            isNonEmptyString(selectedApps.APP_DESCRIPTION)
        )
            {
            setOverview(true);
            generalInfoValid = true;
        } else {
            setOverview(false);
            generalInfoValid = false;
        }

        //INFRASTRUCTURE
        if (
            isNonEmptyString(selectedApps.DEVTYPE) &&
            selectedApps.HOSTED === 'On-premise'
        ) {
            if (
                isNonEmptyString(selectedApps.OS) &&
                isNonEmptyString(selectedApps.OS_VERSION) &&
                isNonEmptyString(selectedApps.DATABASE) &&
                isNonEmptyString(selectedApps.DB_VERSION) && 
                isNonEmptyString(selectedApps.NETWORK) && 
                isNonEmptyString(selectedApps.NETWORK_VERSION) 
            ) {
                setInfrastructure(true);
                infrastructureValid = true;
              
            } else {
                setInfrastructure(false);
                infrastructureValid = false;
                
            }
        } else if (
            isNonEmptyString(selectedApps.DEVTYPE) &&
            selectedApps.HOSTED === 'Vendor Hosted'
        ) {
            setInfrastructure(true);
            infrastructureValid = true;
            
        } else {
            setInfrastructure(false);
            infrastructureValid = false;
           
        }
        
        //PASSWORD
        if (
            selectedApps.AUTHENTICATION_TYPE === 'Single-Sign-On (SSO)' && 
            selectedApps.PW_CONFIGURABLE === 'No'
        ) {
            setAuthentication(true)
            authenticationValid = true;
            
        } else if (
            selectedApps.PW_CONFIGURABLE === 'Yes' &&
            isValidInteger(passwordData.LENGTH) &&
            isValidInteger(passwordData.AGE) &&
            isValidInteger(passwordData.HISTORY) &&
            isValidInteger(passwordData.LOCKOUT_ATTEMPT) 
        ) {
            setAuthentication(true)
            authenticationValid = true;
        }
        else {
            setAuthentication(false)
            authenticationValid = false;
           
        }
  
        const isGenInfoValid = generalInfoValid && infrastructureValid && authenticationValid;

        if (isGenInfoValid) {

            const updatedData = {
                ...selectedApps,
                SETUP_GENINFO: true
            };

            saveChanges(updatedData)
          
        } else {
            const updatedData = {
                ...selectedApps,
                SETUP_GENINFO: false
            };
            saveChanges(updatedData)
        }

    };

    const tabs = [
        {
            value: '1',
            label: (
                <div>
                    Overview {overview ? <CheckCircleRoundedIcon sx={{ fontSize: '18px', color: 'green' }} /> : null}
                </div>
            ),
            content: (
                <div>
                    <NormalTextField
                        label="Application Name"
                        name="APP_NAME"
                        value={selectedApps.APP_NAME}
                        readOnly
                    />

                    <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                        <label style={{
                            display: 'block',
                            width: '90px',
                            marginLeft: '10px',
                            zIndex: '1000000',
                            marginBottom: '-10px',
                            fontSize: '12px',
                            position: 'relative',
                            backgroundColor: 'white',
                            padding: '0px 5px'
                        }}>System Type:</label>
                        <div style={{
                            marginBottom: '18px',
                            position: 'relative',
                            zIndex: '99999'  // Lower z-index than the label
                        }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                defaultValue={selectedApps.APP_TYPE ? selectedApps.APP_TYPE : 'Select System Type*'}
                                placeholderText="Select System Type*"
                                selectOptions={typeOptions}
                                selectedOptions={selectedType ? selectedType : ''}
                                handleChange={handleTypeChange}
                            />
                        </div>
                    </div>


                    <NormalTextField
                        label="Description"
                        name="APP_DESCRIPTION"
                        value={selectedApps.APP_DESCRIPTION}
                        onChange={handleChange}
                        isMultiLine={true}
                        rows="8"
                        onBlur={handleBlur}
                    />

                </div>
            ),
        },
        {
            value: '2',
            label:  (
                <div>
                Infrastructure {infrastructure ? <CheckCircleRoundedIcon sx={{ fontSize: '18px', color: 'green' }} /> : null}
            </div>
            ),
            content: (
                <div>
                    <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                        <label style={{
                            display: 'block',
                            width: '120px',
                            marginLeft: '10px',
                            zIndex: '10',
                            marginBottom: '-10px',
                            fontSize: '12px',
                            position: 'relative',
                            backgroundColor: 'white',
                            padding: '0px 5px'
                        }}>Development Type:</label>
                        <div style={{
                            marginBottom: '18px',
                            position: 'relative',
                            zIndex: '9'  // Lower z-index than the label
                        }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                defaultValue={selectedApps?.DEVTYPE}
                                placeholderText="Select Devevelopment Type*"
                                selectOptions={developOptions}
                                selectedOptions={selectedDev}
                                handleChange={handleDevChange}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                        <label style={{
                            display: 'block',
                            width: '55px',
                            marginLeft: '10px',
                            zIndex: '8',
                            marginBottom: '-10px',
                            fontSize: '12px',
                            position: 'relative',
                            backgroundColor: 'white',
                            padding: '0px 5px'
                        }}>Hosting:</label>
                        <div style={{
                            marginBottom: '18px',
                            position: 'relative',
                            zIndex: '7'  // Lower z-index than the label
                        }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                defaultValue={selectedApps?.HOSTED}
                                placeholderText="Select Hosting Type*"
                                selectOptions={hostingOptions}
                                selectedOptions={selectedHosting}
                                handleChange={handleHostingChange}
                            />
                        </div>
                    </div>

                    <div style={{ display: handleHostingTypeVisibility() }}>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <label style={{
                                display: 'block',
                                width: '115px',
                                marginLeft: '10px',
                                zIndex: '6',
                                marginBottom: '-10px',
                                fontSize: '12px',
                                position: 'relative',
                                backgroundColor: 'white',
                                padding: '0px 5px'
                            }}>Operating System:</label>
                            <div style={{
                                marginBottom: '18px',
                                position: 'relative',
                                zIndex: '5'  // Lower z-index than the label
                            }}>
                                <MultipleSelect
                                    isMultiSelect={false}
                                    defaultValue={selectedApps?.OS}
                                    placeholderText="Select Operating System*"
                                    selectOptions={osList}
                                    selectedOptions={selectedOS}
                                    handleChange={handleOSChange}
                                />
                            </div>
                        </div>

                        <NormalTextField
                            label="OS Version"
                            name="OS_VERSION"
                            value={selectedApps.OS_VERSION}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <label style={{
                                display: 'block',
                                width: '60px',
                                marginLeft: '10px',
                                zIndex: '4',
                                marginBottom: '-10px',
                                fontSize: '12px',
                                position: 'relative',
                                backgroundColor: 'white',
                                padding: '0px 5px'
                            }}>Database:</label>
                            <div style={{
                                marginBottom: '18px',
                                position: 'relative',
                                zIndex: '3'  // Lower z-index than the label
                            }}>
                                <MultipleSelect
                                    isMultiSelect={false}
                                    defaultValue={selectedApps?.DATABASE}
                                    placeholderText="Select Database*"
                                    selectOptions={dbList}
                                    selectedOptions={selectedDB }
                                    handleChange={handleDBChange}
                                />
                            </div>
                        </div>

                        <NormalTextField
                            label="Database Version"
                            name="DB_VERSION"
                            value={selectedApps.DB_VERSION}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <label style={{
                                display: 'block',
                                width: '60px',
                                marginLeft: '10px',
                                zIndex: '3',
                                marginBottom: '-10px',
                                fontSize: '12px',
                                position: 'relative',
                                backgroundColor: 'white',
                                padding: '0px 5px'
                            }}>Network:</label>
                            <div style={{
                                marginBottom: '18px',
                                position: 'relative',
                                zIndex: '2'  // Lower z-index than the label
                            }}>
                                <MultipleSelect
                                    isMultiSelect={false}
                                    defaultValue={selectedApps?.NETWORK}
                                    placeholderText="Select Network*"
                                    selectOptions={networkList}
                                    selectedOptions={selectedNetwork}
                                    handleChange={handleNetworkChange}
                                />
                            </div>
                        </div>

                        <NormalTextField
                            label="Network Version"
                            name="NETWORK_VERSION"
                            value={selectedApps?.NETWORK_VERSION}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />

                    </div>



                </div>
            ),
        },
        {
            value: '3',
            label: (
                <div>
                Authentication {authentication ? <CheckCircleRoundedIcon sx={{ fontSize: '18px', color: 'green' }} /> : null}
            </div>
            ),
            content: (
                <div>
                    <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                        <label style={{
                            display: 'block',
                            width: '160px',
                            marginLeft: '10px',
                            zIndex: '100',
                            marginBottom: '-10px',
                            fontSize: '12px',
                            position: 'relative',
                            backgroundColor: 'white',
                            padding: '0px 5px'
                        }}>Authentication Mechanism:</label>
                        <div style={{
                            marginBottom: '18px',
                            position: 'relative',
                            zIndex: '99'  // Lower z-index than the label
                        }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                defaultValue={selectedApps?.AUTHENTICATION_TYPE}
                                placeholderText="Select Login Method*"
                                selectOptions={loginOptions}
                                selectedOptions={selectedAuth}
                                handleChange={handleAuthChange}
                            />

                        </div>
                    </div>

                    <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                        <label style={{
                            display: 'block',
                            width: '290px',
                            marginLeft: '10px',
                            zIndex: '98',
                            marginBottom: '-10px',
                            fontSize: '12px',
                            position: 'relative',
                            backgroundColor: 'white',
                            padding: '0px 5px'
                        }}>Password Settings Configured by Management?</label>
                        <div style={{
                            marginBottom: '18px',
                            position: 'relative',
                            zIndex: '97'  // Lower z-index than the label
                        }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                defaultValue={selectedApps?.PW_CONFIGURABLE}
                                placeholderText="Select Choice*"
                                selectOptions={configureOptions}
                                selectedOptions={selectedConfig}
                                handleChange={handleConfigChange}
                            />
                        </div>
                    </div>


                    <div>
                        <mui.Paper sx={{ padding: '20px;' }}>
                            <mui.Typography variant="subtitle1">
                                Password Settings:
                            </mui.Typography>

                            <mui.Typography variant="subtitle2" sx ={{marginTop: '20px', marginBottom: '20px;'}}>
                                This section is required to be filled-out if users of this application have the capability to log-in directly/natively. 
                            </mui.Typography>

                            <NormalTextField
                                label="Password Length"
                                name="LENGTH"
                                type="number"
                                value={passwordData?.LENGTH}
                                onChange={handleChangePWChange}
                                onBlur={handlePWBlur}
                                required
                            />

                            <NormalTextField
                                label="Password Age"
                                name="AGE"
                                type="number"
                                value={passwordData?.AGE}
                                onChange={handleChangePWChange}
                                onBlur={handlePWBlur}
                                required
                            />

                            <NormalTextField
                                label="Password History"
                                name="HISTORY"
                                type="number"
                                value={passwordData?.HISTORY}
                                onChange={handleChangePWChange}
                                onBlur={handlePWBlur}
                                required
                            />

                            <NormalTextField
                                label="Account Lockout"
                                name="LOCKOUT_ATTEMPT"
                                type="number"
                                value={passwordData?.LOCKOUT_ATTEMPT}
                                onChange={handleChangePWChange}
                                onBlur={handlePWBlur}
                                required
                            />

                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                                <SwitchesGroup title="Complexity Requirements" switches={switches} onChange={handleSwitchChange} />
                            </div>

                        </mui.Paper>
                    </div>

                </div>
            ),
        },
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
                    <mui.Link underline="hover" color="inherit" href="/applications">
                        {selectedApps.COMPANY_NAME}
                    </mui.Link>
                    <mui.Typography color="text.primary"> {selectedApps.APP_NAME}</mui.Typography>
                    <mui.Typography color="text.primary"> Info</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title={`${selectedApps.APP_NAME}`} icon={<GridViewIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage, review, and download application user access data
                </mui.Typography>

                <Separator />

                <DynamicTabs tabs={tabs} />

            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SysOwnerSideBar mainContent={customMainContent} />
        </div>
    );
};

export default MyApplicationGeneralInfo;
