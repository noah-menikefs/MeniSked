import React, { useState, useCallback, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { dateStyler, sortDates } from "../../utils";
import "./Messages.css";

const EMessages = ({ user, entryList, callList }) => {
  const [messages, setMessages] = useState([]);
  const [ctr, setCtr] = useState(10);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  const loadMessages = useCallback(() => {
    fetch(`https://secure-earth-82827.herokuapp.com/emessages/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(
          data.filter(
            (m) => (m.status !== "pending" || m.maybe) && m.deleted !== "E"
          )
        );
      });
  }, [user.id]);

  const deleteMessage = (id, deleted) => {
    fetch("https://secure-earth-82827.herokuapp.com/messages", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, deleted, user: "E" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) loadMessages();
      });
  };

  const entryIdToName = useCallback(
    (id) => {
      id = parseInt(id, 10);
      const combined = [...entryList, ...callList];
      const match = combined.find((item) => item.id === id);
      return match?.name || "";
    },
    [entryList, callList]
  );

  const toggleShow = (msgText = "") => {
    setShow((prev) => !prev);
    setMsg(msgText);
  };

  const showMore = () => setCtr((prev) => prev + 10);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sortedMessages = sortDates(messages).slice(0, ctr);

  return (
    <div>
      <div className="listStyleE">
        {sortedMessages.map((m, i) => (
          <ListGroup key={i} horizontal>
            <ListGroup.Item
              className="pend list"
              action={m.status !== "accepted"}
              disabled={m.status === "accepted"}
              onClick={
                m.status === "accepted"
                  ? undefined
                  : () => toggleShow(m.msg || m.msg2)
              }
            >
              Peter Menikefs{" "}
              <span className={m.status === "maybe" ? "maybed" : m.status}>
                {m.status === "maybe" ? "responded with maybe" : m.status}
              </span>{" "}
              your request for {entryIdToName(m.entryid)} {dateStyler(m.dates)}
            </ListGroup.Item>
            <ListGroup.Item className="edates list">
              {m.status === "maybe" ? m.stamp2 : m.stamp}
            </ListGroup.Item>
            {m.status !== "maybe" && (
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
            )}
          </ListGroup>
        ))}
      </div>

      {ctr < messages.length && (
        <Button onClick={showMore} className="showMore" variant="primary">
          Show More
        </Button>
      )}

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
