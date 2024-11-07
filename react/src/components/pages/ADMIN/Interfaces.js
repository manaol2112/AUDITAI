import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import ResponsiveContainer from '../../layout/Container';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import OutlinedCard from '../../common/MediaCard';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
const Interfaces = () => {

    const navigate = useNavigate();

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
                    <mui.Typography color="text.primary">Data Sources</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Interfaces (Data Sources)" icon={<AccountTreeIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage and configure source data
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
                            icon={<ContactMailIcon sx ={{marginBottom: '5px', fontSize: 35}}/>}
                            title="HR Data"
                            to={`/Interfaces/HR/Home`}
                            buttonlabel="Manage"
                        />
                    </mui.Grid>


                    <mui.Grid item>
                        <OutlinedCard
                            icon={<RecentActorsIcon sx ={{marginBottom: '5px', fontSize: 35}}/>}
                            title="Application Data"
                            to={`/Interfaces/Applications/Home`}
                            buttonlabel="Manage"
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

export default Interfaces;
