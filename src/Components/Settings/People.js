import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Scroll from "./../Scroll/Scroll";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./Settings.css";

const People = (props) => {
  const [peopleList, setPeopleList] = useState([]);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [dShow, setDShow] = useState(false);
  const [id, setId] = useState(-1);
  const [eshow, setEshow] = useState(false);

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = () => {
    fetch("https://secure-earth-82827.herokuapp.com/people")
      .then((response) => response.json())
      .then((users) => setPeopleList(users));
  };

  const addPerson = () => {
    const { department } = props;
    if (fName.length > 0 && lName.length > 0 && email.length > 0) {
      fetch("https://secure-earth-82827.herokuapp.com/people", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: fName,
          lastname: lName,
          email: email,
          department: department.replace(" Admin", ""),
        }),
      })
        .then((response) => response.json())
        .then((person) => {
          if (person.lastname) {
            loadAllUsers();
          } else if (person === "a user with this email already exists.") {
            toggleEShow();
          }
        });
      setFName("");
      setLName("");
      setEmail("");
    }
  };

  const activeChange = (e) => {
    fetch("https://secure-earth-82827.herokuapp.com/people", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: parseInt(e.target.parentNode.id, 10),
        isactive: e.target.checked,
      }),
    })
      .then((response) => response.json())
      .then((person) => {
        if (person) {
          loadAllUsers();
        }
      });
  };

  const deletePerson = () => {
    const personId = parseInt(id, 10);
    let email = "";
    for (let i = 0; i < peopleList.length; i++) {
      if (personId === peopleList[i].id) {
        email = peopleList[i].email;
        break;
      }
    }

    fetch("https://secure-earth-82827.herokuapp.com/people", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((response) => response.json())
      .then((people) => {
        if (people) {
          loadAllUsers();
        }
      })
      .catch((err) => console.log(err));

    toggleDShow();
  };

  const onFNameChange = (e) => {
    setFName(e.target.value);
  };

  const onLNameChange = (e) => {
    setLName(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const toggleDShow = (e) => {
    if (e) {
      setId(parseInt(e.target.parentNode.id, 10));
    } else {
      setId(-1);
    }
    setDShow(!dShow);
  };

  const toggleEShow = (e) => {
    setEshow(!eshow);
  };

  let docList = [];
  for (let j = 0; j < peopleList.length; j++) {
    docList.push(
      <li key={peopleList[j].id} id={peopleList[j].id}>
        {peopleList[j].lastname}, {peopleList[j].firstname}
        <input
          onChange={activeChange}
          checked={peopleList[j].isactive}
          key={j}
          className="inp"
          type="checkbox"
        />
        <Button
          key={-j - 1}
          onClick={toggleDShow}
          className="delete butn"
          size="sm"
          variant="danger"
        >
          Delete
        </Button>
      </li>
    );
  }

  return (
    <div className="body">
      <div className="left">
        <div className="top">
          <h4 className="subtitle">Staff List</h4>
        </div>
        <Scroll>
          <ul className="setList">{docList}</ul>
        </Scroll>
      </div>
      <div className="p right">
        <div className="top">
          <h4 className="subtitle">Add User</h4>
        </div>
        <Form id="callForm">
          <div id="box" style={{ border: "2px solid black", height: "180px" }}>
            <Form.Group id="name">
              <Form.Control
                required
                value={fName}
                type="text"
                onChange={onFNameChange}
                autoComplete="off"
                placeholder="First Name"
              />
            </Form.Group>
            <Form.Group id="name">
              <Form.Control
                required
                value={lName}
                type="text"
                onChange={onLNameChange}
                autoComplete="off"
                placeholder="Last Name"
              />
            </Form.Group>
            <Form.Group id="email">
              <Form.Control
                required
                value={email}
                type="email"
                onChange={onEmailChange}
                autoComplete="off"
                placeholder="Email"
              />
            </Form.Group>
          </div>
          <div className="bottom">
            <Button id="callSub" variant="primary" onClick={addPerson}>
              Submit
            </Button>
          </div>
        </Form>
      </div>
      <div className="modal">
        <Modal show={dShow} onHide={toggleDShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Group>
                <Form.Label>
                  Are you sure you want to delete this user?
                </Form.Label>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={toggleDShow} variant="secondary">
                Cancel
              </Button>
              <Button onClick={deletePerson} variant="primary">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
      <div className="modal">
        <Modal show={eshow} onHide={toggleEShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Error</Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Group>
                <Form.Label>
                  A user with this email address already exists.
                </Form.Label>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={toggleEShow} variant="secondary">
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default People;
