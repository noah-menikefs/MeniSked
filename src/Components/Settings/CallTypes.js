import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCallList,
  addCallType,
  updateCallType,
  deleteCallType,
  fetchReferenceData,
} from "../../store/slices/referenceDataSlice";
import Button from "react-bootstrap/Button";
import Scroll from "./../Scroll/Scroll";
import Form from "react-bootstrap/Form";
import "./Settings.css";

const CallTypes = () => {
  const dispatch = useDispatch();

  // Get callList from Redux instead of local state
  const callList = useSelector(selectCallList);

  const [callName, setCallName] = useState("");
  const [priority, setPriority] = useState(1);
  const [isactive, setIsactive] = useState(false);
  const [add, setAdd] = useState(true);
  const [id, setId] = useState(-1);

  // No need for useEffect - data comes from Redux

  const addOrEdit = () => {
    if (add) {
      addCall();
    } else {
      editCall();
    }
  };

  const addCall = () => {
    if (callName.length > 0) {
      dispatch(
        addCallType({
          name: callName,
          active: isactive,
          priority: priority,
        })
      ).then(() => {
        // Refresh reference data after adding
        dispatch(fetchReferenceData());
      });
      setCallName("");
      setPriority(1);
      setIsactive(false);
    }
  };

  const deleteCall = (callId) => {
    dispatch(deleteCallType(callId)).then(() => {
      // Refresh reference data after deleting
      dispatch(fetchReferenceData());
    });
  };

  const editCall = () => {
    if (callName.length > 0) {
      dispatch(
        updateCallType({
          id: parseInt(id, 10),
          name: callName,
          active: isactive,
          priority: priority,
        })
      ).then(() => {
        // Refresh reference data after updating
        dispatch(fetchReferenceData());
      });
      setCallName("");
      setPriority(1);
      setIsactive(false);
      setAdd(true);
      setId(-1);
    }
  };

  const onPriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const onNameChange = (e) => {
    setCallName(e.target.value);
  };

  const onActiveChange = () => {
    setIsactive((prev) => !prev);
  };

  const onEdit = (callId) => {
    const call = callList.find((c) => c.id === callId);
    if (call) {
      setCallName(call.name);
      setPriority(call.priority);
      setIsactive(call.isactive);
      setAdd(false);
      setId(callId);
    }
  };

  const onCancel = () => {
    setCallName("");
    setPriority(1);
    setIsactive(false);
    setAdd(true);
    setId(-1);
  };

  let priorityList = [];
  for (let j = 0; j < callList.length; j++) {
    priorityList.push(
      <li key={callList[j].name} id={callList[j].id}>
        {callList[j].name}
        <Button
          key={j}
          onClick={() => onEdit(callList[j].id)}
          className="edit butn"
          size="sm"
          variant="secondary"
        >
          Edit
        </Button>
        <Button
          key={-j - 1}
          onClick={() => deleteCall(callList[j].id)}
          className="delete butn"
          size="sm"
          variant="danger"
        >
          Delete
        </Button>
      </li>
    );
  }

  let prioritySelect = [];
  let max = 1;
  if (!add) {
    max = 0;
  }
  for (let n = 1; n <= callList.length + max; n++) {
    prioritySelect.push(
      <option value={n} key={n}>
        {n}
      </option>
    );
  }

  return (
    <div className="body">
      <div className="left">
        <div className="top">
          <h4 className="subtitle">Priority List</h4>
        </div>
        <Scroll>
          <ol className="setList">{priorityList}</ol>
        </Scroll>
      </div>
      <div className="ct right">
        <div className="top">
          <h4 className="subtitle">Add/Edit Calls</h4>
        </div>
        <Form id="callForm">
          <div id="box" style={{ border: "2px solid black", height: "200px" }}>
            <Form.Group id="name">
              <Form.Control
                required
                value={callName}
                onChange={onNameChange}
                type="text"
                placeholder="Name"
              />
            </Form.Group>
            <Form.Group id="priority" controlId="exampleForm.ControlSelect1">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                onChange={onPriorityChange}
                value={priority}
                as="select"
              >
                {prioritySelect}
              </Form.Control>
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

export default CallTypes;
