import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  forgotPassword,
  selectUserError,
  clearError,
} from "../../store/slices/userSlice";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Logo from "../../logo512.png";
import "./Login.css";

const Login = (props) => {
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);
  // const loading = useSelector(selectUserLoading); // Will be used in future PRs for loading states

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

  const onSLogin = async () => {
    try {
      await dispatch(
        loginUser({ email: loginEmail, password: loginPassword })
      ).unwrap();
      // Success - Redux will handle the state changes
    } catch (error) {
      toggleErrorShow();
    }
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

  const handleForgotPassword = async () => {
    try {
      await dispatch(forgotPassword({ email: forgotEmail })).unwrap();
      setShow(true);
    } catch (error) {
      toggleErrorShow("email");
    }
    setPWordShow(false);
  };

  // Clear error when component unmounts or error changes
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

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
              onClick={() =>
                onRouteChange({ route: "Register", signedIn: false })
              }
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
              <Button onClick={handleForgotPassword} variant="primary">
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
