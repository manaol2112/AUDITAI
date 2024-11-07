import React, { useState, useEffect, Suspense } from 'react';
import SysOwnerSideBar from './SysOwnerSidebar';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import GridViewIcon from '@mui/icons-material/GridView';
import Paper from '@mui/material/Paper';
import { styled, alpha } from '@mui/material/styles';
import appService from '../../../services/ApplicationService';
import userService from '../../../services/UserService';
import companyService from '../../../services/CompanyService';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import StorageIcon from '@mui/icons-material/Storage';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import GppGoodIcon from '@mui/icons-material/GppGood';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import LaunchIcon from '@mui/icons-material/Launch';
import GroupIcon from '@mui/icons-material/Group';
import MemoryRoundedIcon from '@mui/icons-material/MemoryRounded';
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded';
import DownloadIcon from '@mui/icons-material/Download';
import KeyIcon from '@mui/icons-material/Key';
import SettingsIcon from '@mui/icons-material/Settings';


const ProcessNarrativeDetails = () => {



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
                <mui.Typography color="text.primary"> Process Narrative</mui.Typography>
            </mui.Breadcrumbs>

            <SearchAppBar title="Process Narrative" icon={<GridViewIcon />} />

            <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                View and download process narrative for reporting
            </mui.Typography>

            <Separator />

           
        </ResponsiveContainer>
    </div>
);


return (
    <div>
        <SysOwnerSideBar mainContent={customMainContent} />

    </div>
);

}


export default ProcessNarrativeDetails;