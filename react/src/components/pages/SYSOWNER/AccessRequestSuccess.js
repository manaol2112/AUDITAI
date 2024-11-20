import React, { useState, useEffect, useRef, Suspense } from 'react';
import SysOwnerSideBar from './SysOwnerSidebar';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import userService from '../../../services/UserService';
import appService from '../../../services/ApplicationService';
import OutlinedCard from '../../common/MediaCard';
import Separator from '../../layout/Separator';
import companyService from '../../../services/CompanyService';
import ErrorBoundary from '../../common/ErrorBoundery';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DynamicTabs from '../../common/DynamicTabs';
import MultipleSelect from '../../common/MultipleSelect';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import NormalTextField from '../../common/NormalTextField';
import HRService from '../../../services/HrService';
import RequestService from '../../../services/RequestService';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { useParams } from 'react-router-dom';
import { Typography, IconButton, Button, Snackbar, Tooltip} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


const AccessRequestSuccess = () => {


    const [apps, setApps] = useState([]);
    const [error, setError] = useState(null);
    const [selectedticket, setSelectedTicket] = useState([]);
    const { id } = useParams();
    
    useEffect(() => {

        const fetchTicketRef = async () => {
            try {

                const ticket = await RequestService.fetchRequestById(id)

                if (ticket) {
                    setSelectedTicket(ticket.REQUEST_ID)
                }

            } catch (error) {
                console.error(`Error fetching application data: ${error.message}`);
            }
        };

        fetchTicketRef();

        // Empty dependency array ensures this effect runs only once on mount
    }, []);

    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(selectedticket)
          .then(() => {
            setOpenSnackbar(true);
          })
          .catch((err) => {
            console.error('Failed to copy text: ', err);
          });
      };
    

    const customMainContent = (
        <div>
            <ResponsiveContainer>

            <mui.Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
        >
            
            <mui.Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 800, boxShadow: 6, backgroundColor: "#f0f8ff" }}>
                <mui.Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Success!
                </mui.Typography>

                        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                            Your access request has been successfully processed with a reference number
                            <br />
                            <strong>{selectedticket}</strong>
                            <Tooltip title="Copy Reference" arrow>
                                <IconButton onClick={handleCopy} sx={{ cursor: 'pointer' }}>
                                    <ContentCopyIcon />
                                </IconButton>
                            </Tooltip>
                            <br />
                            Save this reference, in case you need to loop back later.
                        </Typography>

                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={2000}
                            onClose={() => setOpenSnackbar(false)}
                            message="Reference copied to clipboard!"
                        />

                {/* Optional Button */}
                <mui.Button 
                    variant="contained" 
                    color="success" 
                    size="large" 
                    onClick={() => window.location.href = `/accessrequest/dashboard`}
                >
                    Go back to form
                </mui.Button>
            </mui.Paper>
        </mui.Box>

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

export default AccessRequestSuccess;
