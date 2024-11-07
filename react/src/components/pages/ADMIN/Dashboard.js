import React, { useState } from 'react';
import { SideBar } from '../../layout';
import * as mui from '@mui/material';

import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import OutlinedCard from '../../common/MediaCard';
import ResponsiveContainer from '../../layout/Container';
import AppsIcon from '@mui/icons-material/Apps';
import Cookies from 'js-cookie';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const Dashboard = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // Define custom main content if needed
    const customMainContent = (
        <div>
            <ResponsiveContainer>
                <mui.Breadcrumbs aria-label="breadcrumb">
                    <mui.Link underline="hover" color="inherit" href="/Dashboard">
                        <i className="material-icons">home</i>
                    </mui.Link>
                    <mui.Link
                        underline="hover"
                        color="inherit"
                        href="/Dashboard"
                    >
                        Dashboard
                    </mui.Link>
                    <mui.Typography color="text.primary">System Settings</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage System Settings" icon={<AppsIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage users, integrations, system security, and other settings
                </mui.Typography>
                <Separator />

                <mui.Grid
                    container spacing={3}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <mui.Grid item>
                        <OutlinedCard icon="business" title="Companies" to="/Companies" buttonlabel="Manage"  />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="widgets" title="System Roles" to="/SystemRoles" buttonlabel="Manage" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="engineering" title="Users" to="/ManageUsers" buttonlabel="Manage" />
                    </mui.Grid>
                    <mui.Grid item>
                    <OutlinedCard icon="grid_view" title="Applications" to="/Applications" buttonlabel="Manage" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="lockopen" title="Security" to="/Security" buttonlabel="Manage" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="lan" title="Interfaces" to="/Interfaces" buttonlabel="Manage" />
                    </mui.Grid>
                    <mui.Grid item>
                        <OutlinedCard icon="settingsuggest" title="System Default" to="/SystemDefaults" buttonlabel="Manage"  />
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

export default Dashboard;
