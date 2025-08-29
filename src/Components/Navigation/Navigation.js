import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { onRouteChange, selectIsAdmin } from "../../store/slices/userSlice";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Logo from "../../logo512.png";
import "./Navigation.css";

const Navigation = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);

  const adminNavbar = () => {
    if (isAdmin) {
      return (
        <NavDropdown className="" title="Settings" id="collasible-nav-dropdown">
          <NavDropdown.Item
            onClick={() =>
              dispatch(onRouteChange({ route: "Holidays" }))
            } /*href="#h"*/
          >
            Holidays
          </NavDropdown.Item>
          <NavDropdown.Item
            onClick={() =>
              dispatch(onRouteChange({ route: "Call Types" }))
            } /*href="#ct"*/
          >
            Call Types
          </NavDropdown.Item>
          <NavDropdown.Item
            onClick={() =>
              dispatch(onRouteChange({ route: "People" }))
            } /*href="#pe"*/
          >
            People
          </NavDropdown.Item>
          <NavDropdown.Item
            onClick={() =>
              dispatch(onRouteChange({ route: "Entries" }))
            } /*href="#e"*/
          >
            Entries
          </NavDropdown.Item>
        </NavDropdown>
      );
    }
  };

  const ad = isAdmin ? "Admin " : "";

  return (
    <Navbar id="myNav">
      <Navbar.Brand
        onClick={() => dispatch(onRouteChange({ route: "Personal Schedule" }))}
        /*href="#p"*/ id="navbrand"
      >
        <img
          id="brand"
          alt="logo"
          src={Logo}
          width="50"
          height="50"
          className="d-inline-block align-top"
        />
        <h1 id="brandTitle" className="d-inline-block align-top">
          MeniSked
        </h1>
      </Navbar.Brand>
      <div id="collapser">
        <Nav className="">
          {adminNavbar()}
          <NavDropdown
            className="full-text"
            title="Schedules"
            id="collasible-nav-dropdown"
          >
            <NavDropdown.Item
              onClick={() =>
                dispatch(onRouteChange({ route: "Personal Schedule" }))
              } /*href="#p"*/
            >
              Personal
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() =>
                dispatch(onRouteChange({ route: "Call Schedule" }))
              } /*href="#c"*/
            >
              Call
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() =>
                dispatch(onRouteChange({ route: "Master Schedule" }))
              } /*href="#pu"*/
            >
              Master
            </NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            className="logo"
            title="Skeds"
            id="collasible-nav-dropdown"
          >
            <NavDropdown.Item
              onClick={() =>
                dispatch(onRouteChange({ route: "Personal Schedule" }))
              } /*href="#p"*/
            >
              Personal
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() =>
                dispatch(onRouteChange({ route: "Call Schedule" }))
              } /*href="#c"*/
            >
              Call
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() =>
                dispatch(onRouteChange({ route: "Master Schedule" }))
              } /*href="#pu"*/
            >
              Master
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link
            onClick={() => dispatch(onRouteChange({ route: ad + "Messages" }))}
            className="full-text linky" /*href="#m"*/
          >
            Messages
          </Nav.Link>
          <img
            onClick={() => dispatch(onRouteChange({ route: ad + "Messages" }))}
            alt="Messages"
            src="https://img.icons8.com/material-rounded/96/000000/mail.png"
            width="30"
            height="30"
            className="logo linky"
          />
          <Nav.Link
            onClick={() =>
              dispatch(onRouteChange({ route: "Account Information" }))
            }
            className="full-text linky" /*href="#a"*/
          >
            Account
          </Nav.Link>
          <img
            onClick={() =>
              dispatch(onRouteChange({ route: "Account Information" }))
            }
            alt="Account"
            src="https://img.icons8.com/material-rounded/96/000000/user-male-circle.png"
            width="30"
            height="30"
            className="logo linky"
          />
        </Nav>
      </div>
    </Navbar>
  );
};

export default Navigation;
