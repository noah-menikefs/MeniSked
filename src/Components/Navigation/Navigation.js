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
        <NavDropdown className="" title="Settings" id="collasible-nav-dropdown">
          <NavDropdown.Item href="#h">Holidays</NavDropdown.Item>
          <NavDropdown.Item href="#c">Call Types</NavDropdown.Item>
          <NavDropdown.Item href="#pe">People</NavDropdown.Item>
        </NavDropdown>
      );
    }
  }

  render(){
    const {testIsAdmin} = this.props
    return (
      <Navbar id="myNav">
        <Navbar.Brand href="#" id=''>
          <img id='brand' alt="logo" src={Logo} width="50" height="50" className="d-inline-block align-top"/>
          <h1 id="brandTitle" className="d-inline-block align-top">MeniSked</h1>
        </Navbar.Brand>
    			<div id="collapser">
      			<Nav className="">
        				{this.adminNavbar(testIsAdmin)}
                <NavDropdown className="full-text" title="Schedules" id="collasible-nav-dropdown">
         					<NavDropdown.Item href="#p">Personal</NavDropdown.Item>
          				<NavDropdown.Item href="#c">Call</NavDropdown.Item>
         					<NavDropdown.Item href="#pu">Published</NavDropdown.Item>
       			 	  </NavDropdown>
                 <NavDropdown className="logo" title="Skeds" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="#p">Personal</NavDropdown.Item>
                  <NavDropdown.Item href="#c">Call</NavDropdown.Item>
                  <NavDropdown.Item href="#pu">Published</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link className="full-text linky" href="#m">Messages</Nav.Link>
                <img onClick={() => console.log("click")} alt="Messages" src="https://img.icons8.com/material-rounded/96/000000/important-mail.png" width="30" height="30" className="logo linky"/>
                <Nav.Link className="full-text linky" href="#a">Account</Nav.Link>
               <img onClick={() => console.log("click")} alt="Account" src="https://img.icons8.com/material-rounded/96/000000/user-male-circle.png" width="30" height="30" className="logo linky"/>
      			</Nav>
          </div>
  		</Navbar>
    );
  }
}

export default Navigation;