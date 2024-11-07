import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import ResponsiveContainer from '../../layout/Container';
import BusinessIcon from '@mui/icons-material/Business';
import companyService from '../../../services/CompanyService';
import { useParams } from 'react-router-dom';
import NormalTextField from '../../common/NormalTextField';
import Modal from '../../common/Modal';
import { useNavigate } from 'react-router-dom';
import DynamicSnackbar from '../../common/Snackbar';


const CompanyDetails = () => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const navigate = useNavigate();

    const { companyId } = useParams();

    const [companyData, setCompanyData] = useState({
        COMPANY_ID: '',
        COMPANY_NAME: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyData({ ...companyData, [name]: value });
        console.log('Company Data:', companyData); 
    };
    
    const [openCreateModal, setOpenCreateModal] = useState(false);

    const handleOpenCreateModal = () => {
        setOpenCreateModal(true);
    };

    const handleCloseCreateModal = () => {
        setOpenCreateModal(false);
    };

    const deleteCompany = async (e) => {
        e.preventDefault();
        try {
            const response = await companyService.deleteCompany(companyId);
            setSnackbarMessage('Company successfully deleleted');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            // Delay navigation after showing snackbar
            setTimeout(() => {
                navigate('/Companies');
            }, 1500);
            console.log('Company deleted:', response);
        } catch (error) {
            setSnackbarMessage('There was a problem deleting company record');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/Companies');
            }, 1500);
        }
    };

    const updateCompany = async (e) => {
        e.preventDefault();
        try {
        const response = await companyService.updateCompany(companyId,companyData);
        // navigate('/Companies');
        setSnackbarMessage('Company successfully updated');
        setSnackbarSeverity('success');
        setSnackbarOpen(true); 
        } catch (error) {
        setSnackbarMessage('There was a problem updating company record');
        setSnackbarSeverity('error');
        setSnackbarOpen(true); 
        }
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const companiesData = await companyService.fetchCompanyById(companyId);
                setCompanyData(companiesData);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        if (companyId) {
            fetchCompanies();
        }
        fetchCompanies();
    }, []);

    if (!companyData) {
        return <div>Loading...</div>; 
    }

  
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
                    <mui.Link underline="hover" color="inherit" href="/Companies">
                       Companies
                    </mui.Link>
                    <mui.Typography color="text.primary">{companyData.COMPANY_NAME}</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title={companyData.COMPANY_NAME} icon={<BusinessIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    View, update, and delete company record
                </mui.Typography>

                <Separator />

                <NormalTextField
                                label="Company ID:"
                                name="COMPANY_ID"
                                value={companyData.COMPANY_ID}
                                onChange={handleChange}
                            />

                <NormalTextField
                                label="Company Name:"
                                name="COMPANY_NAME"
                                value={companyData.COMPANY_NAME}
                                onChange={handleChange}
                            />

                <mui.Button size="small" variant="contained" sx={{marginRight: '20px', marginTop: '10px'}} onClick={updateCompany} >Update</mui.Button>
                <mui.Button size="small"  variant="contained" sx={{marginRight: '20px', marginTop: '10px'}} onClick={handleOpenCreateModal} >Delete</mui.Button>

                <Modal
                    open={openCreateModal}
                    onClose={handleCloseCreateModal}
                    header="Confirm Delete"
                    body={
                        <>
                            <mui.Typography>This will permanently delete {companyData.COMPANY_NAME} and its related record. This action cannot be reversed. Click confirm button to proceed. </mui.Typography>
                        </>
                    }
                    footer={
                        <>
                            <mui.Button size="small" onClick={handleCloseCreateModal} color="primary">
                                Cancel
                            </mui.Button>
                            <mui.Button size="small" onClick={deleteCompany} color="primary" variant="contained">
                                Confirm Delete
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
};

export default CompanyDetails;
