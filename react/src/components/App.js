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
        <Route path="" element={<Login />} />

        {/* Private routes based on user groups */}
        {isGroupMember('Administrator') && (
          <Route element={<PrivateRoute requiredGroup="Administrator" />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Companies" element={<Companies />} />
            <Route path="/Companies/:companyId" element={<CompanyDetails />} />
            <Route path="/SystemRoles" element={<SystemRoles />} />
            <Route path="/SystemRoles/:id" element={<SystemRoleDetails />} />
            <Route path="/ManageUsers" element={<ManageUser />} />
            <Route path="/ManageUsers/:username" element={<ManageUsersDetails />} />
            <Route path="/Security" element={<Security />} />
            <Route path="/Interfaces" element={<Interfaces />} />
            <Route path="/Interfaces/HR" element={<InterfacesHR />} />
            <Route path="/Interfaces/HR/Home" element={<InterfacesHRHome />} />
            <Route path="/Interfaces/HR/Details" element={<InterfacesHRDetails />} />
            <Route path="/Interfaces/Applications" element={<InterfacesApp />} />
            <Route path="/Interfaces/Applications/Home" element={<InterfacesAppHome />} />
            <Route path="/Security/PasswordConfiguration" element={<PasswordSettings />} />
            <Route path="/Applications" element={<ManageApplications />} />
            <Route path="/Applications/:id" element={<ManageApplicationsDetails />} />
          </Route>
        )}

        {isGroupMember('Process Owner') && (
          <Route path="/" element={<PrivateRoute requiredGroup="Process Owner" />}>
            <Route index path="/" element={<SysOwnerDashboard />} />
            <Route index path="/Dashboard" element={<SysOwnerDashboard />} />
            <Route  path="/Applications" element={<SysOwnerApplications />} />
            <Route  path="/Applications/Users/:id" element={<SysOwnerApplicationsUsers />} />
            <Route  path="/Applications/SetupInfo/:id" element={<MyApplicationGeneralInfo />} />
            <Route  path="/Applications/ManageUsers/:id" element={<MyApplicationManageUsers />} />
            <Route  path="/Applications/Controls/:id" element={<MyApplicationControls />} />
            <Route  path="/Compliance" element={<SysOwnerCompliance />} />
            <Route  path="/ProcessNarrative" element={<ProcessNarrative />} />
            <Route  path="/ProcessNarrative/:id" element={<ProcessNarrativeDetails />} />
          </Route>
        )}

        {isGroupMember('Internal Auditor') && (
          <Route path="/" element={<PrivateRoute requiredGroup="Internal Auditor"/>}>
            <Route index path="/" element={<IAAuditDashboard />} />
            <Route index path="/Dashboard" element={<IAAuditDashboard />} />
            <Route  path="/Audit/RiskLibrary" element={<AuditRiskLibrary />} />
            <Route  path="/Audit/ControlsLibrary" element={<ControlsLibrary />} />
            <Route  path="/Audit/Projects" element={<AuditProjects />} />
            <Route  path="/Audit/Projects/:id" element={<AuditProjectSettings />} />
            <Route  path="/Audit/RiskandControlMapping/:id" element={<RiskandControlMapping />} />
            <Route  path="/Audit/RiskandControlMapping/Application/:company_id/:id" element={<RiskMapping />} />
            <Route  path="/Audit/Workpapers/:id" element={<Workpapers />} />
            <Route  path="/Audit/Workpapers/Project/:id/Control/:controlref" element={<WorkpapersDetails />} />
            <Route  path="/Audit/ProcedureLibrary" element={<ProcedureLibrary />} />
          </Route>
        )}

      </Routes>
    </Router>
  );
};

export default App;
