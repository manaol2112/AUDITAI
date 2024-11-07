import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import CustomSpeedDial from '../../common/SpeedDial';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FullWidthTextField from '../../common/ValidationTextFields';
import Modal from '../../common/Modal';
import ResponsiveContainer from '../../layout/Container';
import EditIcon from '@mui/icons-material/Edit';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import axios from 'axios'; // Import Axios
import OutlinedCard from '../../common/MediaCard';
import companyService from '../../../services/CompanyService';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DynamicSnackbar from '../../common/Snackbar';
import NormalTextField from '../../common/NormalTextField';


const Companies = () => {

    const token = localStorage.getItem('authToken');  // Assuming token is stored in localStorage
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const [openCreateModal, setOpenCreateModal] = useState(false);

    const [companyData, setCompanyData] = useState({
        COMPANY_ID: '',
        COMPANY_NAME: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyData({ ...companyData, [name]: value });
    };

    const createCompany = async (e) => {
        e.preventDefault();
        try {
        const response = await companyService.createCompany(companyData);
        setCompanies([...companies, response]); 
        setSnackbarMessage('Company successfully created');
        setSnackbarSeverity('success');
        setSnackbarOpen(true); 
        handleCloseCreateModal()
        } catch (error) {
        setSnackbarMessage('There was a problem creating the company');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        }
    };

    const [companies, setCompanies] = useState([]); 

    const fetchCompanies = async () => {
        try {
            const response = await companyService.fetchCompanies(); 
            setCompanies(response); 
          } catch (error) {
            console.error('Error fetching companies:', error);
          }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    if (!companyData) {
        return <div>Loading...</div>; 
    }

    const handleOpenCreateModal = () => {
        setOpenCreateModal(true);
    };

    const handleCloseCreateModal = (event, reason) => {
        if (reason == 'backdropClick') {
            setOpenCreateModal(true)
        }
        else {
            setOpenCreateModal(false);
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
                    <mui.Typography color="text.primary">Companies</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage Companies" icon={<BusinessIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Create, manage, and update company information
                </mui.Typography>
                <Separator />

                <mui.Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={3}
                >
                    {companies.map(company => (
                        <mui.Grid item key={company.COMPANY_ID}>
                            <OutlinedCard
                                icon={<CorporateFareIcon />}
                                title={company.COMPANY_NAME}
                                to={`/Companies/${company.id}`}
                                buttonlabel={<React.Fragment>
                                    View <VisibilityIcon sx={{marginLeft: '5px'}} />
                                </React.Fragment>}
                            />
                        </mui.Grid>
                    ))}
                </mui.Grid>


                <CustomSpeedDial onClick={handleOpenCreateModal} />


                <Modal
                    open={openCreateModal}
                    onClose={handleCloseCreateModal}
                    header="Setup New Company"
                    body={
                        <>
                            <NormalTextField
                                label="Company ID"
                                name="COMPANY_ID"
                                value={companyData.COMPANY_ID}
                                onChange={handleChange}
                            />
                            <NormalTextField
                                label="Company Name"
                                name="COMPANY_NAME"
                                value={companyData.COMPANY_NAME}
                                onChange={handleChange}
                            />

                        </>
                    }
                    footer={
                        <>
                            <mui.Button onClick={handleCloseCreateModal} color="primary">
                                Cancel
                            </mui.Button>
                            <mui.Button onClick={createCompany} color="primary" variant="contained">
                                Create
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
            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>
    );
}

export default Companies;
