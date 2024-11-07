import React, { useState, useEffect, Suspense } from 'react';
import IASideBar from './IASideBar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import OutlinedCard from '../../common/MediaCard';
import Separator from '../../layout/Separator';
import ReviewsRoundedIcon from '@mui/icons-material/ReviewsRounded';
import auditService from '../../../services/AuditService';
import { useParams } from 'react-router-dom';


const AuditProjectSettings = () => {
    const [selectedProject, setSelectedProject] = useState([])
    const { id } = useParams();

    useEffect(() => {
       
        const fetchProjectbyID = async () => {
            try {
                const projectRecord = await auditService.fetchProjectsById(id)

                if (projectRecord) {
                    setSelectedProject(projectRecord);
                 
                } else {
                    setSelectedProject([]);
        
                }

            } catch (fetchError) {
                console.error('Error fetching company:', fetchError);
                setSelectedProject([])
            }
        }
        fetchProjectbyID()
    }, []);

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
                    <mui.Link underline="hover" color="inherit" href="/Audit/Projects">
                        Audit Projects
                    </mui.Link>
                    <mui.Typography color="text.primary">{selectedProject.AUDIT_NAME}</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title={selectedProject.AUDIT_NAME} icon={<ReviewsRoundedIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage Project Access and Project Status
                </mui.Typography>
                <Separator />

                <mui.Grid
                    container spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                >
            
                    <mui.Grid item>
                        <OutlinedCard icon="folder_special" title="Workpapers"  to={`/Audit/Workpapers/${selectedProject.id}`} buttonlabel="Start Documentation" />
                    </mui.Grid>

                    <mui.Grid item>
                        <OutlinedCard icon="security" title="Risk and Controls"   to={`/Audit/RiskandControlMapping/${selectedProject.id}`} buttonlabel="Start Mapping" />
                    </mui.Grid>

                    <mui.Grid item>
                        <OutlinedCard icon="cloud_upload" title="Document Requests" to="/Applications" buttonlabel="View" />
                    </mui.Grid>

                    <mui.Grid item>
                        <OutlinedCard icon="topic" title="Reports" to="/Applications" buttonlabel="Download" />
                    </mui.Grid>

                    <mui.Grid item>
                        <OutlinedCard icon="key" title="Manage Access" to="/Audit/Projects" buttonlabel="Manage" />
                    </mui.Grid>

                </mui.Grid>



            </ResponsiveContainer>
        </div>
    )
    return (

            <Suspense fallback="Loading...">
                <div>
                    <IASideBar mainContent={customMainContent} />
                </div>
            </Suspense>

    );
}
export default AuditProjectSettings;