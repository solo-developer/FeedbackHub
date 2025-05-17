import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../../services/AuthService';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useUser } from '../../contexts/UserContext';

const AdminNavbar = () => {
  const navigate = useNavigate();
    const { user } = useUser();

  const logoutButtonClicked = () => {
   handleLogout(navigate);
  };

  return (
     <Navbar variant="dark"  bg="dark" expand="md" fixed="top" className='admin-navbar'>
      <Container fluid>
        <Button variant="primary" className="d-lg-none">
          ☰
        </Button>

        <Navbar.Brand className="ms-2" href="#">
          Feedback Hub
        </Navbar.Brand>

        {/* <Navbar.Toggle aria-controls="navbarScroll" /> */}
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto align-items-center">
            {/* Profile Dropdown */}
            <NavDropdown
              title={
                <span className="d-flex align-items-center">
                  <img
                    src= '/assets/images/default-user.png' 
                    alt="Profile"
                    className="rounded-circle me-2"
                    style={{ width: '30px', height: '30px' }}
                  />
                  {user?.Fullname}
                </span>
              }
              id="profileDropdown"
              align="end"
            >

              <NavDropdown.Item href="#">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/profile/change-password" className='text-warning'>Change Password</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#" className="text-danger" onClick={logoutButtonClicked}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;