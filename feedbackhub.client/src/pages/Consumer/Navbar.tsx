import React,{useState} from 'react';
import { Navbar, Nav, Container, NavDropdown,Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ConsumerNavbar = () => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState('App One');
  const apps = ['App One', 'App Two'];

  const handleAppSwitch = (appName: string) => {
    setSelectedApp(appName);
    // Later, you can also fetch new data based on app here
  };
  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');   
  };

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
       <NavDropdown title={selectedApp} id="appSwitcherDropdown" align="end" className="me-3">
         {apps.map((app) => (
           <NavDropdown.Item
             key={app}
             onClick={() => handleAppSwitch(app)}
           >
             {app}
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
         <NavDropdown.Item href="#" className="text-danger">Logout</NavDropdown.Item>
       </NavDropdown>

     </Nav>
   </Navbar.Collapse>
 </Container>
</Navbar>

  );
}

export default ConsumerNavbar;

 
 