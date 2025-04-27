import React,{useState} from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {

    return (

        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
          <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <span className="fs-5 d-none d-sm-inline">Menu</span>
          </a>
          <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
            <li className="nav-item">
              <Link to="/admin/dashboard"  className="nav-link align-middle px-0">
                <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin/dashboard"  className="nav-link align-middle px-0">
                <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Feedbacks</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin/registration-requests"  className="nav-link align-middle px-0">
                <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Registration Requests</span>
              </Link>
            </li>
       


            <li>
              <a href="#submenu1" data-bs-toggle="collapse" className="nav-link px-0 align-middle">
                <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Users</span>
              </a>
              <ul className="collapse show nav flex-column ms-1" id="submenu1" data-bs-parent="#menu">
                <li className="w-100">
                  <Link to="/admin/client-users" className="nav-link px-0">
                    <span className="d-none d-sm-inline">Client Users</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/admin-users" className="nav-link px-0">
                    <span className="d-none d-sm-inline">Admin Users</span>
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/admin/clients" className="nav-link px-0 align-middle">
                <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Client Organizations</span>
              </Link>
            </li>
            <li>
            <Link to="/admin/applications"  className="nav-link align-middle px-0">
                <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Applications</span>
              </Link>
            </li>

            <li>
            <Link to="/admin/feedback-type"  className="nav-link align-middle px-0">
                <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Feedback Type Setup</span>
              </Link>
            </li>
           
            <li>
              <Link to="/admin/email-configuration" className="nav-link px-0 align-middle">
                <i className="fs-4 bi-grid"></i> <span className="ms-1 d-none d-sm-inline">Email Configuration</span>
              </Link>
              
            </li>           
          </ul>
          <hr />
          
        </div>
      </div>
    );
}

export default Sidebar;