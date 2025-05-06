import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Admin/AdminLayout';
import ConsumerLayout from '../../Consumer/ConsumerLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { ADMIN_ROLE } from '../../../utils/Constants';
import PagePanel from '../../../components/PagePanel';
import { useParams } from 'react-router-dom';

const EditFeedbackPage: React.FC = () => {

    const { id } = useParams<{ id: keyof typeof Number }>();

   const { isAuthenticated, role, setAuthState } = useAuth();

    const Layout = role === ADMIN_ROLE ? AdminLayout : ConsumerLayout;
  
    return (
      <Layout>
        <PagePanel title="Edit feedback">
            <div>Edit Feedback</div>
        </PagePanel>
      </Layout>
    );
  
  
};

export default EditFeedbackPage;
