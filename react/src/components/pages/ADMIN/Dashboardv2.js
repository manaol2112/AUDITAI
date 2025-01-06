import React, { useState } from 'react';
import { SideBar } from '../../layout';
import * as mui from '@mui/material';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import ResponsiveContainer from '../../layout/Container';
import AppsIcon from '@mui/icons-material/Apps';
import {
    UsersIcon,
    ComputerDesktopIcon,
    BuildingOfficeIcon,
    LinkIcon,
    LockClosedIcon,
    Square3Stack3DIcon
    
} from '@heroicons/react/24/outline';

const Dashboardv2 = () => {
    const actions = [
        {
            title: 'Companies',
            href: '/Companies',
            icon: BuildingOfficeIcon,
            iconForeground: 'text-teal-700',
            iconBackground: 'bg-teal-50',
            description: 'Manage and view your company details, add new companies or edit existing ones.'
        },
        {
            title: 'System Roles',
            href: '/SystemRoles',
            icon: ComputerDesktopIcon,
            iconForeground: 'text-purple-700',
            iconBackground: 'bg-purple-50',
            description: 'Configure roles for users in your system and assign them appropriate permissions.'
        },
        {
            title: 'Users',
            href: '/ManageUsers',
            icon: UsersIcon,
            iconForeground: 'text-sky-700',
            iconBackground: 'bg-sky-50',
            description: 'View, manage, and update the user accounts and their settings.'
        },
        {
            title: 'Applications',
            href: '/Applications',
            icon: Square3Stack3DIcon,
            iconForeground: 'text-yellow-700',
            iconBackground: 'bg-yellow-50',
            description: 'Manage applications, configure integrations, and monitor system status.'
        },
        {
            title: 'Security',
            href: '/Security',
            icon: LockClosedIcon,
            iconForeground: 'text-rose-700',
            iconBackground: 'bg-rose-50',
            description: 'Set up and manage security protocols for your system.'
        },
        {
            title: 'Interfaces',
            href: '/Interfaces',
            icon: LinkIcon,
            iconForeground: 'text-indigo-700',
            iconBackground: 'bg-indigo-50',
            description: 'Configure external interfaces and API integrations for your system.'
        },
    ];

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
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
                    <mui.Typography color="text.primary">System Settings</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar title="Manage System Settings" icon={<AppsIcon />} />
                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage users, integrations, system security, and other settings
                </mui.Typography>
                <Separator />

                <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
                    {actions.map((action, actionIdx) => (
                        <a
                            key={action.title}
                            href={action.href}
                            className={classNames(
                                actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
                                actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
                                actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
                                actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
                                'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500',
                            )}
                            style={{ textDecoration: 'none' }} 
                        >
                            <div>
                                <span
                                    className={classNames(
                                        action.iconBackground,
                                        action.iconForeground,
                                        'inline-flex rounded-lg p-3 ring-4 ring-white',
                                    )}
                                >
                                    <action.icon aria-hidden="true" className="size-8" />
                                </span>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-base font-semibold text-gray-900">
                                    {action.title}
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    {action.description}
                                </p>
                            </div>
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" className="size-6">
                                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                                </svg>
                            </span>
                        </a>
                    ))}
                </div>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>
    );
}

export default Dashboardv2;
