import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import OutlinedCard from '../../common/MediaCard';
import GridViewIcon from '@mui/icons-material/GridView';
import CustomSpeedDial from '../../common/SpeedDial';
import appService from '../../../services/ApplicationService';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Modal from '../../common/Modal';
import NormalTextField from '../../common/NormalTextField';
import DynamicSnackbar from '../../common/Snackbar';
import MultipleSelect from '../../common/MultipleSelect';
import companyService from '../../../services/CompanyService';
import SettingsIcon from '@mui/icons-material/Settings';
import userService from '../../../services/UserService';
import userrolesService from '../../../services/UserRoleService';
import { UsersIcon, LinkIcon, Cog6ToothIcon } from '@heroicons/react/20/solid'

const ManageApplicationsv2 = () => {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [companies, setCompanies] = useState([]);
    const [apps, setApps] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState([]);
    const [selectedType, setSelectedType] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [appData, setAppData] = useState({
        COMPANY_ID: '',
        APP_NAME: '',
        APP_DESCRIPTION: '',
        APPLICATION_OWNER: '',
    });

    const appDataWithOwner = {
        ...appData,
        APPLICATION_OWNER: selectedUser.map(id => id.value),
    };

    const createApp = async (e) => {
        e.preventDefault();
        console.log('This is the data to be sent', appDataWithOwner)
        try {
            const response = await appService.createApp(appDataWithOwner);
            setApps([...apps, response]);
            setSnackbarMessage('Company successfully created');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleCloseCreateModal()

            // Reload the page after a 1-second delay
            setTimeout(() => {
                window.location.reload();
            }, 1000); // 1000 milliseconds = 1 second
        } catch (error) {
            setSnackbarMessage('There was a problem creating the company');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const fetchApps = async () => {
        try {
            const response = await appService.fetchApps();
            setApps(response);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await companyService.fetchCompanies();
            setCompanies(response);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    useEffect(() => {
        fetchApps();
        fetchCompanies();
    }, []);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppData({ ...appData, [name]: value });
    };

    const companyList = companies.map(company => ({
        value: company.id,
        label: company.COMPANY_NAME
    }));

    const systemType = [
        { value: 'Operating System', label: 'Operating System' },
        { value: 'Database', label: 'Database' },
        { value: 'Application', label: 'Application' },
        { value: 'Network', label: 'Network' },
        { value: 'Tool', label: 'Tool' }
    ];

    const [userList, setUserList] = useState([]);

    const handleCompanyChange = async (selectedCompany) => {
        setSelectedCompany(selectedCompany);

        setAppData(prevAppData => ({
            ...prevAppData,
            COMPANY_ID: selectedCompany.value
        }));
    }

    const handleTypeChange = async (selectedType) => {
        setSelectedType(selectedType);

        setAppData(prevAppData => ({
            ...prevAppData,
            APP_TYPE: selectedType.value
        }));
    }


    const handleUserChange = (selectedOptions) => {
        setSelectedUser(selectedOptions);
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
                    <mui.Typography color="text.primary">Applications</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage Applications" icon={<GridViewIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage, Create, Modify, and Delete Applications
                </mui.Typography>

                <Separator />
             
                <div className="max-w-7xl sm:px-6 lg:px-8">

                    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {apps.map((app) => (
                            <li key={app.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow-sm">
                                <div className="flex w-full items-center justify-between space-x-6 p-6 bg-gray-30">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                        <h3 className="truncate text-sm font-medium text-gray-900 font-bold">{app.APP_NAME}</h3>

                                            <span className="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                                {app.COMPANY_NAME}
                                            </span>
                                            <span className="inline-flex shrink-0 items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-grey-700 ring-1 ring-blue-600/20 ring-inset">
                                                {app.APP_TYPE}
                                            </span>
                                        </div>
                                            <p className="mt-1 truncate text-sm text-gray-500">{app.APP_DESCRIPTION}</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="-mt-px flex divide-x divide-gray-200">
                                        <div className="flex w-0 flex-1 bg-blue-50">
                                            <a
                                                 href={`/applications/manageusers/${app.id}`}
                                                className=" no-underline relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                            >
                                                <UsersIcon aria-hidden="true" className="size-5 text-gray-400" />
                                                Users
                                            </a>
                                        </div>
                                        <div className="-ml-px flex w-0 flex-1 bg-blue-50">
                                            <a
                                                href={`/interfaces/applications/${app.id}`}
                                                className="no-underline relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                            >
                                                <LinkIcon aria-hidden="true" className="size-5 text-gray-400" />
                                                Interfaces
                                            </a>
                                        </div>
                                        <div className="-ml-px flex w-0 flex-1 bg-blue-50">
                                            <a
                                                href={`/applications/${app.id}`}
                                                className="no-underline relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                                            >
                                                <Cog6ToothIcon aria-hidden="true" className="size-5 text-gray-400" />
                                                Manage
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <Modal
                    open={openCreateModal}
                    onClose={handleCloseCreateModal}
                    header="Setup New Application"
                    body={
                        <>
                            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                                <MultipleSelect
                                    isMultiSelect={false}
                                    placeholderText="Select Company"
                                    selectOptions={companyList}
                                    value={selectedCompany}
                                    handleChange={handleCompanyChange}

                                />
                            </div>

                            <NormalTextField
                                label="Application Name"
                                name="APP_NAME"
                                value={appData.APP_NAME}
                                onChange={handleChange}
                            />
                            <NormalTextField
                                label="Description"
                                name="APP_DESCRIPTION"
                                value={appData.APP_DESCRIPTION}
                                onChange={handleChange}
                                isMultiLine={true}
                                rows="5"
                            />

                            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                                <MultipleSelect
                                    isMultiSelect={false}
                                    placeholderText="Select Type"
                                    selectOptions={systemType}
                                    value={selectedType}
                                    handleChange={handleTypeChange}
                                />
                            </div>

                        </>
                    }
                    footer={
                        <>
                            <mui.Button onClick={handleCloseCreateModal} color="primary">
                                Cancel
                            </mui.Button>
                            <mui.Button onClick={createApp} color="primary" variant="contained">
                                Create
                            </mui.Button>
                        </>
                    }
                />

                <CustomSpeedDial onClick={handleOpenCreateModal} />

                <DynamicSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                    onClose={handleSnackbarClose}
                />

            </ResponsiveContainer>
        </div>

    )

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>

    );
}
export default ManageApplicationsv2;