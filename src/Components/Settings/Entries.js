import React, { useState, useEffect, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Scroll from "./../Scroll/Scroll";
import Form from "react-bootstrap/Form";
import "./Settings.css";

const Entries = () => {
  const [entryList, setEntryList] = useState([]);
  const [entryName, setEntryName] = useState("");
  const [isactive, setIsActive] = useState(false);
  const [add, setAdd] = useState(true);
  const [id, setId] = useState(-1);

  const loadEntries = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/sked/entries")
      .then((res) => res.json())
      .then(setEntryList);
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const onNameChange = (e) => setEntryName(e.target.value);
  const onActiveChange = () => setIsActive((prev) => !prev);

  const onCancel = () => {
    setEntryName("");
    setIsActive(false);
    setAdd(true);
    setId(-1);
  };

  const addEntry = () => {
    if (entryName.length > 0) {
      fetch("https://secure-earth-82827.herokuapp.com/entries", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: entryName, active: isactive }),
      })
        .then((res) => res.json())
        .then((entry) => {
          if (entry) loadEntries();
        });
      onCancel();
    }
  };

  const editEntry = () => {
    if (entryName.length > 0) {
      fetch("https://secure-earth-82827.herokuapp.com/entries", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: entryName, active: isactive, id }),
      })
        .then((res) => res.json())
        .then((entry) => {
          if (entry) loadEntries();
        });

      onCancel();
    }
  };

  const addOrEdit = () => {
    if (add) {
      addEntry();
    } else {
      editEntry();
    }
  };

  const deleteCall = (e) => {
    const targetId = parseInt(e.target.parentNode.id, 10);
    fetch("https://secure-earth-82827.herokuapp.com/entries", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: targetId }),
    })
      .then((res) => res.json())
      .then((entries) => {
        if (entries) loadEntries();
      });

    onCancel();
  };

  const onEdit = (e) => {
    const targetId = parseInt(e.target.parentNode.id, 10);
    const match = entryList.find((entry) => entry.id === targetId);
    if (match) {
      setEntryName(match.name);
      setIsActive(match.isactive);
      setAdd(false);
      setId(targetId);
    }
  };

  return (
    <div className="body">
      <div className="left">
        <div className="top">
          <h4 className="subtitle">Entry List</h4>
        </div>
        <Scroll>
          <ol className="setList">
            {entryList.map((entry) => (
              <li key={entry.name} id={entry.id}>
                {entry.name}
                <Button
                  onClick={onEdit}
                  className="edit butn"
                  size="sm"
                  variant="secondary"
                >
                  Edit
                </Button>
                <Button
                  onClick={deleteCall}
                  className="delete butn"
                  size="sm"
                  variant="danger"
                >
                  Delete
                </Button>
              </li>
            ))}
          </ol>
        </Scroll>
      </div>
      <div className="ct right">
        <div className="top">
          <h4 className="subtitle">Add/Edit Calls</h4>
        </div>
        <Form id="callForm">
          <div id="box" style={{ border: "2px solid black", height: "125px" }}>
            <Form.Group id="name">
              <Form.Control
                required
                value={entryName}
                onChange={onNameChange}
                type="text"
                placeholder="Name"
              />
            </Form.Group>
            <Form.Group id="activeCheck" controlId="formBasicCheckbox">
              <Form.Check
                onChange={onActiveChange}
                checked={isactive}
                type="checkbox"
                label="Active"
              />
            </Form.Group>
          </div>
          <div className="bottom">
            <Button onClick={onCancel} id="callSub" variant="secondary">
              Cancel
            </Button>
            <Button id="callSub" variant="primary" onClick={addOrEdit}>
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Entries;
