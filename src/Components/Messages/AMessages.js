import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectFilteredEntries,
  selectPeopleList,
  selectCallList,
} from "../../store/slices/referenceDataSlice";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { dateStyler, sortDates } from "../../utils";
import "./Messages.css";

const AMessages = ({ today }) => {
  // Get data from Redux instead of props
  const entryList = useSelector(selectFilteredEntries);
  const peopleList = useSelector(selectPeopleList);
  const callList = useSelector(selectCallList);

  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [dshow, setDShow] = useState(false);
  const [mshow, setMShow] = useState(false);
  const [id, setId] = useState(-1);
  const [ctr, setCtr] = useState(10);

  const [messages, setMessages] = useState([]);
  const [filteredMsgs, setFilteredMsgs] = useState([]);

  // Loaders
  const loadMessages = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/amessages")
      .then((res) => res.json())
      .then((msgs) => {
        const filtered = msgs.filter((m) => m.deleted !== "A");
        setMessages(filtered);
        setFilteredMsgs(filtered);
      });
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Respond
  const respond = (reqId, status) => {
    fetch("https://secure-earth-82827.herokuapp.com/amessages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: reqId,
        status,
        msg,
        stamp: today.format("MM/DD/YYYY"),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) loadMessages();
      });

    if (status === "accepted") {
      accept(reqId);
    }

    setMsg("");
    setShow(false);
  };

  const accept = (reqId) => {
    fetch("https://secure-earth-82827.herokuapp.com/arequest", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reqId }),
    })
      .then((res) => res.json())
      .then((user) => {
        if (user.lastname) loadMessages();
      });
  };

  const deleteMessage = useCallback(
    (id, deleted) => {
      fetch("https://secure-earth-82827.herokuapp.com/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          deleted,
          user: "A",
        }),
      })
        .then((res) => res.json())
        .then((message) => {
          if (message) {
            loadMessages();
          }
        });
    },
    [loadMessages]
  );

  const maybeResponse = useCallback(
    (id) => {
      fetch("https://secure-earth-82827.herokuapp.com/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          msg2: msg,
          stamp2: today.format("MM/DD/YYYY"),
        }),
      })
        .then((res) => res.json())
        .then((message) => {
          if (message) {
            loadMessages();
          }
        });

      setMsg("");
      setMShow(false);
      setId(-1);
    },
    [msg, today, loadMessages]
  );

  // Toggle Modals
  const toggleShow = (reqId = -1) => {
    setShow((prev) => !prev);
    setMsg("");
    setId(reqId);
  };

  const toggleMShow = (reqId = -1) => {
    setMShow((prev) => !prev);
    setMsg("");
    setId(reqId);
  };

  const toggleDShow = (text = "") => {
    setDShow((prev) => !prev);
    setMsg(text);
  };

  // Message input handler
  const onMsgChange = (e) => setMsg(e.target.value);

  const docIdToName = useCallback(
    (id) => {
      id = parseInt(id, 10);
      const doc = peopleList.find((p) => p.id === id);
      return doc ? `${doc.firstname} ${doc.lastname}` : "";
    },
    [peopleList]
  );

  const entryIdToName = useCallback(
    (id) => {
      id = parseInt(id, 10);
      const combined = [...entryList, ...callList];
      const match = combined.find((item) => item.id === id);
      return match?.name || "";
    },
    [entryList, callList]
  );

  const showMore = () => setCtr((prev) => prev + 10);

  const filter = useCallback(
    (doc) => {
      if (doc === "All") {
        setFilteredMsgs(messages);
      } else {
        setFilteredMsgs(
          messages.filter((m) => parseInt(m.docid, 10) === doc.id)
        );
      }
    },
    [messages]
  );

  const onPhysicianChange = (event) => {
    const selected = event.target.value;
    if (selected !== "All") {
      const match = peopleList.find((p) => p.lastname === selected);
      if (match) filter(match);
    } else {
      filter("All");
    }
  };

  const pends = useMemo(
    () => sortDates(messages.filter((m) => m.status === "pending")),
    [messages]
  );
  const past = useMemo(
    () =>
      sortDates(filteredMsgs.filter((m) => m.status !== "pending" || m.maybe)),
    [filteredMsgs]
  );

  const pendingList = pends.map((msg, index) => (
    <ListGroup key={index} horizontal>
      <ListGroup.Item className="pend list" action>
        <p className="requestList">
          {docIdToName(msg.docid)} has requested {entryIdToName(msg.entryid)}{" "}
          {dateStyler(msg.dates)}
        </p>
        <Button
          onClick={() => respond(msg.id, "accepted")}
          className="accept"
          size="sm"
          variant="success"
        >
          Accept
        </Button>
        <Button
          onClick={() => toggleShow(msg.id)}
          className="deny"
          size="sm"
          variant="danger"
        >
          Deny
        </Button>
        {!msg.maybe && (
          <Button
            onClick={() => toggleMShow(msg.id)}
            className="mby"
            size="sm"
            variant="warning"
          >
            Maybe
          </Button>
        )}
      </ListGroup.Item>
      <ListGroup.Item className="dates list">{msg.stamp}</ListGroup.Item>
    </ListGroup>
  ));

  const pastList = past.slice(0, ctr).map((msg, index) => {
    const docName = docIdToName(msg.docid);
    const entryName = entryIdToName(msg.entryid);
    const dateText = dateStyler(msg.dates);

    if (msg.status === "accepted") {
      return (
        <ListGroup key={index} horizontal>
          <ListGroup.Item className="past list" action disabled>
            You <span className="accepted">accepted</span> {docName}'s request
            for {entryName} {dateText}
          </ListGroup.Item>
          <ListGroup.Item className="edates list">{msg.stamp}</ListGroup.Item>
          <ListGroup.Item>
            <Button
              onClick={() => deleteMessage(msg.id, msg.deleted)}
              className="deletemsg"
              size="sm"
              variant="danger"
            >
              Delete
            </Button>
          </ListGroup.Item>
        </ListGroup>
      );
    }

    if (msg.status === "denied") {
      return (
        <ListGroup key={index} horizontal>
          <ListGroup.Item
            className="past list"
            action
            onClick={() => toggleDShow(msg.msg)}
          >
            You <span className="denied">denied</span> {docName}'s request for{" "}
            {entryName} {dateText}
          </ListGroup.Item>
          <ListGroup.Item className="edates list">{msg.stamp}</ListGroup.Item>
          <ListGroup.Item>
            <Button
              onClick={() => deleteMessage(msg.id, msg.deleted)}
              className="deletemsg"
              size="sm"
              variant="danger"
            >
              Delete
            </Button>
          </ListGroup.Item>
        </ListGroup>
      );
    }

    return (
      <ListGroup key={index} horizontal>
        <ListGroup.Item
          className="past list"
          action
          onClick={() => toggleDShow(msg.msg2)}
        >
          You responded with <span className="maybed">maybe</span> to {docName}
          's request for {entryName} {dateText}
        </ListGroup.Item>
        <ListGroup.Item className="edates list">{msg.stamp2}</ListGroup.Item>
      </ListGroup>
    );
  });

  const docSelect = [
    <option key={-1} value="All">
      All
    </option>,
    ...peopleList.map((doc, i) => (
      <option key={i} value={doc.lastname}>
        {doc.lastname}
      </option>
    )),
  ];

  return (
    <div>
      <h4 className="requests">Pending</h4>
      <div className="listStyleA">{pendingList}</div>

      <div className="titleDropdown">
        <h4 className="past requests">Past Requests</h4>
        <span className="filter">
          <h5 className="filtertitle">Filter: </h5>
          <select onChange={onPhysicianChange} className="dropdownfilter">
            {docSelect}
          </select>
        </span>
      </div>

      <div className="listStyleE">{pastList}</div>

      {past.length > ctr && (
        <div>
          <Button onClick={showMore} className="showMore" variant="primary">
            Show More
          </Button>
        </div>
      )}

      {/* Denied Request Modal */}
      <div className="modal">
        <Modal show={show} onHide={() => toggleShow()}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">
              Denied Request Explanation
            </Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control
                  value={msg}
                  onChange={onMsgChange}
                  as="textarea"
                  rows="4"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => toggleShow()} variant="secondary">
                Close
              </Button>
              <Button onClick={() => respond(id, "denied")} variant="primary">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>

      {/* Denied / Maybe Explanation Modal */}
      <div className="modal">
        <Modal show={dshow} onHide={() => toggleDShow("")}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">
              Maybe/Denied Request Explanation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{msg}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => toggleDShow("")} variant="secondary">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* Maybe Response Modal */}
      <div className="modal">
        <Modal show={mshow} onHide={() => toggleMShow()}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Maybe Request Explanation</Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Control
                  value={msg}
                  onChange={onMsgChange}
                  as="textarea"
                  rows="4"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => toggleMShow()} variant="secondary">
                Close
              </Button>
              <Button onClick={() => maybeResponse(id)} variant="primary">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AMessages;
