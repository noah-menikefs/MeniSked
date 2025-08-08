import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Logo from "../../logo512.png";
import "./Login.css";

const Login = (props) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errorShow, setErrorShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [pWordShow, setPWordShow] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const onChange = (event, type) => {
    switch (type) {
      case "loginEmail":
        setLoginEmail(event.target.value);
        break;
      case "loginPassword":
        setLoginPassword(event.target.value);
        break;
      case "forgotEmail":
        setForgotEmail(event.target.value);
        break;
      default:
        break;
    }
  };

  const onSLogin = () => {
    fetch("https://secure-earth-82827.herokuapp.com/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.lastname) {
          props.onRouteChange("Personal Schedule");
          props.loadUser(user);
        } else {
          toggleErrorShow();
        }
      });
  };

  const toggleShow = () => {
    setShow(!show);
  };

  const toggleErrorShow = (type) => {
    if (type === "email") {
      setMsg(
        "Sorry, the email address you entered does not match our records."
      );
    } else {
      setMsg(
        "Sorry, the email address or password you entered does not match our records."
      );
    }
    setErrorShow(!errorShow);
  };

  const forgotPWordShow = () => {
    setPWordShow(!pWordShow);
  };

  const forgotPassword = () => {
    fetch("https://secure-earth-82827.herokuapp.com/forgot", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: forgotEmail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === "unable to get user") {
          toggleErrorShow("email");
        } else {
          toggleShow();
        }
      });
    setPWordShow(!pWordShow);
  };

  const { onRouteChange } = props;

  return (
    <div>
      <div className="test shadow-2">
        <div className="mt-5 spacing" id="loginHeader">
          <img
            style={{ paddingTop: "5px", height: 90, width: 90 }}
            alt="Logo"
            src={Logo}
          />
          <h1 id="title">MeniSked</h1>
        </div>
        <div className="justify-content-center" id="loginBody">
          <Form className="login-form" /*onSubmit={onSLogin}*/>
            <h1 id="loginTitle">Login</h1>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                onChange={(e) => onChange(e, "loginEmail")}
                required
                type="email"
                autoComplete="email"
                placeholder="Email"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Control
                onChange={(e) => onChange(e, "loginPassword")}
                type="password"
                autoComplete="current-password"
                placeholder="Password"
              />
            </Form.Group>
            <Button
              onClick={onSLogin}
              /*type="submit"*/ id="loginButton"
              variant="primary"
            >
              Login
            </Button>
            <Form.Group>
              <Form.Label onClick={forgotPWordShow} className="mt-3 label">
                Forgot Password?
              </Form.Label>
            </Form.Group>
          </Form>
        </div>
        <div className="shad spacing" id="loginFooter">
          <p>
            New user?{" "}
            <span
              onClick={() => onRouteChange("Register", false)}
              className="label"
            >
              Register Now
            </span>
          </p>
        </div>
      </div>
      <div className="modal">
        <Modal show={show} onHide={toggleShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Forgot Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            A temporary password has been sent to {forgotEmail}. Once you have
            signed in please change your password in the account tab.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggleShow}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="modal">
        <Modal show={errorShow} onHide={toggleErrorShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>{msg}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggleErrorShow}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="modal">
        <Modal show={pWordShow} onHide={forgotPWordShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Forgot Password</Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>
                  Enter your email below and we'll send you instructions to
                  retrieve your account.
                </Form.Label>
                <Form.Control
                  onChange={(e) => onChange(e, "forgotEmail")}
                  required
                  type="email"
                  placeholder="Email"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={forgotPWordShow} variant="secondary">
                Close
              </Button>
              <Button onClick={forgotPassword} variant="primary">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Login;
