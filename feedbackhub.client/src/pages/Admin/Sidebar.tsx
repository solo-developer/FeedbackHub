import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  faGauge,
  faTable,
  faUsers,
  faUser,
  faUserShield,
  faEnvelope,
  faComments,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar = () => {

  const activeClass='text-green';
  return (
    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
       
        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">

          <li className="nav-item">
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link px-0 align-middle ${isActive ? activeClass : 'text-white'}`}>
              <FontAwesomeIcon icon={faGauge} className="me-2" />
              <span className="d-none d-sm-inline">Dashboard</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/admin/board" className={({ isActive }) => `nav-link px-0 align-middle ${isActive ? activeClass : ' text-white'}`}>
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              <span className="d-none d-sm-inline">Board</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/admin/feedbacks/open" className={({ isActive }) => `nav-link px-0 align-middle ${isActive ? activeClass : ' text-white'}`}>
              <FontAwesomeIcon icon={faComments} className="me-2" />
              <span className="d-none d-sm-inline">Feedbacks</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/admin/registration-requests" className={({ isActive }) => `nav-link px-0 align-middle ${isActive ? activeClass : ' text-white'}`}>
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              <span className="d-none d-sm-inline">Registration Requests</span>
            </NavLink>
          </li>

          {/* Users Submenu */}
          <li>
            <a
              href="#submenu-users"
              data-bs-toggle="collapse"
              className="nav-link text-white px-0 align-middle"
              aria-expanded="false"
            >
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              <span className="d-none d-sm-inline">Users</span>
            </a>
            <ul className="collapse nav flex-column ms-1" id="submenu-users" data-bs-parent="#menu">
              <li>
                <NavLink to="/admin/client-users" className={({ isActive }) => `nav-link px-0 ${isActive ? activeClass : ' text-white'}`}>
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  <span className="d-none d-sm-inline">Client Users</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/admin-users" className={({ isActive }) => `nav-link px-0 ${isActive ? activeClass : ' text-white'}`}>
                  <FontAwesomeIcon icon={faUserShield} className="me-2" />
                  <span className="d-none d-sm-inline">Admin Users</span>
                </NavLink>
              </li>
            </ul>
          </li>

          <li>
            <NavLink to="/admin/clients" className={({ isActive }) => `nav-link px-0 align-middle ${isActive ? activeClass : ' text-white'}`}>
              <FontAwesomeIcon icon={faTable} className="me-2" />
              <span className="d-none d-sm-inline">Client Organizations</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/applications" className={({ isActive }) => `nav-link px-0 align-middle ${isActive ? activeClass : ' text-white'}`}>
              <FontAwesomeIcon icon={faTable} className="me-2" />
              <span className="d-none d-sm-inline">Applications</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/feedback-type" className={({ isActive }) => `nav-link px-0 align-middle ${isActive ? activeClass : ' text-white'}`}>
              <FontAwesomeIcon icon={faTable} className="me-2" />
              <span className="d-none d-sm-inline">Feedback Type Setup</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/admin/email-configuration" className={({ isActive }) => `nav-link px-0 align-middle ${isActive ? activeClass : ' text-white'}`}>
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              <span className="d-none d-sm-inline">Email Configuration</span>
            </NavLink>
          </li>

        </ul>

        <hr />
      </div>
    </div>
  );
};

export default Sidebar;
