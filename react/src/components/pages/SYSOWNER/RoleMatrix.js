import React, { useState, useEffect, useRef, Suspense } from 'react';
import SysOwnerSideBar from './SysOwnerSidebar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import ErrorBoundary from '../../common/ErrorBoundery';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import GridViewIcon from '@mui/icons-material/GridView';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useParams } from 'react-router-dom';
import appService from '../../../services/ApplicationService';

const RoleMatrix = () => {

    const [app, setApp] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {

        const fetchRoles = async () => {

            try {

                const roles = await appService.fetchAppsRecordById(id);
                if (roles) {
    
                    if (roles && Array.isArray(roles)) {
                        const roleNames = [...new Set(roles.map(item => item.ROLE_NAME))];
    
                        const formattedRoleName = roleNames.map(item => ({
                            value: item,
                            label: item,
                        }));
    
                        setRoles(formattedRoleName);

                        console.log('These are the roles', formattedRoleName)
    
                    }
                }   
               
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchApp = async () => {
            
            try {
                const app = await appService.fetchAppsById(id);
                setApp(app)

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRoles();
        fetchApp()

    }, []);


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
                    <mui.Typography color="text.primary"> Role Matrix </mui.Typography>
                    <mui.Typography color="text.primary"> {app?.APP_NAME} </mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage Role Ownership" icon={<AssignmentIndIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    View and manage role ownership and responsibilities
                </mui.Typography>

                <Separator />

            </ResponsiveContainer>
        </div>
    )

    return (
        <ErrorBoundary fallback={<p>Failed to load data.</p>} error={error}>
            <Suspense fallback="Loading...">
                <div>
                    <SysOwnerSideBar mainContent={customMainContent} />
                </div>
            </Suspense>
        </ErrorBoundary>
    );
};

export default RoleMatrix;
