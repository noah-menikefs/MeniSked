import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../store/slices/userSlice";
import {
  selectFilteredEntries,
  selectCallList,
} from "../../store/slices/referenceDataSlice";
import {
  selectMessages,
  selectMessageCounter,
  fetchEmployeeMessages,
  deleteMessage as deleteMessageAction,
  incrementCounter,
  resetCounter,
} from "../../store/slices/messageSlice";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { dateStyler, sortDates } from "../../utils";
import "./Messages.css";

const EMessages = () => {
  const dispatch = useDispatch();

  // Get data from Redux
  const user = useSelector(selectUser);
  const entryList = useSelector(selectFilteredEntries);
  const callList = useSelector(selectCallList);
  const messages = useSelector(selectMessages);
  const ctr = useSelector(selectMessageCounter);

  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  const deleteMessage = (id, deleted) => {
    dispatch(
      deleteMessageAction({
        id,
        deleted,
        user: "E",
      })
    ).then(() => {
      // Refresh messages after deletion
      dispatch(fetchEmployeeMessages(user.id));
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

  const showMore = () => dispatch(incrementCounter());

  useEffect(() => {
    if (user.id) {
      dispatch(resetCounter()); // Reset counter to 10 when component mounts
      dispatch(fetchEmployeeMessages(user.id));
    }
  }, [dispatch, user.id]);

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
