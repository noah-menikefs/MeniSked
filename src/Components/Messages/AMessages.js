import React, { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import moment from "moment";
import "./Messages.css";

const AMessages = ({ today }) => {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [dshow, setDShow] = useState(false);
  const [mshow, setMShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [filteredMsgs, setFilteredMsgs] = useState([]);
  const [peopleList, setPeopleList] = useState([]);
  const [entryList, setEntryList] = useState([]);
  const [callList, setCallList] = useState([]);
  const [ctr, setCtr] = useState(10);
  const [id, setId] = useState(-1);

  const months = moment.months();

  useEffect(() => {
    loadMessages();
    loadUsers();
    loadEntries();
    loadCallTypes();
  }, []);

  const loadMessages = () => {
    fetch("https://secure-earth-82827.herokuapp.com/amessages")
      .then((response) => response.json())
      .then((msgs) => {
        const filtered = msgs.filter((message) => message.deleted !== "A");
        setMessages(filtered);
        setFilteredMsgs(filtered);
      });
  };

  const loadUsers = () => {
    fetch("https://secure-earth-82827.herokuapp.com/people")
      .then((response) => response.json())
      .then((users) => setPeopleList(users));
  };

  const loadEntries = () => {
    fetch("https://secure-earth-82827.herokuapp.com/sked/entries")
      .then((response) => response.json())
      .then((entries) => setEntryList(entries));
  };

  const loadCallTypes = () => {
    fetch("https://secure-earth-82827.herokuapp.com/callTypes")
      .then((response) => response.json())
      .then((calls) => setCallList(calls));
  };

  const respond = (reqId, status) => {
    fetch("https://secure-earth-82827.herokuapp.com/amessages", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: reqId,
        status,
        msg,
        stamp: today.format("MM/DD/YYYY"),
      }),
    })
      .then((response) => response.json())
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
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reqId }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.lastname) loadMessages();
      });
  };

  const maybeResponse = (id) => {
    fetch("https://secure-earth-82827.herokuapp.com/messages", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        msg2: msg, // from state
        stamp2: today.format("MM/DD/YYYY"), // passed as prop
      }),
    })
      .then((response) => response.json())
      .then((message) => {
        if (message) {
          loadMessages();
        }
      });

    setMsg(""); // reset msg
    setMShow(false); // close modal
    setId(-1); // reset selected message ID
  };

  const deleteMessage = (id, deleted) => {
    fetch("https://secure-earth-82827.herokuapp.com/messages", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        deleted,
        user: "A",
      }),
    })
      .then((response) => response.json())
      .then((message) => {
        if (message) {
          loadMessages();
        }
      });
  };

  const toggleShow = (newId = -1) => {
    setShow((prev) => !prev);
    setMsg("");
    setId(newId);
  };

  const toggleMShow = (newId = -1) => {
    setMShow((prev) => !prev);
    setMsg("");
    setId(newId);
  };

  const toggleDShow = (message = "") => {
    setDShow((prev) => !prev);
    setMsg(message);
  };

  const onMsgChange = (event) => {
    setMsg(event.target.value);
  };

  const docIdToName = (id) => {
    const parsedId = parseInt(id, 10);
    const person = peopleList.find((p) => p.id === parsedId);
    return person ? `${person.firstname} ${person.lastname}` : "";
  };

  const entryIdToName = (id) => {
    const parsedId = parseInt(id, 10);
    const combinedList = [...entryList, ...callList];
    const entry = combinedList.find((e) => e.id === parsedId);
    return entry ? entry.name : "";
  };

  const dateStyler = (dates) => {
    let splitArr = [];
    let flag = false;

    if (dates.length === 1) {
      const [month, day, year] = dates[0].split("/");
      return `on ${months[month - 1]} ${day}, ${year}`;
    }

    const paddedDates = dates.map((d) =>
      d.charAt(4) === "/" ? d.substring(0, 3) + "0" + d.substring(3) : d
    );

    paddedDates.sort((a, b) => a.substring(3, 5) - b.substring(3, 5));
    splitArr = paddedDates.map((d) => d.split("/"));

    for (let n = 1; n < splitArr.length; n++) {
      if (
        splitArr[n][0] !== splitArr[n - 1][0] ||
        splitArr[n][1] - 1 !== parseInt(splitArr[n - 1][1], 10) ||
        splitArr[n][2] !== splitArr[n - 1][2]
      ) {
        flag = true;
        break;
      }
    }

    if (flag) {
      return (
        "on " +
        splitArr.map((d) => `${months[d[0] - 1]} ${d[1]}, ${d[2]}`).join(", ")
      );
    }

    const first = splitArr[0];
    const last = splitArr[splitArr.length - 1];
    return `from ${months[first[0] - 1]} ${first[1]}, ${first[2]} - ${
      months[last[0] - 1]
    } ${last[1]}, ${last[2]}`;
  };

  const sortDates = (arr) => {
    const list = [...arr];
    return list.sort((a, b) => {
      const [am, ad, ay] = a.stamp.split("/").map(Number);
      const [bm, bd, by] = b.stamp.split("/").map(Number);
      return by - ay || bm - am || bd - ad;
    });
  };

  const showMore = () => {
    setCtr((prevCtr) => prevCtr + 10);
  };

  const showButton = (length) => {
    console.log(ctr, length);
    if (ctr < length) {
      return (
        <Button onClick={showMore} className="showMore" variant="primary">
          Show More
        </Button>
      );
    }
  };

  const onPhysicianChange = (event) => {
    const selectedName = event.target.value;
    if (selectedName !== "All") {
      const selectedDoc = peopleList.find(
        (person) => person.lastname === selectedName
      );
      filter(selectedDoc);
    } else {
      filter("All");
    }
  };

  const filter = (doc) => {
    if (doc === "All") {
      setFilteredMsgs(messages);
    } else {
      setFilteredMsgs(
        messages.filter((message) => parseInt(message.docid, 10) === doc.id)
      );
    }
  };

  const generatePendingList = () => {
    return sortDates(messages.filter((m) => m.status === "pending")).map(
      (msg, i) => (
        <ListGroup key={i} horizontal>
          <ListGroup.Item className="pend list" action>
            <p className="requestList">
              {docIdToName(msg.docid)} has requested{" "}
              {entryIdToName(msg.entryid)} {dateStyler(msg.dates)}
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
      )
    );
  };

  const generatePastList = () => {
    const past = filteredMsgs.filter((m) => m.status !== "pending" || m.maybe);

    const sortedPast = sortDates(past);
    const slicedPast = sortedPast.slice(0, ctr);

    const pastList = slicedPast.map((msg, i) => {
      if (msg.status === "accepted") {
        return (
          <ListGroup key={i} horizontal>
            <ListGroup.Item className="past list" action disabled>
              You <span className="accepted">accepted</span>{" "}
              {docIdToName(msg.docid)}'s request for{" "}
              {entryIdToName(msg.entryid)} {dateStyler(msg.dates)}
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
      } else if (msg.status === "denied") {
        return (
          <ListGroup key={i} horizontal>
            <ListGroup.Item
              className="past list"
              action
              onClick={() => toggleDShow(msg.msg)}
            >
              You <span className="denied">denied</span>{" "}
              {docIdToName(msg.docid)}'s request for{" "}
              {entryIdToName(msg.entryid)} {dateStyler(msg.dates)}
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
      } else {
        return (
          <ListGroup key={i} horizontal>
            <ListGroup.Item
              className="past list"
              action
              onClick={() => toggleDShow(msg.msg2)}
            >
              You responded with <span className="maybed">maybe</span> to{" "}
              {docIdToName(msg.docid)}'s request for{" "}
              {entryIdToName(msg.entryid)} {dateStyler(msg.dates)}
            </ListGroup.Item>
            <ListGroup.Item className="edates list">
              {msg.stamp2}
            </ListGroup.Item>
          </ListGroup>
        );
      }
    });

    return { pastList, pastLength: sortedPast.length };
  };

  const { pastList, pastLength } = generatePastList();

  const generateDocOptions = () => {
    return [
      <option key={-1} value="All">
        All
      </option>,
      ...peopleList.map((doc, i) => (
        <option key={i} value={doc.lastname}>
          {doc.lastname}
        </option>
      )),
    ];
  };

  return (
    <div>
      <h4 className="requests">Pending</h4>
      <div className="listStyleA">{generatePendingList()}</div>

      <div className="titleDropdown">
        <h4 className="past requests">Past Requests</h4>
        <span className="filter">
          <h5 className="filtertitle">Filter: </h5>
          <select onChange={onPhysicianChange} className="dropdownfilter">
            {generateDocOptions()}
          </select>
        </span>
      </div>

      <div className="listStyleE">{pastList}</div>
      <div>{showButton(pastLength)}</div>
      <Modal show={show} onHide={toggleShow}>
        <Modal.Header closeButton>
          <Modal.Title id="modalTitle">Denied Request Explanation</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control
                onChange={onMsgChange}
                as="textarea"
                rows="4"
                value={msg}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={toggleShow} variant="secondary">
              Close
            </Button>
            <Button onClick={() => respond(id, "denied")} variant="primary">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
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
      <Modal show={mshow} onHide={toggleMShow}>
        <Modal.Header closeButton>
          <Modal.Title id="modalTitle">Maybe Request Explanation</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Control
                onChange={onMsgChange}
                as="textarea"
                rows="4"
                value={msg}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={toggleMShow} variant="secondary">
              Close
            </Button>
            <Button onClick={() => maybeResponse(id)} variant="primary">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AMessages;
