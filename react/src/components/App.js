import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/ADMIN/Dashboard';
import Companies from './pages/ADMIN/Companies';
import CompanyDetails from './pages/ADMIN/CompaniesDetails';
import SystemRoles from './pages/ADMIN/SystemRole';
import SystemRoleDetails from './pages/ADMIN/SystemRoleDetails';
import ManageUser from './pages/ADMIN/ManageUsers';
import ManageUsersDetails from './pages/ADMIN/ManageUsersDetails';
import PrivateRoute from '../PrivateRoute';
import Security from './pages/ADMIN/Security';
import PasswordSettings from './pages/ADMIN/PasswordSettings';
import Interfaces from './pages/ADMIN/Interfaces';
import InterfacesHR from './pages/ADMIN/InterfacesHR';
import InterfacesHRDetails from './pages/ADMIN/InterfacesHRDetails';
import InterfacesApp from './pages/ADMIN/InterfacesApp';
import InterfacesHRHome from './pages/ADMIN/InterfacesHRHome';
import InterfacesAppHome from './pages/ADMIN/InterfaceAppHome';
import ManageApplications from './pages/ADMIN/Applications';
import ManageApplicationsDetails from './pages/ADMIN/ApplicationDetails';
import Cookies from 'js-cookie';
import SysOwnerDashboard from './pages/SYSOWNER/SysOwnerDashboard';
import SysOwnerApplications from './pages/SYSOWNER/MyApplications';
import SysOwnerApplicationsUsers from './pages/SYSOWNER/MyApplicationsUsers';
import MyApplicationGeneralInfo from './pages/SYSOWNER/MyApplicationGeneralInfo';
import MyApplicationManageUsers from './pages/SYSOWNER/MyApplicationManageUser';
import MyApplicationControls from './pages/SYSOWNER/MyApplicationControls';
import SysOwnerCompliance from './pages/SYSOWNER/MyCompliance';
import IAAuditDashboard from './pages/AUDIT/IADashboard';
import AuditRiskLibrary from './pages/AUDIT/RiskLibrary';
import ControlsLibrary from './pages/AUDIT/ControlsLibrary';
import AuditProjects from './pages/AUDIT/Projects';
import AuditProjectSettings from './pages/AUDIT/ProjectSettings';
import RiskandControlMapping from './pages/AUDIT/RiskandControl';
import RiskMapping from './pages/AUDIT/RiskMapping';
import Workpapers from './pages/AUDIT/Workpapers';
import WorkpapersDetails from './pages/AUDIT/WorkpaperDetails';
import ProcedureLibrary from './pages/AUDIT/ProcedureLibrary';
import ProcessNarrative from './pages/SYSOWNER/ProcessNarrative';
import ProcessNarrativeDetails from './pages/SYSOWNER/ProcessNarrativeDetails';
import AccessRequestDashboard from './pages/SYSOWNER/AccessRequestDashboard';
import AccessRequestSuccess from './pages/SYSOWNER/AccessRequestSuccess';
import AccessRequestApproval from './pages/SYSOWNER/AccessRequestApproval';
import MyAccessRequest from './pages/SYSOWNER/MyAccessRequests';
import RoleMatrix from './pages/SYSOWNER/RoleMatrix';
import LandingPage from './pages/DEFAULT/Landingpage';


const App = () => {
  const token = Cookies.get('token');
  const storedGroups = Cookies.get('groups');
  const groups = storedGroups ? JSON.parse(storedGroups) : [];

  // Function to check if a group exists in the user's groups
  const isGroupMember = (requiredGroup) => {
    return groups.includes(requiredGroup);
  };

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        <Route path="" element={<LandingPage />} />

        {/* Private routes based on user groups */}
        {isGroupMember('Administrator') && (
          <Route path="/" element={<PrivateRoute requiredGroup="Administrator" />}>
            {/* <Route index path="/" element={<Dashboard />} /> */}
            <Route index path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:companyId" element={<CompanyDetails />} />
            <Route path="/systemRoles" element={<SystemRoles />} />
            <Route path="/systemRoles/:id" element={<SystemRoleDetails />} />
            <Route path="/manageUsers" element={<ManageUser />} />
            <Route path="/manageUsers/:username" element={<ManageUsersDetails />} />
            <Route path="/security" element={<Security />} />
            <Route path="/interfaces" element={<Interfaces />} />
            <Route path="/interfaces/HR" element={<InterfacesHR />} />
            <Route path="/interfaces/HR/Home" element={<InterfacesHRHome />} />
            <Route path="/interfaces/HR/Details" element={<InterfacesHRDetails />} />
            <Route path="/interfaces/Applications" element={<InterfacesApp />} />
            <Route path="/interfaces/Applications/Home" element={<InterfacesAppHome />} />
            <Route path="/security/PasswordConfiguration" element={<PasswordSettings />} />
            <Route path="/applications" element={<ManageApplications />} />
            <Route path="/applications/:id" element={<ManageApplicationsDetails />} />
          </Route>
        )}

        {isGroupMember('Process Owner') && (
          <Route path="/" element={<PrivateRoute requiredGroup="Process Owner" />}>
            {/* <Route  index path="/" element={<SysOwnerDashboard />} /> */}
            <Route  index path="/dashboard" element={<SysOwnerDashboard />} />
            <Route  path="/applications" element={<SysOwnerApplications />} />
            <Route  path="/applications/Users/:id" element={<SysOwnerApplicationsUsers />} />
            <Route  path="/applications/SetupInfo/:id" element={<MyApplicationGeneralInfo />} />
            <Route  path="/applications/ManageUsers/:id" element={<MyApplicationManageUsers />} />
            <Route  path="/applications/controls/:id" element={<MyApplicationControls />} />
            <Route  path="/applications/rolematrix/:id" element={<RoleMatrix />} />
            <Route  path="/compliance" element={<SysOwnerCompliance />} />
            <Route  path="/processNarrative" element={<ProcessNarrative />} />
            <Route  path="/processNarrative/:company/:id" element={<ProcessNarrativeDetails />} />
            <Route  path="/accessrequest/dashboard" element={<AccessRequestDashboard />} />
            <Route  path="/accessrequest/success/:id" element={<AccessRequestSuccess />} />
            <Route  path="/accessrequest/approval/:id" element={<AccessRequestApproval />} />
            <Route  path="/accessrequest/granting/" element={<MyAccessRequest />} />
          </Route>
        )}

        {isGroupMember('Internal Auditor') && (
          <Route path="/" element={<PrivateRoute requiredGroup="Internal Auditor"/>}>
            {/* <Route index path="/" element={<IAAuditDashboard />} /> */}
            <Route index path="/dashboard" element={<IAAuditDashboard />} />
            <Route  path="/audit/RiskLibrary" element={<AuditRiskLibrary />} />
            <Route  path="/audit/ControlsLibrary" element={<ControlsLibrary />} />
            <Route  path="/audit/Projects" element={<AuditProjects />} />
            <Route  path="/audit/Projects/:id" element={<AuditProjectSettings />} />
            <Route  path="/audit/RiskandControlMapping/:id" element={<RiskandControlMapping />} />
            <Route  path="/audit/RiskandControlMapping/Application/:company_id/:id" element={<RiskMapping />} />
            <Route  path="/audit/Workpapers/:id" element={<Workpapers />} />
            <Route  path="/audit/Workpapers/Project/:id/Control/:controlref" element={<WorkpapersDetails />} />
            <Route  path="/audit/ProcedureLibrary" element={<ProcedureLibrary />} />
          </Route>
        )}

      </Routes>
    </Router>
  );
};

export default App;
