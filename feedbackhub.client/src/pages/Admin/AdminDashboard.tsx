import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from '../Consumer/Dashboard';
import LoginPage from '../Login';
import FeedbackTypeIndexPage from './FeedbackTypeIndex';
import ClientOrganizationIndexPage from './ClientOrganization';
import EmailConfiguration from './EmailConfiguration';
import RegistrationRequestPage from './RegistrationRequest';
import ApplicationIndexPage from './ApplicationIndex';
import UsersPage from '../Users';
import Board from './Board';
import NewAdminUser from './NewAdminUser';
import NewAdminUserPage from './NewAdminUser';

const AdminDashboard = () => {
 

  return (
    <div className="container-fluid" style={{position: 'absolute',top:0,left:0,right:0}}>
      {/* Top Navbar */}
    <Navbar></Navbar>

      {/* Content Row */}
      <div className="row flex-nowrap" style={{ marginTop: '3.5rem' }}>
        {/* Sidebar */}
         <Sidebar></Sidebar>

        {/* Main Content */}
        <div className="col" style={{ marginTop: '2rem' }}>
            <Routes>
              <Route path="board" element={<Board />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="feedback-type" element={<FeedbackTypeIndexPage />} />
              <Route path="registration-requests" element={<RegistrationRequestPage />} />
              <Route path="clients" element={<ClientOrganizationIndexPage />} />
              <Route path="email-configuration" element={<EmailConfiguration />} />
              <Route path="applications" element={<ApplicationIndexPage />} />
              <Route path="/admin-users" element={<UsersPage userType="Admin"/>} />
              <Route path="/client-users" element={<UsersPage userType="Client"/>} />
              <Route path="/users/new" element={<NewAdminUserPage/>} />
              <Route path="*" element={<LoginPage />} />
            </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
