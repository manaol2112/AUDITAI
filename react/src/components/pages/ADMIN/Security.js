import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import ResponsiveContainer from '../../layout/Container';
import axios from 'axios'; // Import Axios
import OutlinedCard from '../../common/MediaCard';
import companyService from '../../../services/CompanyService';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SecurityIcon from '@mui/icons-material/Security';
import KeyIcon from '@mui/icons-material/Key';
import LockOpenIcon from '@mui/icons-material/LockOpen';


const Security = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem('authToken');  // Assuming token is stored in localStorage

    axios.defaults.xsrfCookieName = 'csrftoken';
    axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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
        setCompanies([...companies, response]); // Update state with new user
        } catch (error) {
        console.error('Error creating company:', error);
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
                    <mui.Typography color="text.primary">System Security</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage Security" icon={<SecurityIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage and update security configuration
                </mui.Typography>
                <Separator />

                <mui.Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={3}
                >
               
                        <mui.Grid item>
                            <OutlinedCard
                                icon={<KeyIcon sx ={{marginBottom: '5px', fontSize: 35}}/>}
                                title="Password"
                                to={`/Security/PasswordConfiguration`}
                                buttonlabel="Configure"
                            />
                            
                        </mui.Grid>

                        <mui.Grid item>
                            <OutlinedCard
                                icon={<LockOpenIcon sx ={{marginBottom: '5px', fontSize: 35}} />}
                                title="Single Sign On"
                                to={`/Companies/Password`}
                                buttonlabel="Configure"
                            />
                            
                        </mui.Grid>
   
                </mui.Grid>


             
            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>
    );
}

export default Security;
