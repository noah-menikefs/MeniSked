import React, { useState, useEffect, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Account.css";
import { validateEmail } from "../../utils";

const Account = ({ loadUser, user }) => {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [nPassword, setNPassword] = useState("");
  const [cNPassword, setCNPassword] = useState("");
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");

  const loadAccount = useCallback(() => {
    fetch(`https://secure-earth-82827.herokuapp.com/account/${user.id}`)
      .then((response) => response.json())
      .then((user) => {
        setEmail(user.email);
        setFirstname(user.firstname);
        setLastname(user.lastname);
      });
  }, [user.id]);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  const onChange = (e, type) => {
    const value = e.target.value;
    switch (type) {
      case "email":
        setEmail(value);
        break;
      case "firstname":
        setFirstname(value);
        break;
      case "lastname":
        setLastname(value);
        break;
      case "cPassword":
        setCPassword(value);
        break;
      case "nPassword":
        setNPassword(value);
        break;
      case "cNPassword":
        setCNPassword(value);
        break;
      default:
        break;
    }
  };

  const toggleShow = useCallback((route) => {
    const messages = {
      success: [
        "Success!",
        "Your account information has been successfully changed!",
      ],
      incorrect: [
        "Incorrect Password",
        "The current password you entered is incorrect.",
      ],
      different: ["Error", "The new passwords you entered do not match."],
      pass: ["Error", "Please enter a valid password."],
      email: ["Error", "Please enter a valid email address."],
      name: ["Error", "Please enter a valid email name."],
      error: ["Error", "Sorry, this email appears to already be in use."],
    };

    if (route && messages[route]) {
      setTitle(messages[route][0]);
      setMsg(messages[route][1]);
      setShow(true);
    } else {
      setTitle("");
      setMsg("");
      setShow(false);
    }
  }, []);

  const onSubmitBasic = () => {
    if (firstname.length > 0 && lastname.length > 0 && validateEmail(email)) {
      fetch(`https://secure-earth-82827.herokuapp.com/account/${user.id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstname, lastname }),
      })
        .then((res) => res.json())
        .then((resUser) => {
          if (resUser.email) {
            setEmail(resUser.email);
            setFirstname(resUser.firstname);
            setLastname(resUser.lastname);
            loadUser(resUser);
            toggleShow("success");
          } else if (resUser === "unable to edit") {
            toggleShow("error");
          }
        });
    } else if (!validateEmail(email)) {
      toggleShow("email");
    } else if (firstname.length === 0 || lastname.length === 0) {
      toggleShow("name");
    }
  };

  const onSubmitAll = () => {
    if (
      cPassword.length > 0 &&
      nPassword.length > 0 &&
      nPassword === cNPassword
    ) {
      fetch(`https://secure-earth-82827.herokuapp.com/account/${user.id}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: cPassword,
          newPassword: nPassword,
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response === "incorrect password") {
            toggleShow("incorrect");
          } else {
            onSubmitBasic();
            setCPassword("");
            setNPassword("");
            setCNPassword("");
          }
        });
    } else if (nPassword !== cNPassword) {
      toggleShow("different");
    } else if (nPassword.length === 0) {
      toggleShow("pass");
    }
  };

  const onSubmitChoose = () => {
    if (cPassword.length > 0) {
      onSubmitAll();
    } else {
      onSubmitBasic();
    }
  };

  return (
    <div>
      <div>
        <div className="accountInfo">
          <h5 id="text">Email Address</h5>
          <input
            value={email}
            onChange={(e) => onChange(e, "email")}
            type="email"
            name="email"
            className="accountInp"
          />
          <h5 id="text">First Name</h5>
          <input
            value={firstname}
            onChange={(e) => onChange(e, "firstname")}
            type="text"
            name="first"
            className="accountInp"
          />
          <h5 id="text">Last Name</h5>
          <input
            value={lastname}
            onChange={(e) => onChange(e, "lastname")}
            type="text"
            name="last"
            className="accountInp"
          />
        </div>
        <div className="changePass">
          <h2 id="header">Change Password</h2>
          <h5 id="text">Current Password</h5>
          <input
            value={cPassword}
            onChange={(e) => onChange(e, "cPassword")}
            type="password"
            name="cp"
            className="accountInp"
          />
          <h5 id="text">New Password</h5>
          <input
            value={nPassword}
            onChange={(e) => onChange(e, "nPassword")}
            type="password"
            name="np"
            className="accountInp"
          />
          <h5 id="text">Confirm New Password</h5>
          <input
            value={cNPassword}
            onChange={(e) => onChange(e, "cNPassword")}
            type="password"
            name="cnp"
            className="accountInp"
          />
        </div>
        <Button onClick={onSubmitChoose} id="submit" variant="primary">
          Submit
        </Button>
      </div>
      <div className="modal">
        <Modal show={show} onHide={() => toggleShow()}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{msg}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => toggleShow()} variant="secondary">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Account;
