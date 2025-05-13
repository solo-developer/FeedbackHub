import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useToast } from '../../contexts/ToastContext';
import { handleLogout } from '../../services/AuthService';
import { useAppSwitcher } from '../../contexts/AppSwitcherContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const ConsumerNavbar = () => {
  const { selectedApp, setSelectedApp, apps } = useAppSwitcher();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();

  const handleAppSwitch = (app: typeof selectedApp) => {
    if (app?.Id !== selectedApp?.Id && app) {
      setSelectedApp(app);
      showToast(`Switched to ${app?.Name}`, 'success', {
        autoClose: 2000,
      });
    }
  };

  const logoutButtonClicked = () => {
    handleLogout(navigate);
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
      <Container fluid>
        <Button variant="primary" className="d-lg-none">
          ☰
        </Button>

        <Navbar.Brand className="ms-2" href="#">
          Feedback Hub ({user?.Client})
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto align-items-center">
            {selectedApp && (
              <NavDropdown title={selectedApp.Name} id="appSwitcherDropdown" align="end" className="me-3">
                {apps.map((app) => (
                  <NavDropdown.Item
                    key={app.Id}
                    onClick={() => handleAppSwitch(app)}
                    active={app.Id === selectedApp.Id}
                  >
                    {app.Name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            )}

            {/* Profile Dropdown */}
            <NavDropdown
              title={
                <span className="d-flex align-items-center">
                  <img
                    src={
                      user?.Avatar && user.Avatar.length > 0
                        ? URL.createObjectURL(new Blob([new Uint8Array(user.Avatar)], { type: 'image/png' }))
                        : '/assets/images/default-user.png' 
                    }
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
};

export default ConsumerNavbar;
