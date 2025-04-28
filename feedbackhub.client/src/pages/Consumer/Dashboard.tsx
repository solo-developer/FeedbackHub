import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Important for dropdowns, sidebar
import ConsumerNavbar from './Navbar';
import ConsumerSidebar from './Sidebar';


const ConsumerDashboardPage: React.FC = () => {
  return (
    <>
       <ConsumerNavbar></ConsumerNavbar>
       <div className="container-fluid" style={{ marginTop: '4.5rem' }}>
<div className="row">
 <ConsumerSidebar></ConsumerSidebar>
 
  {/* Main Content */}
  <main className="col-lg-10 px-4">
    <h2>Welcome to the Feedback Portal!</h2>
    <p>Currently viewing feedbacks </p>
    <p>Manage all your customer feedback efficiently and switch between apps as needed.</p>
  </main>
</div>
</div>
      
    </>
  );
};

export default ConsumerDashboardPage;
