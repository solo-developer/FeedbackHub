import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Important for dropdowns, sidebar
import ConsumerNavbar from './Navbar';
import ConsumerSidebar from './Sidebar';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';


const ConsumerDashboardPage: React.FC = () => {
    return (
        <>
            <ConsumerNavbar></ConsumerNavbar>
            <div className="container-fluid" style={{ marginTop: '4.5rem' }}>
                <div className="row">
                    <ConsumerSidebar></ConsumerSidebar>

                    {/* Main Content */}
                    <main className="col-lg-10 px-4">
                    <Routes>                       
                        <Route path="*" element={<LandingPage />} />
                    </Routes>
                    </main>
                </div>
            </div>

        </>
    );
};

export default ConsumerDashboardPage;
