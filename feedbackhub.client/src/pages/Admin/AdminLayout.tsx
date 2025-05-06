import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="container-fluid" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
      <Navbar />
      <div className="row flex-nowrap" style={{ marginTop: '3.5rem' }}>
        <Sidebar />
        <div className="col" style={{ marginTop: '2rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
