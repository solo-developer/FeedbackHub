import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { ApplicationDto } from '../../types/application/ApplicationDto';
import { fetchApplicationsAsync } from '../../services/Consumer/SubscriptionService';
import { useToast } from '../../contexts/ToastContext';
import { handleLogout } from '../../services/AuthService';

const ConsumerNavbar = () => {
    const [selectedApp, setSelectedApp] = useState<ApplicationDto>();
    const [apps, setApps] = useState<ApplicationDto[]>([]);
    const { showToast } = useToast();
    const handleAppSwitch = (appName: ApplicationDto) => {
        setSelectedApp(appName);
    };

    const logoutButtonClicked = () => {
         handleLogout();    
    };

    const fetchApplications = async () => {
        try {
            const response = await fetchApplicationsAsync();

            if (response.Success) {
                setApps(response.Data);
                setSelectedApp(response.Data[0]);
            }
            else {
                showToast(response.Message, response.ResponseType, {
                    autoClose: 3000,
                    draggable: true
                });
            }

        } catch (err) {
            showToast('Failed to load applications', 'error');
        }
    }

    useEffect(() => {
        fetchApplications();
    }, []);

    return (

        <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
            <Container fluid>
                {/* Sidebar Toggle Button */}
                <Button variant="primary" className="d-lg-none">
                    ☰
                </Button>

                {/* Brand */}
                <Navbar.Brand className="ms-2" href="#">
                    Consumer Dashboard
                </Navbar.Brand>

                {/* Navbar Collapse */}
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="ms-auto align-items-center">

                        {/* App Switcher Dropdown */}
                        <NavDropdown title={selectedApp?.Name} id="appSwitcherDropdown" align="end" className="me-3">
                            {apps.map((app) => (
                                <NavDropdown.Item
                                    key={app.Id}
                                    onClick={() => handleAppSwitch(app)}
                                >
                                    {app.Name}
                                </NavDropdown.Item>
                            ))}
                        </NavDropdown>

                        {/* Profile Dropdown */}
                        <NavDropdown
                            title={
                                <span className="d-flex align-items-center">
                                    <img
                                        src="https://via.placeholder.com/30"
                                        alt="Profile"
                                        className="rounded-circle me-2"
                                        style={{ width: '30px', height: '30px' }}
                                    />
                                    John Doe
                                </span>
                            }
                            id="profileDropdown"
                            align="end"
                        >
                            <NavDropdown.Item href="#">Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#" className="text-danger" onClick={() => logoutButtonClicked()}>Logout</NavDropdown.Item>
                        </NavDropdown>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
}

export default ConsumerNavbar;


