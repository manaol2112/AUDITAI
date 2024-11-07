import React, { useState, useEffect } from 'react';
import shortid from 'shortid';
import * as mui from '@mui/material';
import CircularWithValueLabel from './ProgressBar';
import Modal from './Modal';
import MultipleSelect from './MultipleSelect';
import SFTPService from '../../services/SFTPService';
import DynamicSnackbar from './Snackbar';
import { useNavigate } from 'react-router-dom';
import Separator from '../layout/Separator';
import { useParams } from 'react-router-dom';
import appService from '../../services/ApplicationService';

const styles = `
    @import url(https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css);
    @import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css);
    @import url("https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap");

    .card {
        box-shadow: 0px 4px 8px rgb(0 0 0 / 16%);
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 30px;
        background-color: #fff;
        border: none;
        max-height: 100%;
        margin: auto; /* Center align the card */
    }

    .form-submit {
        padding: 13px 30px;
        font-size: 15px;
        letter-spacing: 0.3px;
        font-weight: 400;
    }
    .kb-data-box {
        width: 100%;
        flex: 1;
    }

    .kb-modal-data-title {
        margin-bottom: 10px;
    }
    .kb-data-title h6 {
        margin-bottom: 0;
        font-size: 15px;
        font-weight: 600;
    }
    .kb-file-upload {
        margin-bottom: 20px;
    }
    .file-upload-box {
        border: 1px dashed #b6bed1;
        background-color: #EDF8FF
        border-radius: 4px;
        min-height: 80px;
        position: relative;
        overflow: hidden;
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #8194aa;
        font-weight: 400;
        font-size: 15px;
    }
    .file-upload-box .file-upload-input {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        cursor: pointer;
    }
    .file-link {
        color: #475f7b;
        text-decoration: underline;
        margin-left: 3px;
    }
    .file-upload-box .file-link:hover {
        text-decoration: none;
    }
    .file-atc-box {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
    }
    .file-image {
        width: 130px;
        height: 85px;
        background-size: cover;
        border-radius: 5px;
        margin-right: 15px;
        background-color: #eaecf1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        color: #475f7b;
        padding: 3px;
    }
    .file-image img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 4px;
    }
    .file-detail {
        flex: 1;
        width: calc(100% - 210px);
    }
    .file-detail h6 {
        word-break: break-all;
        font-size: 13px;
        font-weight: 500;
        line-height: 20px;
        margin-bottom: 8px;
    }
    .file-detail p {
        font-size: 12px;
        color: #8194aa;
        line-height: initial;
        font-weight: 400;
        margin-bottom: 8px;
    }
    .file-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .file-action-btn {
        font-size: 12px;
        color: #8194aa;
        font-weight: 400;
        margin-bottom: 0;
        padding: 0;
        background-color: transparent;
        border: none;
        text-decoration: underline;
        margin-right: 15px;
        cursor: pointer;
    }
    .file-action-btn:hover {
        color: #3d546f;
        text-decoration: underline;
    }
    .file-atc-box:last-child {
        margin-bottom: 0;
    }
    .highlighted-option {
        background-color: yellow; /* Example highlighting style */
        font-weight: bold;
    }
    
`;

