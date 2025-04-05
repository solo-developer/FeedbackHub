import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from '../Consumer/Dashboard';
import LoginPage from '../Login';
import FeedbackTypeIndexPage from './FeedbackTypeIndex';

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
        <div className="col" style={{ marginTop: '56px' }}>
            <Routes>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="feedback-type" element={<FeedbackTypeIndexPage />} />
              <Route path="*" element={<LoginPage />} />
            </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
