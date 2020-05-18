import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from '../../logo512.png';
import './Navigation.css';

class Navigation extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  adminNavbar(isAdmin){
    if (isAdmin){
      return (
        <NavDropdown title="Settings" id="collasible-nav-dropdown">
          <NavDropdown.Item href="#">Holidays</NavDropdown.Item>
          <NavDropdown.Item href="#">Call Types</NavDropdown.Item>
          <NavDropdown.Item href="#">People</NavDropdown.Item>
        </NavDropdown>
      );
    }
  }

  render(){
    const {testIsAdmin} = this.props
    return (
      <Navbar collapseOnSelect expand="md" bg="light" variant="light">
        <Navbar.Brand href="#" id=''>
          <img alt="logo" src={Logo} width="50" height="50" className="d-inline-block align-top"/>
          <h1 id="brandTitle"className="d-inline-block align-top">MeniSked</h1>
        </Navbar.Brand>
   			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
    			<Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
      			<Nav className="">
        				{this.adminNavbar(testIsAdmin)}
                <NavDropdown title="Schedules" id="collasible-nav-dropdown">
         					<NavDropdown.Item href="#">Personal</NavDropdown.Item>
          				<NavDropdown.Item href="#">Call</NavDropdown.Item>
         					<NavDropdown.Item href="#">Published</NavDropdown.Item>
       			 	</NavDropdown>
              <Nav.Link href="#">Messages</Nav.Link>
              <Nav.Link href="#">Account</Nav.Link>
      			</Nav>
    			</Navbar.Collapse>
  		</Navbar>
    );
  }
}

export default Navigation;