const FileUploadUser = () => {
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [formattedHeaders, setformattedHeaders] = useState([]);
    const [fileAttachment, setFileAttachment] = useState([]); 
    const { id } = useParams(); 
    const [app, setApp] = useState([])
    const navigate = useNavigate();
    // Function to calculate file sizes
    const formatFileSize = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Function to handle file input change
    const handleInputChange = (e) => {

        let images = [];
        let newFileAttachment = []; 
        for (let i = 0; i < e.target.files.length; i++) {
  
            let reader = new FileReader();
            let file = e.target.files[i];
            // You can access file.name directly
            let filename = file.name;

            let csvreader = new FileReader()
            let csvfile = e.target.files[i]

            let fileInformation = {
                filename: filename,
                file:file
            }

             // Push file information to temporary array
            newFileAttachment.push({
                fileInformation: fileInformation
            });

              // Update fileAttachment state with new file attachments
            setFileAttachment(newFileAttachment);

            images.push(e.target.files[i]);

            if (file.type.startsWith('image/')) {
                // Handle image files
                let reader = new FileReader();
                reader.onloadend = () => {
                    setSelectedFiles((prevFiles) => [
                        ...prevFiles,
                        {
                            id: shortid.generate(),
                            filename: file.name,
                            filetype: file.type,
                            fileimage: reader.result,
                            datetime: file.lastModifiedDate.toLocaleString('en-IN'),
                            filesize: formatFileSize(file.size)
                        }
                    ]);
                };
                reader.readAsDataURL(file);

            } else if (file.name.endsWith('.csv')) {
                let csvreader = new FileReader();
                csvreader.onloadend = () => {
                    const content = csvreader.result;
                    const lines = content.split(/\r\n|\n/);

                    if (lines.length > 0 && lines[0].trim() !== '') {
                        const csvHeaders = lines[0].split(',');
                        const formattedHeaders = csvHeaders.map((header) => ({ value: header, label: header }));
                        setHeaders(formattedHeaders);
                    } else {
                        console.error('Empty or invalid CSV file');
                    }
                };
                csvreader.readAsText(file);
            }

            reader.onloadend = () => {
                setSelectedFiles((prevFiles) => [
                    ...prevFiles,
                    {
                        id: shortid.generate(),
                        filename: file.name,
                        filetype: file.type,
                        fileimage: reader.result,
                        datetime: file.lastModifiedDate.toLocaleString('en-IN'),
                        filesize: formatFileSize(file.size)
                    }
                ]);
            }
            if (file) {
                reader.readAsDataURL(file);
            }

        }
    }

    // Function to delete selected file from preview
    const deleteSelectedFile = (id) => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            const updatedFiles = selectedFiles.filter((file) => file.id !== id);
            setSelectedFiles(updatedFiles);
        }
    }

    // Function to handle file upload submit
    const handleFileUploadSubmit = (e) => {
        e.preventDefault();

        if (selectedFiles.length > 0) {
            setOpenCreateModal(true);
            setShowProgress(true); // Show progress bar
            // Simulate upload progress
            let interval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(interval);
                        setShowProgress(false); // Hide progress bar when upload completes
                        return 0;
                    } else {
                        return prevProgress + 20;
                    }
                });
            }, 500); // Adjust interval as needed

            setTimeout(() => {
                clearInterval(interval);
                setUploadedFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
                setSelectedFiles([]);
                setOpenCreateModal(false);
                setProgress(0);
                setOpenMappingModal(true)
            }, 5000);
        } else {
            alert('Please select file(s) to upload.');
        }
    }

    // Function to delete file from uploaded files
    const deleteFile = (id) => {
        if (window.confirm("Are you sure you want to delete this file?")) {
            const updatedFiles = uploadedFiles.filter((file) => file.id !== id);
            setUploadedFiles(updatedFiles);
        }
    }

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openMappingModal, setOpenMappingModal] = useState(false);

    const handleOpenCreateModal = () => {
        setOpenCreateModal(true);
    };

    const handleCloseCreateModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenCreateModal(true)
        }

    };

    const handleCloseMappingModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenMappingModal(true)
        }

    }

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '30px', 
            height: 'auto', 
        }),
    };


    const [headers, setHeaders] = useState([]);
    const [user_id, setUser_id] = useState([]);
    const [email, setEmail] = useState([]);
    const [firstname, setFirstName] = useState([]);
    const [lastname, setLastName] = useState([]);
    const [jobtitle, setJobTitle] = useState([]);
    const [role, setRole] = useState([]);
    const [department, setDepartment] = useState([]);
    const [emptype, setEmpType] = useState([]);
    const [manager, setManager] = useState([]);
    const [status, setStatus] = useState([]);
    const [dategranted, setDateGranted] = useState([]);
    const [lastlogin, setLastLogin] = useState([]);
    const [termdate, setTermDate] = useState([]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const mapFields = async (e) => {
        e.preventDefault();

        if (uploadedFiles.length === 0) {
            alert('Please upload the Excel file first.');
            return;
        }

        const formData = new FormData();
        
        // Append form data fields
        const data = {
            APP_NAME: id,
            USER_ID: Array.isArray(user_id) ? user_id.map(header => header.value) : [user_id.value],
            EMAIL: Array.isArray(email) ? email.map(header => header.value) : [email.value],
            FIRST_NAME: Array.isArray(firstname) ? firstname.map(header => header.value) : [firstname.value],
            LAST_NAME: Array.isArray(lastname) ? lastname.map(header => header.value) : [lastname.value],
            ROLE: Array.isArray(role) ? role.map(header => header.value) : [role.value],
            STATUS: Array.isArray(status) ? status.map(header => header.value) : [status.value],
            DATE_GRANTED: Array.isArray(dategranted) ? dategranted.map(header => header.value) : [dategranted.value],
            DATE_REVOKED: Array.isArray(termdate) ? termdate.map(header => header.value) : [termdate.value],
            LAST_LOGIN: Array.isArray(lastlogin) ? lastlogin.map(header => header.value) : [lastlogin.value], 
        };
        formData.append('data', JSON.stringify(data));

        formData.append('APP_NAME',id)

        fileAttachment.forEach(({ file, fileInformation }) => {
            formData.append('FILE', fileInformation.file);
            formData.append('FILE_NAME', fileInformation.filename);
        });

        try {
            
            const response = await SFTPService.userdataMapping(formData);
            
            // //CLOSE THE MAPPING MODAL 
            // setOpenMappingModal(false)
            console.log(response)

            setSnackbarMessage('Successfully mapped and uploaded user record');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            setTimeout(() => {
                window.location.reload();
            }, 100);


        } catch (error) {

            setSnackbarMessage('There was a problem with the mapping the HR record');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);

            console.error('Error uploading data:', error);
        }

    };

    function mapHeaders(headers, substring) {
        const substrings = substring.toLowerCase().split('|');
        const filteredHeaders = headers.filter(item => {
            const labelLower = item.label.toLowerCase();
            return substrings.some(sub => labelLower.includes(sub.trim()));
        });
        const mappedHeaders = filteredHeaders.map(item => ({ value: item.value, label: item.label }));
        return mappedHeaders.length > 0 ? mappedHeaders : headers.map(item => ({ value: item.value, label: item.label }));
    }

  
    useEffect(() => {
    
        const useridOption = mapHeaders(headers, 'user_id|user id|username|userid|user_name|ID|id');
        setUser_id(useridOption);
        const emailOption = mapHeaders(headers, 'email_address|email|emailaddress|email_add');
        setEmail(emailOption)
        const firstnameOption = mapHeaders(headers, 'first_name|firstname|first name|given name|given_name|givenname');
        setFirstName(firstnameOption)
        const lastnameOption = mapHeaders(headers, 'last_name|lastname|last name|surname|sur_name|sur name');
        setLastName(lastnameOption)
        const roleOption = mapHeaders(headers, 'role_name|role|role name|role assignment');
        setRole(roleOption)
        const statusOption = mapHeaders(headers, 'status');
        setStatus(statusOption)
        const dateGrantedOption = mapHeaders(headers, 'date granted|date_granted|provision date|date added');
        setDateGranted(dateGrantedOption)
        const terminationOption = mapHeaders(headers, 'date revoked|date_revoked|revoke date|termination date|termination_date|termed_date|termeddate|disable_date|disable date|date removed');
        setTermDate(terminationOption)
        const lastloginOption = mapHeaders(headers, 'last login|last_login|lastlogin');
        setLastLogin(lastloginOption)
    }, [headers]);

    const user_id_change = (selectedOptions) => {
        setUser_id(selectedOptions)
    };

    const email_change = (selectedOptions) => {
        setEmail(selectedOptions)
    };

    const firstname_change = (selectedOptions) => {
        setFirstName(selectedOptions)
    };

    const lastname_change = (selectedOptions) => {
        setLastName(selectedOptions)
    };

    const role_change = (selectedOptions) => {
        setRole(selectedOptions)
    };

    const status_change = (selectedOptions) => {
        setStatus(selectedOptions)
    };

    const lastlogin_change = (selectedOptions) => {
        setLastLogin(selectedOptions)
    };

    const dategranted_change = (selectedOptions) => {
        setDateGranted(selectedOptions)
    };

    const termdate_change = (selectedOptions) => {
        setTermDate(selectedOptions)
    };

    return (
        <div className="fileupload-view">
            <style>{styles}</style>

            <div className="card">
                <div className="card-body">
                    <div className="kb-data-box">

                        <div className="kb-modal-data-title">
                        </div>
                        <form onSubmit={handleFileUploadSubmit} encType="multipart/form-data">
                            <div className="kb-file-upload">
                                <div className="file-upload-box">
                                    <input
                                        type="file"
                                        id="fileupload"
                                        className="file-upload-input"
                                        onChange={handleInputChange}
                                        multiple
                                    />
                                    <span>Drag and drop the User upload file or<span className="file-link">Browse here</span></span>
                                </div>
                            </div>
                            <div className="kb-attach-box mb-3">
                                {selectedFiles.map((file) => (
                                    <div className="file-atc-box" key={file.id}>
                                        {file.filename.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
                                            <div className="file-image">
                                                <img src={file.fileimage} alt="" />
                                            </div>
                                        ) : (
                                            <div className="file-image">
                                                <i className="far fa-file-alt"></i>
                                            </div>
                                        )}
                                        <div className="file-detail">
                                            <h6>{file.filename}</h6>
                                            <p><span>Size: {file.filesize}</span><span className="ml-2">Modified Time: {file.datetime}</span></p>
                                            <div className="file-actions">
                                                <button type="button" className="file-action-btn" onClick={() => deleteSelectedFile(file.id)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="kb-buttons-box">
                                <mui.Button type="submit" variant="contained">Upload</mui.Button>
                            </div>
                        </form>
                        {uploadedFiles.length > 0 && (
                            <div className="kb-attach-box">
                                <hr />
                                {uploadedFiles.map((file, index) => (
                                    <div className="file-atc-box" key={file.id}>
                                        {file.filename.match(/\.(jpg|jpeg|png|gif|svg|csv|xlsx|xls)$/i) ? (
                                            <div className="file-image">
                                                <img src={file.fileimage} alt="" />
                                            </div>
                                        ) : (
                                            <div className="file-image">
                                                <i className="far fa-file-alt"></i>
                                            </div>
                                        )}
                                        <div className="file-detail">
                                            <h6>{file.filename}</h6>
                                            <p><span>Size: {file.filesize}</span><span className="ml-3">Modified Time: {file.datetime}</span></p>
                                            <div className="file-actions">
                                                <button className="file-action-btn" onClick={() => deleteFile(file.id)}>Delete</button>
                                                <a href={file.fileimage} className="file-action-btn" download={file.filename}>Download</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                open={openCreateModal}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                onClose={handleCloseCreateModal}
                header="Uploading..."
                body={
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        {showProgress && <CircularWithValueLabel progressValue={progress} />}
                    </div>
                }
                footer={
                    <></>
                }
            />

            <Modal
                open={openMappingModal}
                onClose={handleCloseMappingModal}
                header="User Mapping Template"
                size="lg" // Adjust size as needed: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number

                body={
                    <>
                    <mui.Typography sx={{marginBottom: '20px'}} variant="subtitle2">
                        Note: System will automatically map the required system fields based on the file upload header. Make sure to double check if the fields are completely and accurately map. If fields are not mapped automatically, you may select the corresponding field manually.  
                    </mui.Typography>
                        <mui.Grid container spacing={2}>
                            <mui.Grid item xs={12}>
                                {/* Left column content */}
                                <mui.Paper>
                                    <mui.Card>
                                        <mui.Grid container spacing={0}>

                                            <mui.Grid item xs={3}>
                                                <mui.CardHeader
                                                    title={<mui.Typography variant="subtitle1" >System Fields</mui.Typography>}
                                                >
                                                </mui.CardHeader>
                                            </mui.Grid>
                                            <mui.Grid item xs={9}>
                                                <mui.CardHeader
                                                    title={<mui.Typography variant="subtitle1" >Upload File Fields</mui.Typography>}
                                                >
                                                </mui.CardHeader>
                                            </mui.Grid>

                                            <Separator/>


                                            {/* USER ID */}
                                            <mui.Grid item xs={3}>
                                                <mui.CardContent>
                                                    <mui.Typography variant="subtitle2">
                                                        User ID:
                                                    </mui.Typography>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            <mui.Grid item xs={9}>
                                                <mui.CardContent>
                                                    <MultipleSelect
                                                        isMultiSelect={true}
                                                        handleChange={user_id_change}
                                                        selectedOptions={user_id}
                                                        selectOptions={headers}
                                                        customStyles={customStyles}
                                                        placeholderText="Map Field">  
                                                    </MultipleSelect>
                                                </mui.CardContent>
                                            </mui.Grid>
                                            {/* Email Address */}
                                            <mui.Grid item xs={3} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <mui.Typography variant="subtitle2">
                                                        Email Address:
                                                    </mui.Typography>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            <mui.Grid item xs={9} style={{ marginTop: '-20px' }} >
                                                <mui.CardContent>
                                                    <MultipleSelect
                                                      isMultiSelect={true}
                                                        handleChange={email_change}
                                                        selectedOptions={email}
                                                        selectOptions={headers}
                                                        customStyles={customStyles}
                                                        placeholderText="Map Field">
                                                    </MultipleSelect>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            {/* First Name */}
                                            <mui.Grid item xs={3} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <mui.Typography variant="subtitle2">
                                                        First Name:
                                                    </mui.Typography>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            <mui.Grid item xs={9} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <MultipleSelect
                                                      isMultiSelect={true}
                                                        handleChange={firstname_change}
                                                        selectedOptions={firstname}
                                                        selectOptions={headers}
                                                        customStyles={customStyles}
                                                        placeholderText="Map Field">

                                                    </MultipleSelect>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            {/* Last Name */}
                                            <mui.Grid item xs={3} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <mui.Typography variant="subtitle2">
                                                        Last Name:
                                                    </mui.Typography>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            <mui.Grid item xs={9} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <MultipleSelect
                                                      isMultiSelect={true}
                                                        handleChange={lastname_change}
                                                        selectedOptions={lastname}
                                                        selectOptions={headers}
                                                        customStyles={customStyles}
                                                        placeholderText="Map Field"
                                                    >

                                                    </MultipleSelect>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            {/* Role Change */}
                                            <mui.Grid item xs={3} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <mui.Typography variant="subtitle2">
                                                        Role Name:
                                                    </mui.Typography>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            <mui.Grid item xs={9} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <MultipleSelect
                                                         isMultiSelect={true}
                                                        handleChange={role_change}
                                                        selectedOptions={role}
                                                        selectOptions={headers}
                                                        customStyles={customStyles}
                                                        placeholderText="Map Field"
                                                    >

                                                    </MultipleSelect>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            {/* Status */}
                                            <mui.Grid item xs={3} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <mui.Typography variant="subtitle2">
                                                        Status:
                                                    </mui.Typography>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            <mui.Grid item xs={9} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <MultipleSelect
                                                      isMultiSelect={true}
                                                        handleChange={status_change}
                                                        selectedOptions={status}
                                                        selectOptions={headers}
                                                        customStyles={customStyles}
                                                        placeholderText="Map Field"
                                                    >

                                                    </MultipleSelect>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            {/* Date Granted */}
                                            <mui.Grid item xs={3} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <mui.Typography variant="subtitle2">
                                                       Date Granted:
                                                    </mui.Typography>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            <mui.Grid item xs={9} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <MultipleSelect
                                                      isMultiSelect={true}
                                                        handleChange={dategranted_change}
                                                        selectedOptions={dategranted}
                                                        selectOptions={headers}
                                                        customStyles={customStyles}
                                                        placeholderText="Map Field"
                                                    >

                                                    </MultipleSelect>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            {/* Termination Date */}
                                            <mui.Grid item xs={3} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <mui.Typography variant="subtitle2">
                                                        Date Removed:
                                                    </mui.Typography>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            <mui.Grid item xs={9} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <MultipleSelect
                                                      isMultiSelect={true}
                                                        handleChange={termdate_change}
                                                        selectedOptions={termdate}
                                                        selectOptions={headers}
                                                        customStyles={customStyles}
                                                        placeholderText="Map Field"
                                                    >

                                                    </MultipleSelect>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            {/* Status */}
                                            <mui.Grid item xs={3} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <mui.Typography variant="subtitle2">
                                                        Last Login:
                                                    </mui.Typography>
                                                </mui.CardContent>
                                            </mui.Grid>

                                            <mui.Grid item xs={9} style={{ marginTop: '-20px' }}>
                                                <mui.CardContent>
                                                    <MultipleSelect
                                                      isMultiSelect={true}
                                                        handleChange={lastlogin_change}
                                                        selectedOptions={lastlogin}
                                                        selectOptions={headers}
                                                        customStyles={customStyles}
                                                        placeholderText="Map Field"
                                                    >

                                                    </MultipleSelect>
                                                </mui.CardContent>
                                            </mui.Grid>
                                           
                                        </mui.Grid>

                                    </mui.Card>

                                </mui.Paper>
                            </mui.Grid>

                        </mui.Grid>
                    </>
                }
                footer={
                    <>
                        <mui.Button size="small" sx={{marginRight: '10px', marginBottom: '10px'}} onClick={mapFields} color="primary" variant="contained">
                            Map Fields
                        </mui.Button>
                    </>
                }
            />
             <DynamicSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                    onClose={handleSnackbarClose}
                />
        </div>
    );
}

export default FileUploadUser;
