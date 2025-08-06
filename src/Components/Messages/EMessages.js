import React, { useState, useCallback, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import "./Messages.css";

const EMessages = ({ user }) => {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [entryList, setEntryList] = useState([]);
  const [callList, setCallList] = useState([]);
  const [ctr, setCtr] = useState(10);
  const months = moment.months();

  const loadMessages = useCallback(() => {
    fetch(`https://secure-earth-82827.herokuapp.com/emessages/${user.id}`)
      .then((res) => res.json())
      .then((msgs) =>
        setMessages(
          msgs.filter(
            (m) => (m.status !== "pending" || m.maybe) && m.deleted !== "E"
          )
        )
      );
  }, [user.id]);

  useEffect(() => {
    loadMessages();
    loadEntries();
    loadCallTypes();
  }, [loadMessages]);

  const loadEntries = () => {
    fetch("https://secure-earth-82827.herokuapp.com/sked/entries")
      .then((res) => res.json())
      .then(setEntryList);
  };

  const loadCallTypes = () => {
    fetch("https://secure-earth-82827.herokuapp.com/callTypes")
      .then((res) => res.json())
      .then(setCallList);
  };

  const toggleShow = (route) => {
    setShow((prev) => !prev);
    setMsg(route);
  };

  const showMore = () => setCtr((prev) => prev + 10);

  const showButton = (length) => {
    if (ctr < length) {
      return (
        <Button onClick={showMore} className="showMore" variant="primary">
          Show More
        </Button>
      );
    }
    return null;
  };

  const entryIdToName = (id) => {
    id = parseInt(id, 10);
    const arr = [...entryList, ...callList];
    const match = arr.find((e) => e.id === id);
    return match ? match.name : "";
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

  const deleteMessage = (id, deleted) => {
    fetch("https://secure-earth-82827.herokuapp.com/messages", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, deleted, user: "E" }),
    })
      .then((res) => res.json())
      .then((msg) => msg && loadMessages());
  };

  const sortedMessages = sortDates(messages);
  const msgList = sortedMessages.slice(0, ctr).map((m, j) => {
    const statusSpan = (
      <span className={m.status || "maybed"}>{m.status || "maybe"}</span>
    );
    const entryName = entryIdToName(m.entryid);
    const dateStr = dateStyler(m.dates);

    if (m.status === "accepted") {
      return (
        <ListGroup key={j} horizontal>
          <ListGroup.Item className="pend list" action disabled>
            Peter Menikefs {statusSpan} your request for {entryName} {dateStr}
          </ListGroup.Item>
          <ListGroup.Item className="edates list">{m.stamp}</ListGroup.Item>
          <ListGroup.Item>
            <Button
              onClick={() => deleteMessage(m.id, m.deleted)}
              className="deletemsg"
              size="sm"
              variant="danger"
            >
              Delete
            </Button>
          </ListGroup.Item>
        </ListGroup>
      );
    } else if (m.status === "denied") {
      return (
        <ListGroup key={j} horizontal>
          <ListGroup.Item
            className="pend list"
            action
            onClick={() => toggleShow(m.msg)}
          >
            Peter Menikefs {statusSpan} your request for {entryName} {dateStr}
          </ListGroup.Item>
          <ListGroup.Item className="edates list">{m.stamp}</ListGroup.Item>
          <ListGroup.Item>
            <Button
              onClick={() => deleteMessage(m.id, m.deleted)}
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
        <ListGroup key={j} horizontal>
          <ListGroup.Item
            className="pend list"
            action
            onClick={() => toggleShow(m.msg2)}
          >
            Peter Menikefs responded with <span className="maybed">maybe</span>{" "}
            to your request for {entryName} {dateStr}
          </ListGroup.Item>
          <ListGroup.Item className="edates list">{m.stamp2}</ListGroup.Item>
        </ListGroup>
      );
    }
  });

  return (
    <div>
      <div className="listStyleE">{msgList}</div>
      <div>{showButton(messages.length)}</div>
      <div className="modal">
        <Modal show={show} onHide={() => toggleShow("")}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">
              Denied Request Explanation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{msg}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => toggleShow("")} variant="secondary">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default EMessages;
