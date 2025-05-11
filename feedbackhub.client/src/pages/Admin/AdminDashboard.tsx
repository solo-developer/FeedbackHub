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
import NewAdminUserPage from './NewAdminUser';
import AdminFeedbackListPage from './AdminFeedbackList';
import AdminLayout from './AdminLayout';
import LandingPage from './LandingPage';

const AdminDashboard = () => {

  return (
    <AdminLayout>
     <Routes>
              <Route path="board" element={<Board />} />
              <Route path="dashboard" element={<LandingPage />} />
              <Route path="feedbacks" element={<AdminFeedbackListPage />} />
              <Route path="feedback-type" element={<FeedbackTypeIndexPage />} />
              <Route path="registration-requests" element={<RegistrationRequestPage />} />
              <Route path="clients" element={<ClientOrganizationIndexPage />} />
              <Route path="email-configuration" element={<EmailConfiguration />} />
              <Route path="applications" element={<ApplicationIndexPage />} />
              <Route path="/admin-users" element={<UsersPage userType="Admin"/>} />
              <Route path="/client-users" element={<UsersPage userType="Client"/>} />
              <Route path="/users/new" element={<NewAdminUserPage/>} />
              <Route path="*" element={<LandingPage />} />
            </Routes>
    </AdminLayout>
   
  );
};

export default AdminDashboard;
