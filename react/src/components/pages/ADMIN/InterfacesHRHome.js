import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import Separator from '../../layout/Separator';
import OutlinedCard from '../../common/MediaCard';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import CableIcon from '@mui/icons-material/Cable';
import ArticleIcon from '@mui/icons-material/Article';

const InterfacesHRHome = () => {


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
                <mui.Link underline="hover" color="inherit" href="/Interfaces">
                    Data Sources
                </mui.Link>
                <mui.Typography color="text.primary">HR Data</mui.Typography>
            </mui.Breadcrumbs>

            <SearchAppBar title="HR Data" icon={<ContactMailIcon />} />
            <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                Manage SFTP Settings, Job Schedules, and View HR Import Logs
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
                            icon={<CableIcon sx ={{marginBottom: '5px', fontSize: 35}} />}
                            title="SFTP and Data Upload"
                            to={`/Interfaces/HR`}
                            buttonlabel="Configure"
                        />
                    </mui.Grid>

                    <mui.Grid item>
                        <OutlinedCard
                            icon={<ArticleIcon  sx ={{marginBottom: '5px', fontSize: 35}}/>}
                            title="View HR Import Logs"
                            to={`/Interfaces/HR/Details`}
                            buttonlabel="View Record"
                        />

                    </mui.Grid>

                </mui.Grid>
           

        </ResponsiveContainer>
    </div>

)

return (
    <div>
        <SideBar mainContent={customMainContent} />
    </div>

);
}
export default InterfacesHRHome;