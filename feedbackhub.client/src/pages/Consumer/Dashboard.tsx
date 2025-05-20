import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Important for dropdowns, sidebar
import ConsumerNavbar from './Navbar';
import ConsumerSidebar from './Sidebar';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import AddFeedbackPage from './Feedback/AddFeedback';
import FeedbacksPage from '../Shared/Feedback/Feedbacks';
import ConsumerLayout from './ConsumerLayout';
import NotificationSetting from './NotificationSetting';
import ConsumerProfilePage from './ConsumerProfile';


const ConsumerDashboardPage: React.FC = () => {
    return (
        <>
            <ConsumerLayout>
                <Routes>
                    <Route path="/feedback/new" element={<AddFeedbackPage />} />
                    <Route path="/feedbacks/:ticketstatus" element={<FeedbacksPage />} />
                    <Route path="/notification-settings" element={<NotificationSetting />} />
                    <Route path="/profile" element={<ConsumerProfilePage />} />
                    <Route path="*" element={<LandingPage />} />
                </Routes>
            </ConsumerLayout>

        </>
    );
};

export default ConsumerDashboardPage;
