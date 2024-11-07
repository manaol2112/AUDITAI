import React, { useState, useEffect, useRef, Suspense, useCallback  } from 'react';
import SysOwnerSideBar from './SysOwnerSidebar';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import GridViewIcon from '@mui/icons-material/GridView';
import { useParams } from 'react-router-dom';
import appService from '../../../services/ApplicationService';
import DynamicTabs from '../../common/DynamicTabs';
import NormalTextField from '../../common/NormalTextField';
import MultipleSelect from '../../common/MultipleSelect';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import HistoryEduRoundedIcon from '@mui/icons-material/HistoryEduRounded';
import CopyAllRoundedIcon from '@mui/icons-material/CopyAllRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';


const MyApplicationControls = () => {

    const [selectedApps, setSelectedApps] = useState({});
  
    //PROVISIONING
    const [recordExist, setRecordExist] = useState(false);
    const [provisioningData, setProvisioningData] = useState([]);
    const [selectedForm, setSelectedForm] = useState([]);
    const [selectedApprover, setSelectedApprover] = useState([]);
    const [selectedGrantor, setSelectedGrantor] = useState([]);
    const [selectedProcessDiff, setSelectedProcessDiff] = useState([]);

    //TERMINATION
    const [termrecordExist, setTermRecordExist] = useState(false);
    const [terminationData, setTerminationData] = useState([]);
    const [selectedNetReliance, setSelectedNetReliance] = useState([]);
    const [selectedTermDoc, setSelecteTermDoc] = useState([]);
    const [selectedTermProcess, setSelectedTermProcess] = useState([]);
    const [selectedDisableType, setSelectedDisableType] = useState([]);

    //UAR
    const [uarrecordExist, setUARRecordExist] = useState(false);
    const [uarData, setUARData] = useState([]);
    const [frequency, setFrequency] = useState([]);
    const [scopeusers, setScopeUsers] = useState([]);
    const [scoperoles, setScopeRoles] = useState([]);
    const [extractor, setExtractor] = useState([]);
    const [istool, setTool] = useState([]);
    const [SOD, setSOD] = useState([]);
    const [extractsend, setExtractSend] = useState([]);
    const [reviewer, setReviewer] = useState([]);
    const [cnareviewer, setCNAReviewer] = useState([]);
    const [changedoc, setChangeDoc] = useState([]);
    const [changedocsend, setChangeDocSend] = useState([]);
    const [changedocreviewed, setChangeDocReviewed] = useState([]);

    //ADMIN
    const [adminrecordExist, setAdminRecordExist] = useState(false);
    const [adminData, setAdminData] = useState([]);
    const [adminfrequency, setAdminFrequency] = useState([]);
    const [adminroles, setAdminRoles] = useState([]);
    const [adminrolesOption, setAdminRolesOption] = useState([]);
    const [admincapabilities, setAdminCapabilities] = useState([]);
    const [adminreview, setAdminReview] = useState([]);
    const [adminreviewdoc, setAdminReviewDoc] = useState([]);

    const { id } = useParams();
    const saveTimeout = useRef(null);

   
    // Fetch the selected app++
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch apps by ID
                const appsByIdResponse = await appService.fetchAppsById(id);
                setSelectedApps(appsByIdResponse);
            } catch (fetchError) {
                console.error('Error fetching apps:', fetchError);
                setSelectedApps([]); 
            }
        };

        fetchData();
    }, [id]); 

    const safeSplit = (value, delimiter = ',') => {
        if (value && typeof value === 'string') {
            return value.split(delimiter);
        }
        return [];
    };
    // Fetch the selected app
    useEffect(() => {
        const fetchProv = async () => {
            try {
                // Fetch apps by ID
                const provisioningRecord = await appService.getProvisioningProcessByID(id);

                if (provisioningRecord) {

                    setProvisioningData(provisioningRecord);
            
                   // Safely split the strings
                    const formArray = safeSplit(provisioningRecord.FORM);
                    const approvalArray = safeSplit(provisioningRecord.APPROVERS);
                    const grantorArray = safeSplit(provisioningRecord.GRANTOR);
                    const processArray = provisioningRecord.PROCESS_DIFFERENCE
                   
                    const form = formArray.map(item => ({
                        value: item,
                        label: item,
                    }));

                    setSelectedForm(form);
    
                    const approver = approvalArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setSelectedApprover(approver);
    
                    const grantor = grantorArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setSelectedGrantor(grantor);

                    const process = {
                        value: provisioningRecord.PROCESS_DIFFERENCE,
                        label: provisioningRecord.PROCESS_DIFFERENCE
                    };
                    setSelectedProcessDiff(process)
    

                    setRecordExist(true)

                } 
                    
            } catch (error) {
                console.error('Error fetching prov:', error); 
            }
        };

        const fetchTerm = async () => {
            try {

                const terminationRecord = await appService.getTerminationProcessByID(id)

                if (terminationRecord) {

                    const netRelianceArray = safeSplit(terminationRecord.NETWORK_RELIANCE);
                    const documentationArray = safeSplit(terminationRecord.TERM_DOCUMENTATION);
                    const termprocessArray = safeSplit(terminationRecord.TERM_PROCESS);
                    const disabletypeArray = safeSplit(terminationRecord.DISABLE_TYPE);
                    
                    setTerminationData(terminationRecord)

                    const netreliance = netRelianceArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setSelectedNetReliance(netreliance);

                    const termdoc = documentationArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setSelecteTermDoc(termdoc);

                    const termprocess = termprocessArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setSelectedTermProcess(termprocess);

                    const disabletype = disabletypeArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setSelectedDisableType(disabletype);

                }
            
            
            } catch (error) {
                console.error('Error fetching termed', error);  
            }
        };

        const fetchUAR = async () => {

            try {
                const uarRecord = await appService.getUARProcessByID(id)

               
                if (uarRecord) {

                
                    setUARData(uarRecord)

                    setUARRecordExist(true)

                    const frequencyArray = safeSplit(uarRecord.FREQUENCY)
                    const scopeuserArray = safeSplit(uarRecord.SCOPE_USERS)
                    const scoperolesArray = safeSplit(uarRecord.SCOPE_ROLES)
                    const extractSendArray = safeSplit(uarRecord.EXTRACTION_SEND)
                    const extractorArray = safeSplit(uarRecord.EXTRACTOR)
                    const reviewerArray = safeSplit(uarRecord.REVIEWER)
                    const cnaReviewerArray = safeSplit(uarRecord.CNA_REVIEWER)
                    const changeDocArray = safeSplit(uarRecord.CHANGE_DOCUMENTATION)
                    const changeDocSendArray = safeSplit(uarRecord.CHANGE_DOCUMENTATION_SEND)
                    const changeDocReviewedArray = safeSplit(uarRecord.CHANGE_DOCUMENTATION_REVIEWED)

                    const frequency = frequencyArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setFrequency(frequency);

                    const scopeusers = scopeuserArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setScopeUsers(scopeusers);

                    const scoperoles = scoperolesArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setScopeRoles(scoperoles);

                    const extractor = extractorArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setExtractor(extractor);

                    const istool = {
                        value: uarRecord.IS_TOOL,
                        label: uarRecord.IS_TOOL
                    };
                    setTool(istool)

                    const SOD = {
                        value: uarRecord.SOD_CHECK,
                        label: uarRecord.SOD_CHECK
                    };
                    setSOD(SOD)

                    const extractsend = extractSendArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setExtractSend(extractsend);

                    const reviewer = reviewerArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setReviewer(reviewer);

                    const cnareviewer = cnaReviewerArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setCNAReviewer(cnareviewer);

                    const changedoc = changeDocArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setChangeDoc(changedoc);

                    const changedocsend = changeDocSendArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setChangeDocSend(changedocsend);

                    const changedocreviewed = changeDocReviewedArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setChangeDocReviewed(changedocreviewed);

                }

            } catch (error) {
                console.error('Error fetching UAR:', error);  
            }
        };

        const fetchAdmin = async () => {
            try {

                const AppRecord = await appService.fetchAppsRecordById(id)

                if (AppRecord) {
                    //Get the active users
                    const roles = AppRecord.filter(user => user.ROLE_NAME && user.ROLE_NAME.toLowerCase() !== '');
                    const uniqueRoles = Array.from(new Set(roles.map(user => user.ROLE_NAME)));

                    const uniqueroles = uniqueRoles.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setAdminRolesOption(uniqueroles);
                } else {
                    setAdminRolesOption([]);
                }

                const adminRecord = await appService.getAdminProcessByID(id)

                if (adminRecord) { 


                    const admincapabilitiesArray = safeSplit(adminRecord.CAPABILITIES)
                    const adminfrequencyArray = safeSplit(adminRecord.ADMIN_REVIEW_FREQUENCY)
                    const adminreviewdocArray = safeSplit(adminRecord.ADMIN_REVIEW_DOCUMENT)
                    const adminrolesArray = safeSplit(adminRecord.ADMIN_ROLES)
                 

                    setAdminRecordExist(true)

                    setAdminData(adminRecord)

                    const capabilities = admincapabilitiesArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setAdminCapabilities(capabilities);


                    const adminreview = {
                        value: adminRecord.ADMIN_REVIEW_PERFORMED,
                        label: adminRecord.ADMIN_REVIEW_PERFORMED
                    };
                    setAdminReview(adminreview)

                    const frequency = adminfrequencyArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setAdminFrequency(frequency);

                    const adminreviewdoc = adminreviewdocArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setAdminReviewDoc(adminreviewdoc);

                    const adminroles = adminrolesArray.map(item => ({
                        value: item,
                        label: item,
                    }));
                    setAdminRoles(adminroles);

                }

            }
            catch (error) {
                console.error('Error fetching Admins:', error);  
            }
        }

        fetchProv()
        fetchTerm()
        fetchUAR()
        fetchAdmin()
    },

    []); 

        //TRIGGER THE CHECKMARK
        useEffect(() => {
            visibleCheckMark();
        }, [provisioningData, terminationData, uarData, adminData]);

    const saveChanges = async (updatedData) => {
        try {
            if (recordExist) {
                // Update existing record
                const updated_record = await appService.updateProvisioningProcess(id, updatedData);
                setProvisioningData(updated_record);
                setRecordExist(true);
            } else {
                // Create a new record
                if (id) {
                    const newData = { ...updatedData, APP_NAME: id };
                    const newRecord = await appService.createProvisioningProcess(newData);
                    setProvisioningData(newRecord);
                    setRecordExist(true);
                }
            }
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    const saveTermChanges = async (updatedData) => {
        try {
            if (termrecordExist) {
                const updated_record = await appService.updateTerminationProcess(id, updatedData)
                setTerminationData(updated_record)
                setTermRecordExist(true)

            } else {
                if (id) {
                    const newData = { ...updatedData, APP_NAME: id };
                    const newRecord = await appService.createTerminationProcess(newData);
                    setTerminationData(newRecord);
                    setTermRecordExist(true);
                }
            }
        } catch (error) {
            console.error('Error updating record:', error);
        }
    }

    const saveUARChanges = async (updatedData) => {
        try {
            if (uarrecordExist) {
                const updated_record = await appService.updateUARProcess(id, updatedData)
                setUARData(updated_record)
                setUARRecordExist(true)

            } else {
                if (id) {
                    const newData = { ...updatedData, APP_NAME: id };
                    const newRecord = await appService.createUARProcess(newData);
                    setUARData(newRecord);
                    setUARRecordExist(true);
                }
            }
        } catch (error) {
            console.error('Error updating uar record:', error);
        }
    }

    const saveAdminChanges = async (updatedData) => {
        try {
            if (adminrecordExist) {
                const updated_record = await appService.updateAdminProcess(id, updatedData)
                setAdminData(updated_record)
                setAdminRecordExist(true)

            } else {
                if (id) {
                    const newData = { ...updatedData, APP_NAME: id };
                    const newRecord = await appService.createAdminProcess(newData);
                    setAdminData(newRecord);
                    setAdminRecordExist(true);
                }
            }
        } catch (error) {
            console.error('Error updating admin record:', error);
        }
    }

    const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';
    const isValidInteger = (value) => Number.isInteger(value) && value > 0;
    const [provCheck, setProvCheck] = useState(false);
    const [termCheck, setTermCheck] = useState(false);
    const [uarCheck, setUARCheck] = useState(false);
    const [adminCheck, setAdminCheck] = useState(false);

    const saveAppChanges = async (updatedData) => {
        try {
            const response = await appService.updateApp(id, updatedData);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    useEffect(() => {
        visibleCheckMark();
    }, [selectedApps, provisioningData, terminationData, uarData, adminData]);

    const visibleCheckMark = () => {

        let provisioningValid = false;
        let terminationValid = false;
        let uarValid = false;
        let adminValid = false;

        //PROVISIONING
        if (
            isNonEmptyString(provisioningData.FORM) &&
            isNonEmptyString(provisioningData.APPROVERS) &&
            isNonEmptyString(provisioningData.GRANTOR) &&
            isNonEmptyString(provisioningData.PROCESS_DIFFERENCE)
        ) {
            setProvCheck(true)
            provisioningValid = true;
        } else {
            setProvCheck(false)
            provisioningValid = false;
        }

        //TERMINATION   
        if (
            isNonEmptyString(terminationData.NETWORK_RELIANCE) &&
            isNonEmptyString(terminationData.TIMELINESS) &&
            isNonEmptyString(terminationData.TERM_DOCUMENTATION) &&
            isNonEmptyString(terminationData.TERM_PROCESS) &&
            isNonEmptyString(terminationData.TERM_AUTOMATED_DESC) &&
            isNonEmptyString(terminationData.DISABLE_TYPE) 
        ) {
            setTermCheck(true)
            terminationValid = true;
        } else {
            setTermCheck(false)
            terminationValid = false;
        }

         //UAR   
         if (
            isNonEmptyString(uarData.FREQUENCY) &&
            isNonEmptyString(uarData.DAYS_TO_COMPLETE) &&
            isNonEmptyString(uarData.SCOPE_USERS) &&
            isNonEmptyString(uarData.SCOPE_ROLES) &&
            isNonEmptyString(uarData.EXTRACTOR) &&
            isNonEmptyString(uarData.IS_TOOL) &&
            isNonEmptyString(uarData.EXTRACTION_SEND) &&
            isNonEmptyString(uarData.REVIEWER) &&
            isNonEmptyString(uarData.CNA_REVIEWER) &&
            isNonEmptyString(uarData.CNA_PROCESS) &&
            isNonEmptyString(uarData.CHANGE_DOCUMENTATION) &&
            isNonEmptyString(uarData.CHANGE_DOCUMENTATION_SEND) &&
            isNonEmptyString(uarData.CHANGE_TIMELINE) &&
            isNonEmptyString(uarData.CHANGE_DOCUMENTATION_REVIEWED) &&
            isNonEmptyString(uarData.SOD_CHECK)
        ) {
            setUARCheck(true)
            uarValid = true;
        } else {
            setUARCheck(false)
            uarValid = false;
        }

        //ADMIN 
        if (
            isNonEmptyString(adminData.ADMIN_ROLES) &&
            isNonEmptyString(adminData.CAPABILITIES) &&
            isNonEmptyString(adminData.ADMIN_REVIEW_PERFORMED) &&
            isNonEmptyString(adminData.ADMIN_REVIEW_FREQUENCY) &&
            isNonEmptyString(adminData.ADMIN_REVIEW_DOCUMENT) 
        ) {
            setAdminCheck(true)
            adminValid = true;
        } else {
            setAdminCheck(false)
            adminValid = false;
        }

        const isProcessValid = provisioningValid && terminationValid && uarValid && adminValid;

        if (isProcessValid) {
            const updatedData = {
                ...selectedApps,
                SETUP_PROCESS: true
            };
            saveAppChanges(updatedData)
           
        } else {

            const updatedData = {
                ...selectedApps,
                SETUP_PROCESS: false
            };
            saveAppChanges(updatedData)
        }
    };

    //PROVISIONING OPTIONS
    const documentationOptions = [
        { value: 'Email', label: 'Email' },
        { value: 'Ticketing System', label: 'Ticketing System' },
        { value: 'Verbal', label: 'Verbal' },
    ];

    const approverOptions = [
        { value: 'Immediate Superior/Manager or Equivalent', label: 'Immediate Superior/Manager or Equivalent' },
        { value: 'Role Owner', label: 'Role Owner' },
        { value: 'IT System Owner', label: 'IT System Owner' },
        { value: 'Other', label: 'Other' },
    ];

    const grantorOptions = [
        { value: 'System Administrator', label: 'System Administrator' },
        { value: 'Vendor', label: 'Vendor' },
        { value: 'Automated', label: 'Automated' },
        { value: 'Other', label: 'Other' },
    ];

    const YesNoOptions = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
    ];

     //TERMINATION OPTIONS
    const termed_documentationOptions = [
        { value: 'Email', label: 'Email' },
        { value: 'Ticketing System', label: 'Ticketing System' },
        { value: 'Verbal', label: 'Verbal' },
    ];

    const revokeMethodOptions = [
        { value: 'Manual', label: 'Manual' },
        { value: 'Automated', label: 'Automated' },
    ];

    const networkrelianceOptions = [
        { value: 'Yes - Full Reliance', label: 'Yes - Full Reliance' },
        { value: 'Yes - Partial Reliance', label: 'Yes - Partial Reliance' },
        { value: 'No - Not Reyling', label: 'No - Not Relying' },
    ];

    const revokeOptions = [
        { value: 'Deactivated', label: 'Deactivated' },
        { value: 'Deleted', label: 'Deleted' },
    ];


    //UAR PROCESS
    const frequencyOptions = [
        { value: 'Weekly', label: 'Weekly' },
        { value: 'Bi-Weekly', label: 'Bi-Weekly' },
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Quarterly', label: 'Quarterly' },
        { value: 'Semi-Annually', label: 'Semi-Annually' },
        { value: 'Annually', label: 'Annually' },
    ];

    const scopeusersOptions = [
        { value: 'Employees', label: 'Employees' },
        { value: 'Contractors', label: 'Contractors' },
        { value: 'Vendor Accounts', label: 'Vendor Accounts' },
        { value: 'System Accounts', label: 'System Accounts' },
    ];

    const scoperolesOptions = [
        { value: 'Role Assignments', label: 'Role Assignments' },
        { value: 'Roles and Permissions', label: 'Roles and Permissions' },
    ];

    const reviewOptions = [
        { value: 'Users Supervisor/Manager or equivalent', label: 'Users Supervisor/Manager or equivalent' },
        { value: 'Roles Owners', label: 'Roles Owners' },
        { value: 'System Owners', label: 'System Owners' },
    ];

    const cnareviewOptions = [
        { value: 'Users Supervisor/Manager or equivalent', label: 'Users Supervisor/Manager or equivalent' },
        { value: 'Roles Owners', label: 'Roles Owners' },
        { value: 'System Owners', label: 'System Owners' },
        { value: 'System Administrators', label: 'System Administrators' },
    ];

    const extractorOptions = [
        { value: 'System Administrators', label: 'System Administrators' },
        { value: 'Vendors', label: 'Vendors' },
    ];

    const toolOptions = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
    ];

    const changerequestdocOptions = [
        { value: 'Added Column in the User Access Report', label: 'Added Column in the User Access Report' },
        { value: 'Within the Tool used in UAR', label: 'Within the Tool used in UAR' },
        { value: 'Email', label: 'Email' },
        { value: 'Ticketing System', label: 'Ticketing System' },
        { value: 'Chat', label: 'Chat' },
    ];

    const changecommunicationOptions = [
        { value: 'Email', label: 'Email' },
        { value: 'Ticketing System', label: 'Ticketing System' },
        { value: 'Chat', label: 'Chat' },
        { value: 'Verbal', label: 'Verbal' },
    ];

    const changeactiondocOptions = [
        { value: 'Screenshot attached in the UAR documentation', label: 'Screenshot attached in the UAR documentation' },
        { value: 'Downloaded updated user list', label: 'Downloaded updated user list' },
        { value: 'Email confirmation about the actions taken', label: 'Email confirmation about the actions taken' },
        { value: 'Attached as support within the ticket', label: 'Attached as support within the ticket' },
    ];

    const SODYesNoOptions = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
    ];

    //ADMIN PROCESS
    const capabilitiesOptions = [
        { value: 'Manage User Access (create, update, and delete)', label: 'Manage User Access (create, update, and delete)'},
        { value: 'Manage System Configuration', label: 'Manage System Configuration' },
        { value: 'Develop Changes in Production', label: 'Develop Changes in Production' },
        { value: 'Implement Changes in Production', label: 'Implement Changes in Production' },
    ];

    const AdminYesNoOptions = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
    ];

    const adminreviewdocOptions = [
        { value: 'Added Column in the Admin Activity Report', label: 'Added Column in the Admin Activity Report' },
        { value: 'Reviewed as part of the UAR', label: 'Reviewed as part of the UAR' },
        { value: 'Email', label: 'Email' },
        { value: 'Ticketing System', label: 'Ticketing System' },
        { value: 'Chat', label: 'Chat' },
    ];


    const handleFormChange = (selectedOptions) => {
        const formatted_form = selectedOptions.map(option => option.value);
        const forms = formatted_form.join(',');

        setSelectedForm(selectedOptions)
    
        // Update the state with the new FORM value
        const updatedData = {
            ...provisioningData,
            FORM: forms
        };
        saveChanges(updatedData)
    };

    const handleApprovalChange = (selectedOptions) => {

        const formatted_approval = selectedOptions.map(option => option.value);
        const approver = formatted_approval.join(',');

        setSelectedApprover(selectedOptions)

            const updatedData = {
                ...provisioningData,
                APPROVERS: approver
            };
     
        saveChanges(updatedData)

    };

    const handleGrantorChange = (selectedOptions) => {
        const formatted_grantor = selectedOptions.map(option => option.value);
        const grantor = formatted_grantor.join(',');

        setSelectedGrantor(selectedOptions)

            const updatedData = {
                ...provisioningData,
                GRANTOR: grantor
            };
            // Save changes with the updated state

            saveChanges(updatedData)
    };

    const handleProcessDiffChange = (selectedOptions) => {

        const process = selectedOptions.value
        setSelectedProcessDiff(selectedOptions)
        
            const updatedData = {
                ...provisioningData,
                PROCESS_DIFFERENCE: process
            };
            // Save changes with the updated state
            saveChanges(updatedData)

    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }
            const updatedData = {
                ...provisioningData,
                [name]: value
            };
            // Save changes with the updated state
            saveTimeout.current = setTimeout(() => {
                saveChanges(updatedData);
            }, 1000); 

            setProvisioningData(updatedData)

    };

    const handleBlur = (e) => {
        const { name, value } = e.target;

            const updatedData = {
                ...provisioningData,
                [name]: value
            };
            saveChanges(updatedData);

            setProvisioningData(updatedData)
    };

    //TERMATION SECTION
    const handleRelianceChange = (selectedOptions) => {

        const formatted_reliance = selectedOptions.map(option => option.value);
        const reliance = formatted_reliance.join(',');

        setSelectedNetReliance(selectedOptions)
        
            const updatedData = {
                ...terminationData,
                NETWORK_RELIANCE: reliance
            };
            // Save changes with the updated state
            saveTermChanges(updatedData)
    }

    const handleTermDocChange = (selectedOptions) => {
        const formatted_termdoc = selectedOptions.map(option => option.value);
        const termdoc = formatted_termdoc.join(',');

        setSelecteTermDoc(selectedOptions)
        
            const updatedData = {
                ...terminationData,
                TERM_DOCUMENTATION: termdoc
            };
            // Save changes with the updated state
            saveTermChanges(updatedData)
    }

    const handleTermProcessChange = (selectedOptions) => {
        const formatted_termprocess = selectedOptions.map(option => option.value);
        const termprocess = formatted_termprocess.join(',');

        setSelectedTermProcess(selectedOptions)
        
            const updatedData = {
                ...terminationData,
                TERM_PROCESS: termprocess
            };
            // Save changes with the updated state
            saveTermChanges(updatedData)
    }

    const handleDisableTypeChange = (selectedOptions) => {
        const formatted_disabletype = selectedOptions.map(option => option.value);
        const disableType = formatted_disabletype.join(',');

        setSelectedDisableType(selectedOptions)
        
            const updatedData = {
                ...terminationData,
                DISABLE_TYPE: disableType
            };
            // Save changes with the updated state
            saveTermChanges(updatedData)
    }

    const handleTermChange = (e) => {
        const { name, value } = e.target;

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }
            const updatedData = {
                ...terminationData,
                [name]: value
            };
            // Save changes with the updated state
            saveTimeout.current = setTimeout(() => {
                saveTermChanges(updatedData);
            }, 1000); 

            setTerminationData(updatedData)

    };

    const handleTermBlur = (e) => {
        const { name, value } = e.target;

            const updatedData = {
                ...terminationData,
                [name]: value
            };
            saveTermChanges(updatedData);

            setTerminationData(updatedData)
    };


    //UAR SECTION
    const handleUARChange = (e) => {
        const { name, value } = e.target;

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }
            const updatedData = {
                ...uarData,
                [name]: value
            };
            // Save changes with the updated state
            saveTimeout.current = setTimeout(() => {
                saveUARChanges(updatedData);
            }, 1000); 

            setUARData(updatedData)

    };

    const handleUARBlur = (e) => {
        const { name, value } = e.target;

            const updatedData = {
                ...uarData,
                [name]: value
            };
            saveUARChanges(updatedData);

            setUARData(updatedData)
    };

    const handleFrequencyChange = (selectedOptions) => {
        const frequency = selectedOptions.value
        setFrequency(selectedOptions)
        
            const updatedData = {
                ...uarData,
                FREQUENCY: frequency
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    const handleScopeUsersChange = (selectedOptions) => {
        const formatted_scopeusers = selectedOptions.map(option => option.value);
        const scopeusers = formatted_scopeusers.join(',');

        setScopeUsers(selectedOptions)
        
            const updatedData = {
                ...uarData,
                SCOPE_USERS: scopeusers
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    const handleScopeRolesChange = (selectedOptions) => {
        const formatted_scopeuroles = selectedOptions.map(option => option.value);
        const scoperoles = formatted_scopeuroles.join(',');

        setScopeRoles(selectedOptions)
        
            const updatedData = {
                ...uarData,
                SCOPE_ROLES: scoperoles
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    const handleExtractorChange = (selectedOptions) => {
        const formatted_extractor = selectedOptions.map(option => option.value);
        const extractor = formatted_extractor.join(',');

        setExtractor(selectedOptions)
        
            const updatedData = {
                ...uarData,
                EXTRACTOR: extractor
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    const handleIsToolChange = (selectedOptions) => {

        const isTool = selectedOptions.value
        setTool(selectedOptions)
        
            const updatedData = {
                ...uarData,
                IS_TOOL: isTool
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    const handleExtractSendChange = (selectedOptions) => {
        const formatted_extractsend = selectedOptions.map(option => option.value);
        const extractsend = formatted_extractsend.join(',');

        setExtractSend(selectedOptions)
        
            const updatedData = {
                ...uarData,
                EXTRACTION_SEND: extractsend
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    const handleReviewerChange = (selectedOptions) => {
        const formatted_reviewer = selectedOptions.map(option => option.value);
        const reviewer = formatted_reviewer.join(',');

        setReviewer(selectedOptions)
        
            const updatedData = {
                ...uarData,
                REVIEWER: reviewer
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    const handleCNAReviewerChange = (selectedOptions) => {
        const formatted_cnareviewer = selectedOptions.map(option => option.value);
        const cnareviewer = formatted_cnareviewer.join(',');

        setCNAReviewer(selectedOptions)
        
            const updatedData = {
                ...uarData,
                CNA_REVIEWER: cnareviewer
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    const handleChangeDocChange = (selectedOptions) => {
        const formatted_changedoc = selectedOptions.map(option => option.value);
        const changedoc = formatted_changedoc.join(',');

        setChangeDoc(selectedOptions)
        
            const updatedData = {
                ...uarData,
                CHANGE_DOCUMENTATION: changedoc
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    const handleChangeDocSendChange = (selectedOptions) => {
        const formatted_changedocsend = selectedOptions.map(option => option.value);
        const changedocsend = formatted_changedocsend.join(',');

        setChangeDocSend(selectedOptions)
        
            const updatedData = {
                ...uarData,
                CHANGE_DOCUMENTATION_SEND: changedocsend
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    const handleChangeDocResolutionChange = (selectedOptions) => {
        const formatted_changedocresolve = selectedOptions.map(option => option.value);
        const changedocresolve = formatted_changedocresolve.join(',');

        setChangeDocReviewed(selectedOptions)
        
            const updatedData = {
                ...uarData,
                CHANGE_DOCUMENTATION_REVIEWED: changedocresolve
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    const handleSODChange = (selectedOptions) => {

        const SOD = selectedOptions.value
        setSOD(selectedOptions)
        
            const updatedData = {
                ...uarData,
                SOD_CHECK: SOD
            };
            // Save changes with the updated state
            saveUARChanges(updatedData)
    }

    //ADMIN SECTION

    const handleAdminChange = (e) => {
        const { name, value } = e.target;

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current);
        }
            const updatedData = {
                ...adminData,
                [name]: value
            };
            // Save changes with the updated state
            saveTimeout.current = setTimeout(() => {
                saveAdminChanges(updatedData);
            }, 1000); 

            setAdminData(updatedData)

    };

    const handleAdminBlur = (e) => {
        const { name, value } = e.target;

            const updatedData = {
                ...adminData,
                [name]: value
            };
            saveAdminChanges(updatedData);

            setAdminData(updatedData)
    };

    const handleAdminRolesChange = (selectedOptions) => {
        const formatted_adminroles = selectedOptions.map(option => option.value);
        const adminroles = formatted_adminroles.join(',');

        setAdminRoles(selectedOptions)
        
            const updatedData = {
                ...adminData,
                ADMIN_ROLES: adminroles
            };
            // Save changes with the updated state
            saveAdminChanges(updatedData)
    }

    const handleCapabilitiesChange = (selectedOptions) => {
        const formatted_capabilities = selectedOptions.map(option => option.value);
        const capabilities = formatted_capabilities.join(',');

        setAdminCapabilities(selectedOptions)
        
            const updatedData = {
                ...adminData,
                CAPABILITIES: capabilities
            };
            // Save changes with the updated state
            saveAdminChanges(updatedData)
    }

    const handleAdminReviewChange = (selectedOptions) => {

        const adminreview = selectedOptions.value
        setAdminReview(selectedOptions)
        
            const updatedData = {
                ...adminData,
                ADMIN_REVIEW_PERFORMED: adminreview
            };
            // Save changes with the updated state
            saveAdminChanges(updatedData)
    }

    const handleAdminFrequencyChange = (selectedOptions) => {

        const adminfrequency = selectedOptions.value
        setAdminFrequency(selectedOptions)
        
            const updatedData = {
                ...adminData,
                ADMIN_REVIEW_FREQUENCY: adminfrequency
            };
            // Save changes with the updated state
            saveAdminChanges(updatedData)
    }

    const handleAdminReviewDocChange = (selectedOptions) => {
        const formatted_adminreviewdoc = selectedOptions.map(option => option.value);
        const adminreviewdoc = formatted_adminreviewdoc.join(',');

        setAdminReviewDoc(selectedOptions)
        
            const updatedData = {
                ...adminData,
                ADMIN_REVIEW_DOCUMENT: adminreviewdoc
            };
            // Save changes with the updated state
            saveAdminChanges(updatedData)
    }

    const tabs = [

        {
            value: '1',
            label: (<div>
                Access Provisioning {provCheck ? <CheckCircleRoundedIcon sx={{ fontSize: '18px', color: 'green' }} /> : null}
            </div>),
            content: (
                <div>

                    <mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center' }}>
                        <mui.Tooltip title="Import Existing Process">
                            <mui.IconButton>
                                <CopyAllRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                        <mui.Tooltip title="Certify Accuracy">
                            <mui.IconButton>
                                <HistoryEduRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                        <mui.Tooltip title="Download Process Narrative">
                            <mui.IconButton>
                                <FileDownloadRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                    </mui.Box>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Documentation:
                        </mui.Typography>
                        <mui.Typography variant="subtitle2">
                            How is the user access request currently submitted and documented?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Documentation Form"
                                selectedOptions={selectedForm}
                                selectOptions={documentationOptions}
                                value={selectedForm}
                                handleChange={handleFormChange}
                            />
                        </div>
                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Approval:
                        </mui.Typography>
                        <mui.Typography variant="subtitle2" display="block">
                            Who are the required approvers of access requests in {selectedApps.APP_NAME}?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Approvers"
                                selectOptions={approverOptions}
                                selectedOptions={selectedApprover}
                                value={selectedApprover}
                                handleChange={handleApprovalChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2" sx={{ marginRight: '20px' }}>
                            If 'Other' is selected in the question above, provide the approver details here. Otherwise, you can leave this blank:
                        </mui.Typography>
                        <NormalTextField
                            label=""
                            name="APPROVERS_OTHER"
                            value={provisioningData.APPROVERS_OTHER}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Access Granting:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2" display="block">
                            Who is responsible in granting the access to the system?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Access Grantor"
                                selectOptions={grantorOptions}
                                selectedOptions={selectedGrantor}
                                value={selectedGrantor}
                                handleChange={handleGrantorChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2" sx={{ marginRight: '20px' }}>
                            If 'Other' is selected in the question above, provide the approver details here. Otherwise, you can leave this blank:
                        </mui.Typography>
                        <NormalTextField
                            label=""
                            name="GRANTOR_OTHER"
                            value={provisioningData.GRANTOR_OTHER}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>

                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Process Confirmation:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2" display="block">
                            Are there any differences in granting access of non-employee (e.g., vendors, contractors)?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                defaultValue={provisioningData.PROCESS_DIFFERENCE ? provisioningData.PROCESS_DIFFERENCE : 'Select Confirmation*'}
                                placeholderText="Select Confirmation"
                                selectOptions={YesNoOptions}
                                selectedOptions={selectedProcessDiff ? selectedProcessDiff: ''}
                                handleChange={handleProcessDiffChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2" sx={{ marginRight: '20px' }}>
                            If you answer on the question above is 'Yes', provide more details in terms of the differences. Otherwise, you can leave this blank:
                        </mui.Typography>
                        <NormalTextField
                            label=""
                            name="PROCESS_DIFFERENCE_OTHER"
                            value={provisioningData.PROCESS_DIFFERENCE_OTHER}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />

                    </mui.Paper>

                </div>
            ),
        },
        {
            value: '2',
            label: (<div>
                Access Termination {termCheck ? <CheckCircleRoundedIcon sx={{ fontSize: '18px', color: 'green' }} /> : null}
            </div>),
            content: (
                <div>
                    <mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center' }}>
                        <mui.Tooltip title="Process Inventory">
                            <mui.IconButton>
                                <CopyAllRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                        <mui.Tooltip title="Certify Accuracy">
                            <mui.IconButton>
                                <HistoryEduRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                        <mui.Tooltip title="Download Process Narrative">
                            <mui.IconButton>
                                <FileDownloadRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>
                    </mui.Box>


                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                        Network Termination Reliance:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            Is {selectedApps.APP_NAME} relying on the effectiveness of network access termination?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Reliance"
                                selectedOptions={selectedNetReliance}
                                selectOptions={networkrelianceOptions}
                                value={selectedNetReliance}
                                handleChange={handleRelianceChange}
                            />
                        </div>

                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            TIMELINESS:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            What is the timeline to revoke user access upon receiving the termination notification (in days)?
                        </mui.Typography>

                        <NormalTextField
                           
                            type="number"
                            name="TIMELINESS"
                            value={terminationData.TIMELINESS}
                            onChange={handleTermChange}
                            onBlur={handleTermBlur}
                        />
                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Documentation:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            How are the system administrators notified of the termed users?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Documentation Form"
                                selectedOptions={selectedTermDoc}
                                selectOptions={termed_documentationOptions}
                                value={selectedTermDoc}
                                handleChange={handleTermDocChange}
                            />
                        </div>
                        <mui.Typography variant="subtitle2" sx={{ marginRight: '20px' }}>
                            If not provided in the items above, please describe how admins are notified
                        </mui.Typography>
                        <NormalTextField
                            
                            name="TERM_DOCUMENTATION_OTHER"
                            value={terminationData.TERM_DOCUMENTATION_OTHER}
                            onChange={handleTermChange}
                            onBlur={handleTermBlur}
                        />
                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                        TERMINATION PROCESS:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            Is the process of terminating user access Manual and/or Automated?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Documentation Form"
                                selectedOptions={selectedTermProcess}
                                selectOptions={revokeMethodOptions}
                                value={selectedTermProcess}
                                handleChange={handleTermProcessChange}
                            />
                        </div>
                        <mui.Typography variant="subtitle2" sx={{ marginRight: '20px' }}>
                            If Automated, provide details on how access are disabled automatically (e.g., tools used, trigger to terminate access)
                        </mui.Typography>
                        <NormalTextField
                           
                            name="TERM_AUTOMATED_DESC"
                            value={terminationData.TERM_AUTOMATED_DESC}
                            onChange={handleTermChange}
                            onBlur={handleTermBlur}
                        />
                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Disable type:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            Are user access deactivated and/or deleted upon termination?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Documentation Form"
                                selectedOptions={selectedDisableType}
                                selectOptions={revokeOptions}
                                value={selectedDisableType}
                                handleChange={handleDisableTypeChange}
                            />
                        </div>
                        <mui.Typography variant="subtitle2" sx={{ marginRight: '20px' }}>
                            If not provided in the items above, please describe how access are terminated
                        </mui.Typography>
                        <NormalTextField
                          
                            name="DISABLE_TYPE_OTHER"
                            value={terminationData.DISABLE_TYPE_OTHER}
                            onChange={handleTermChange}
                            onBlur={handleTermBlur}
                        />
                    </mui.Paper>

                </div>
            ),
        },
        {
            value: '3',
            label: (<div>
                User Access Review {uarCheck ? <CheckCircleRoundedIcon sx={{ fontSize: '18px', color: 'green' }} /> : null}
            </div>),
            content: (
                <div>
                    <mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center' }}>
                        <mui.Tooltip title="Process Inventory">
                            <mui.IconButton>
                                <CopyAllRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                        <mui.Tooltip title="Certify Accuracy">
                            <mui.IconButton>
                                <HistoryEduRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>
                        <mui.Tooltip title="Download Process Narrative">
                            <mui.IconButton>
                                <FileDownloadRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                    </mui.Box>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Frequency and Timeline:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            What is the frequency of the user access review for {selectedApps.APP_NAME}?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                placeholderText="Select Frequency"
                                selectedOptions={frequency}
                                selectOptions={frequencyOptions}
                                value={frequency}
                                handleChange={handleFrequencyChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                            How many days must the access review be completed upon initiation?
                        </mui.Typography>

                        <NormalTextField
                          name="DAYS_TO_COMPLETE"
                          value={uarData.DAYS_TO_COMPLETE}
                          onChange={handleUARChange}
                          onBlur={handleUARBlur}
                          type="number"
                          min="0" 
                      />

                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Scope of Review:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            Which accounts are reviewed as part of the access review process?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Accounts"
                                selectedOptions={scopeusers}
                                selectOptions={scopeusersOptions}
                                value={scopeusers}
                                handleChange={handleScopeUsersChange}
                            />
                        </div>


                        <mui.Typography variant="subtitle2">
                            Which accounts/roles are exempted from the user access review?
                        </mui.Typography>

                        <NormalTextField
                          name="SCOPE_EXEMPTED"
                          value={uarData.SCOPE_EXEMPTED}
                          onChange={handleUARChange}
                          onBlur={handleUARBlur}
                      />

                        <mui.Typography variant="subtitle2">
                            What is the coverage of the review?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Coverage"
                                selectedOptions={scoperoles}
                                selectOptions={scoperolesOptions}
                                value={scoperoles}
                                handleChange={handleScopeRolesChange}
                            />
                        </div>

                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            User Data Extraction:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            Which team is responsible in extracting user list within {selectedApps.APP_NAME}?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Extractor"
                                selectedOptions={extractor}
                                selectOptions={extractorOptions}
                                value={extractor}
                                handleChange={handleExtractorChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                            Is there a tool used to extract users access report?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                     isMultiSelect={false}
                                     defaultValue={uarData.IS_TOOL ? uarData.IS_TOOL : 'Select Confirmation*'}
                                     placeholderText="Select Confirmation"
                                     selectOptions={toolOptions}
                                     selectedOptions={istool ? istool: ''}
                                     handleChange={handleIsToolChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                            If a tool is used to extract, type the name of the tool below
                        </mui.Typography>

                        <NormalTextField
                          name="TOOL_NAME"
                          value={uarData.TOOL_NAME}
                          onChange={handleUARChange}
                          onBlur={handleUARBlur}
                      />

                    <mui.Typography variant="subtitle2">
                            How is the extracted user access report sent to the review owners?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Submission Channel"
                                selectedOptions={extractsend}
                                selectOptions={documentationOptions}
                                value={extractsend}
                                handleChange={handleExtractSendChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                           Provide details if the method of submission is not included in the items above
                        </mui.Typography>

                        <NormalTextField
                          
                          name="EXTRACTION_SEND_OTHER"
                          value={uarData.EXTRACTION_SEND_OTHER}
                          onChange={handleUARChange}
                          onBlur={handleUARBlur}
                      />

                    </mui.Paper>


                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Reviewer:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            Which team is responsible in reviewing and approving the user access report?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Documentation Form"
                                selectedOptions={reviewer}
                                selectOptions={reviewOptions}
                                value={reviewer}
                                handleChange={handleReviewerChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                            If reviewer/team is not included in the list above, type the reviewer/team name of the reviewer
                        </mui.Typography>

                        <NormalTextField
                          
                          name="REVIEWER_OTHER"
                          value={uarData.REVIEWER_OTHER}
                          onChange={handleUARChange}
                          onBlur={handleUARBlur}
                      />

                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Completeness and accuracy check:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            Which team is responsible in performing the completeness and accuracy check of the access reports?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Documentation Form"
                                selectedOptions={cnareviewer}
                                selectOptions={cnareviewOptions}
                                value={cnareviewer}
                                handleChange={handleCNAReviewerChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                           How is the completeness and accuracy check performed and documented?
                        </mui.Typography>

                        <NormalTextField
                          name="CNA_PROCESS"
                          value={uarData.CNA_PROCESS}
                          onChange={handleUARChange}
                          onBlur={handleUARBlur}
                          isMultiLine={true}
                          rows="5"
                      />

                    </mui.Paper>


                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Requested access Changes:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                           Where is the review owner's decision on access request changes recorded?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Documentation Form"
                                selectedOptions={changedoc}
                                selectOptions={changerequestdocOptions}
                                value={changedoc}
                                handleChange={handleChangeDocChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                           How are these access changes communicated to the system administrators?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Documentation"
                                selectedOptions={changedocsend}
                                selectOptions={changecommunicationOptions}
                                value={changedocsend}
                                handleChange={handleChangeDocSendChange}
                            />
                        </div>

                    <mui.Typography variant="subtitle2">
                            If the communication channel is not included in the list above, provide the details below
                        </mui.Typography>

                        <NormalTextField
                          name="CHANGE_DOCUMENTATION_SEND_OTHER"
                          value={uarData.CHANGE_DOCUMENTATION_SEND_OTHER}
                          onChange={handleUARChange}
                          onBlur={handleUARBlur}
                      />

                        <mui.Typography variant="subtitle2">
                            What is the timeline to complete the access changes requested by the review owner (in days)?
                        </mui.Typography>

                        <NormalTextField
                          name="CHANGE_TIMELINE"
                          value={uarData.CHANGE_TIMELINE}
                          onChange={handleUARChange}
                          onBlur={handleUARBlur}
                          type="number"
                          min="0"  // This restricts the input to positive numbers
                      />

                        <mui.Typography variant="subtitle2">
                           Where is the documentation for the resolution evidence located?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Documentation Form"
                                selectedOptions={changedocreviewed}
                                selectOptions={changeactiondocOptions}
                                value={changedocreviewed}
                                handleChange={handleChangeDocResolutionChange}
                            />
                        </div>

                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Segregation of Duties Considerations:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            Is any of the review owners responsible in reviewing their own access within {selectedApps.APP_NAME}?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                placeholderText="Select Documentation Form"
                                selectedOptions={SOD}
                                selectOptions={SODYesNoOptions}
                                value={SOD}
                                handleChange={handleSODChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                            If the answer above is Yes, how is the SOD risk mitigated?
                        </mui.Typography>

                        <NormalTextField
                          name="SOD_MITIGATION"
                          value={uarData.SOD_MITIGATION}
                          onChange={handleUARChange}
                          onBlur={handleUARBlur}
                          type="number"
                          isMultiLine={true}
                          rows="5"
                      />

                    </mui.Paper>
                
                   
                </div>
            ),
        },
        {
            value: '4',
            label: (<div>
               Privileged Accounts {adminCheck ? <CheckCircleRoundedIcon sx={{ fontSize: '18px', color: 'green' }} /> : null}
            </div>),
            content: (
                <div>
                    <mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center' }}>
                        <mui.Tooltip title="Process Inventory">
                            <mui.IconButton>
                                <CopyAllRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                        <mui.Tooltip title="Certify Accuracy">
                            <mui.IconButton>
                                <HistoryEduRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>

                        <mui.Tooltip title="Download Process Narrative">
                            <mui.IconButton>
                                <FileDownloadRoundedIcon sx={{ width: 25, height: 25, color: '#046FB2' }} />
                            </mui.IconButton>
                        </mui.Tooltip>
                    </mui.Box>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Administrative Accounts:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                            Which roles are considered privileged accounts within {selectedApps.APP_NAME}?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Admin Roles"
                                selectedOptions={adminroles}
                                selectOptions={adminrolesOption}
                                value={adminroles}
                                handleChange={handleAdminRolesChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                            What are the capabilities of these roles?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Capabilities"
                                selectedOptions={admincapabilities}
                                selectOptions={capabilitiesOptions}
                                value={admincapabilities}
                                handleChange={handleCapabilitiesChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                            If other capabilities are not included in the list above, provide the details below
                        </mui.Typography>

                        <NormalTextField
                          name="CAPABILITIES_OTHER"
                          value={adminData.CAPABILITIES_OTHER}
                          onChange={handleAdminChange}
                          onBlur={handleAdminBlur}
                      />

                    </mui.Paper>

                    <mui.Paper sx={{ padding: '20px', marginTop: '20px' }}>
                        <mui.Typography variant="overline" style={{ marginBottom: '20px' }}>
                            Admin Activity Review:
                        </mui.Typography>

                        <mui.Typography variant="subtitle2">
                          Are the admin activities reviewed by the management?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                placeholderText="Select Confirmation"
                                selectedOptions={adminreview}
                                selectOptions={AdminYesNoOptions}
                                value={adminreview}
                                handleChange={handleAdminReviewChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                           What is the frequency of the review for the activities of these admin accounts?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={false}
                                placeholderText="Select Frequency"
                                selectedOptions={adminfrequency}
                                selectOptions={frequencyOptions}
                                value={adminfrequency}
                                handleChange={handleAdminFrequencyChange}
                            />
                        
                        </div>

                        <mui.Typography variant="subtitle2">
                            How is the review documented?
                        </mui.Typography>

                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Documentation Form"
                                selectedOptions={adminreviewdoc}
                                selectOptions={adminreviewdocOptions}
                                value={adminreviewdoc}
                                handleChange={handleAdminReviewDocChange}
                            />
                        </div>

                        <mui.Typography variant="subtitle2">
                            If documentation method is not included in the list above, provide the details below
                        </mui.Typography>

                        <NormalTextField
                          name="ADMIN_REVIEW_DOCUMENT_OTHER"
                          value={adminData.ADMIN_REVIEW_DOCUMENT_OTHER}
                          onChange={handleAdminChange}
                          onBlur={handleAdminBlur}
                      />
                    </mui.Paper>
                </div>
            ),
        },
        {
            value: '5',
            label: 'Job Monitoring',
            content: (
                <div>
                    <mui.Paper sx={{ padding: '20px' }}>
                        <mui.Typography variant="overline">
                            BATCH JOB ACCESS
                        </mui.Typography>
                        <mui.Typography variant="subtitle2">
                            What roles/entitlements have access to create, delete and modify configured batch jobs within the application?
                        </mui.Typography>
                        <div style={{ marginTop: '10px', marginBottom: '18px', position: 'relative' }}>
                            <MultipleSelect
                                isMultiSelect={true}
                                placeholderText="Select Documentation Form"
                                selectedOptions={selectedForm}
                                selectOptions={documentationOptions}
                                value={selectedForm}
                                handleChange={handleFormChange}
                            />
                        </div>

                 </mui.Paper>

                </div>
            ),
        },
        {
            value: '6',
            label: 'Back-up and Restoration',
            content: (
                <div>
                        <mui.Typography variant="subtitle2">
                        Coming soon...
                        </mui.Typography>

                </div>
            ),
        },
    ];


    const customMainContent = (
        <div>
            <ResponsiveContainer>

                <mui.Breadcrumbs aria-label="breadcrumb">
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        My Dashboard
                    </mui.Link>
                    <Suspense fallback="Loading...">
                    <mui.Link underline="hover" color="inherit" href="/Applications">
                        {selectedApps.COMPANY_NAME}
                    </mui.Link>
                    </Suspense>
                    <mui.Typography color="text.primary"> {selectedApps.APP_NAME}</mui.Typography>
                    <mui.Typography color="text.primary"> Controls</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title={`${selectedApps.APP_NAME}`} icon={<GridViewIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage, review, and setup relevant access controls
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

}

export default MyApplicationControls;