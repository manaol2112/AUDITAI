import React, { useState, useEffect, useRef, Suspense } from 'react';
import SysOwnerSideBar from './SysOwnerSidebar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import ErrorBoundary from '../../common/ErrorBoundery';
import RequestService from '../../../services/RequestService';
import FormGroup from '@mui/material/FormGroup';
import { Typography, IconButton, Button, Snackbar, Tooltip} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


const RoleMatrix = () => {

    const [apps, setApps] = useState([]);


    // Extract the query parameters from the URL (such as token)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    
    useEffect(() => {


       
    }, []);


    const customMainContent = (
        <div>
            <ResponsiveContainer>

            

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
