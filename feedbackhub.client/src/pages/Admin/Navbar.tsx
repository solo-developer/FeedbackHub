import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../services/AuthService';

const Navbar = () => {
  const navigate = useNavigate();

  const logoutButtonClicked = () => {
   handleLogout(navigate);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div className="container-fluid">
      <a className="navbar-brand" href="#">Admin Dashboard</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">          
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={logoutButtonClicked}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  );
}

export default Navbar;