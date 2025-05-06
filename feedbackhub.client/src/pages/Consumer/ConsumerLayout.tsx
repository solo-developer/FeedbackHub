import React from 'react';
import ConsumerNavbar from '../Consumer/Navbar';
import ConsumerSidebar from '../Consumer/Sidebar';

const ConsumerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <ConsumerNavbar />
      <div className="container-fluid" style={{ marginTop: '4.5rem' }}>
        <div className="row">
          <ConsumerSidebar />
          <main className="col-lg-10 px-4">{children}</main>
        </div>
      </div>
    </>
  );
};

export default ConsumerLayout;
