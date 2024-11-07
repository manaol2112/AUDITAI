import React, { useState, useEffect } from 'react';
import { SideBar } from '../../layout';
import { useNavigate } from 'react-router-dom';
import * as mui from '@mui/material';
import ResponsiveContainer from '../../layout/Container';
import SearchAppBar from '../../common/Appbar';
import Separator from '../../layout/Separator';
import GridViewIcon from '@mui/icons-material/GridView';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import appService from '../../../services/ApplicationService';
import userService from '../../../services/UserService';
import companyService from '../../../services/CompanyService';
import { useParams } from 'react-router-dom';
import DynamicTabs from '../../common/DynamicTabs';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const SysOwnerApplicationsUsers = () => {
    const [value, setValue] = React.useState(0);
    const [selectedNames, setSelectedNames] = useState([]);
    const { id } = useParams();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));


    const [users, setUsers] = useState([]);
    const [apps, setApps] = useState([]);
    const [selectedapps, setSelectedApps] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);

    const tabs = [
        { 
          value: '1', 
          label: 'All Users', 
          content: (
            <div>
              <h2>Tab 1 Content</h2>
              <p>This is the content for Item One.</p>
              <ul>
                <li>Point 1</li>
                <li>Point 2</li>
                <li>Point 3</li>
              </ul>
            </div>
          ),
        },
        { 
          value: '2', 
          label: 'New Users', 
          content: (
            <div>
              <h2>Tab 2 Content</h2>
              <p>This is the content for Item Two.</p>
              <form>
                <label>
                  Name:
                  <input type="text" />
                </label>
                <button type="submit">Submit</button>
              </form>
            </div>
          ),
        },
        { 
          value: '3', 
          label: 'Termed Users', 
          content: (
            <div>
              <h2>Tab 3 Content</h2>
              <p>This is the content for Item Three.</p>
              <div>
                <img src="path_to_image.jpg" alt="Example" />
              </div>
            </div>
          ),
        },
        { 
            value: '4', 
            label: 'Administrators', 
            content: (
              <div>
                <h2>Tab 4 Content</h2>
                <p>Administrators.</p>
                <div>
                  <img src="path_to_image.jpg" alt="Example" />
                </div>
              </div>
            ),
          },
          { 
            value: '5', 
            label: 'Transfers', 
            content: (
              <div>
                <h2>Tab 5 Content</h2>
                <p>Transfers.</p>
                <div>
                  <img src="path_to_image.jpg" alt="Example" />
                </div>
              </div>
            ),
          },
      ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch apps and users in parallel
                const [appsResponse, usersResponse, currentUserresponse, companyResponse, appsByIdResponse] = await Promise.all([
                    appService.fetchApps(),
                    userService.fetchUsers(),
                    userService.fetchCurrentUser(),
                    companyService.fetchCompanies(),
                    appService.fetchAppsById(id)
                ]);
                
                setSelectedApps(appsByIdResponse)
                setUsers(usersResponse);
                setCurrentUser(currentUserresponse)
               
                const assignedAppResponse = await appService.fetchAppsByOwner(currentUserresponse.id)
                setApps(assignedAppResponse)


            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error appropriately (e.g., show error message to the user)
            }
        };

        fetchData();

        // Empty dependency array ensures this effect runs only once on mount
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
                    <mui.Link underline="hover" color="inherit" href="/Applications">
                        My Applications
                    </mui.Link>
                    <mui.Typography color="text.primary"> {selectedapps.APP_NAME}</mui.Typography>
                </mui.Breadcrumbs>

                <SearchAppBar  title={`${selectedapps.COMPANY_NAME} - ${selectedapps.APP_NAME}`} icon={<GridViewIcon />} />

                <mui.Typography sx={{ marginTop: '20px' }} variant="subtitle2" gutterBottom>
                    Manage, review, and download application user access data
                </mui.Typography>

                <Separator />

                <DynamicTabs tabs={tabs} />

                
            </ResponsiveContainer>
        </div>
    )

    return (
        <div>
            <SideBar mainContent={customMainContent} />
        </div>

    );
}
export default SysOwnerApplicationsUsers;