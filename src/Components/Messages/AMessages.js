import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { dateStyler, sortDates } from "../../utils";
import "./Messages.css";

class AMessages extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false,
      msg: "",
      dshow: false,
      messages: [],
      filteredMsgs: [],
      peopleList: [],
      entryList: [],
      callList: [],
      ctr: 10,
      id: -1,
      mshow: false,
    };
  }

  componentDidMount = () => {
    this.loadMessages();
    this.loadUsers();
    this.loadEntries();
    this.loadCallTypes();
  };

  loadMessages = () => {
    fetch("https://secure-earth-82827.herokuapp.com/amessages")
      .then((response) => response.json())
      .then((messages) =>
        this.setState({
          messages: messages.filter((message) => message.deleted !== "A"),
          filteredMsgs: messages.filter((message) => message.deleted !== "A"),
        })
      );
  };

  loadUsers = () => {
    fetch("https://secure-earth-82827.herokuapp.com/people")
      .then((response) => response.json())
      .then((users) => this.setState({ peopleList: users }));
  };

  loadEntries = () => {
    fetch("https://secure-earth-82827.herokuapp.com/sked/entries")
      .then((response) => response.json())
      .then((entries) => this.setState({ entryList: entries }));
  };

  loadCallTypes = () => {
    fetch("https://secure-earth-82827.herokuapp.com/callTypes")
      .then((response) => response.json())
      .then((calls) => this.setState({ callList: calls }));
  };

  respond = (id, status) => {
    fetch("https://secure-earth-82827.herokuapp.com/amessages", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        status: status,
        msg: this.state.msg,
        stamp: this.props.today.format("MM/DD/YYYY"),
      }),
    })
      .then((response) => response.json())
      .then((message) => {
        if (message) {
          this.loadMessages();
        }
      });
    if (status === "accepted") {
      this.accept(id);
    }
    this.setState({
      msg: "",
      show: false,
    });
  };

  accept = (id) => {
    fetch("https://secure-earth-82827.herokuapp.com/arequest", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((user) => {
        if (user.lastname) {
          this.loadMessages();
        }
      });
  };

  toggleShow = (id = -1) => {
    this.setState({
      show: !this.state.show,
      msg: "",
      id: id,
    });
  };

  toggleMShow = (id = -1) => {
    this.setState({
      mshow: !this.state.mshow,
      msg: "",
      id: id,
    });
  };

  toggleDShow = (route) => {
    this.setState({
      dshow: !this.state.dshow,
      msg: route,
    });
  };

  onMsgChange = (event) => {
    this.setState({ msg: event.target.value });
  };

  docIdToName = (id) => {
    const { peopleList } = this.state;
    id = parseInt(id, 10);
    for (let i = 0; i < peopleList.length; i++) {
      if (id === peopleList[i].id) {
        return peopleList[i].firstname + " " + peopleList[i].lastname;
      }
    }
  };

  entryIdToName = (id) => {
    id = parseInt(id, 10);
    const arr = [...this.state.entryList, ...this.state.callList];
    for (let i = 0; i < arr.length; i++) {
      if (id === arr[i].id) {
        return arr[i].name;
      }
    }
  };

  showMore = () => {
    this.setState({ ctr: this.state.ctr + 10 });
  };

  showButton = (length) => {
    if (this.state.ctr < length) {
      return (
        <Button onClick={this.showMore} className="showMore" variant="primary">
          Show More
        </Button>
      );
    }
  };

  onPhysicianChange = (event) => {
    const { peopleList } = this.state;
    if (event.target.value !== "All") {
      let index = -1;
      for (let i = 0; i < peopleList.length; i++) {
        if (peopleList[i].lastname === event.target.value) {
          index = i;
          break;
        }
      }
      this.filter(peopleList[index]);
    } else {
      this.filter("All");
    }
  };

  filter = (doc) => {
    const { messages } = this.state;
    if (doc === "All") {
      this.setState({ filteredMsgs: messages });
    } else {
      this.setState({
        filteredMsgs: messages.filter(
          (message) => parseInt(message.docid, 10) === doc.id
        ),
      });
    }
  };

  deleteMessage = (id, deleted) => {
    fetch("https://secure-earth-82827.herokuapp.com/messages", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        deleted: deleted,
        user: "A",
      }),
    })
      .then((response) => response.json())
      .then((message) => {
        if (message) {
          this.loadMessages();
        }
      });
  };

  maybeResponse = (id) => {
    fetch("https://secure-earth-82827.herokuapp.com/messages", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        msg2: this.state.msg,
        stamp2: this.props.today.format("MM/DD/YYYY"),
      }),
    })
      .then((response) => response.json())
      .then((message) => {
        if (message) {
          this.loadMessages();
        }
      });
    this.setState({
      msg: "",
      mshow: false,
      id: -1,
    });
  };

  render() {
    const { show, dshow, msg, messages, ctr, peopleList, filteredMsgs, mshow } =
      this.state;
    let pendingList = [];
    let pastList = [];
    let pends = [];
    let past = [];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].status === "pending") {
        pends.push(messages[i]);
      }
    }
    for (let i = 0; i < filteredMsgs.length; i++) {
      if (filteredMsgs[i].status !== "pending" || filteredMsgs[i].maybe) {
        past.push(filteredMsgs[i]);
      }
    }

    pends = sortDates(pends);
    past = sortDates(past);

    for (let n = 0; n < pends.length; n++) {
      if (!pends[n].maybe) {
        pendingList.push(
          <ListGroup key={n} horizontal>
            <ListGroup.Item className="pend list" action>
              <p className="requestList">
                {this.docIdToName(pends[n].docid)} has requested{" "}
                {this.entryIdToName(pends[n].entryid)}{" "}
                {dateStyler(pends[n].dates)}
              </p>
              <Button
                onClick={() => this.respond(pends[n].id, "accepted")}
                className="accept"
                size="sm"
                variant="success"
              >
                Accept
              </Button>
              <Button
                onClick={() => this.toggleShow(pends[n].id)}
                className="deny"
                size="sm"
                variant="danger"
              >
                Deny
              </Button>
              <Button
                onClick={() => this.toggleMShow(pends[n].id)}
                className="mby"
                size="sm"
                variant="warning"
              >
                Maybe
              </Button>
            </ListGroup.Item>
            <ListGroup.Item className="dates list">
              {pends[n].stamp}
            </ListGroup.Item>
          </ListGroup>
        );
      } else {
        pendingList.push(
          <ListGroup key={n} horizontal>
            <ListGroup.Item className="pend list" action>
              <p className="requestList">
                {this.docIdToName(pends[n].docid)} has requested{" "}
                {this.entryIdToName(pends[n].entryid)}{" "}
                {dateStyler(pends[n].dates)}
              </p>
              <Button
                onClick={() => this.respond(pends[n].id, "accepted")}
                className="accept"
                size="sm"
                variant="success"
              >
                Accept
              </Button>
              <Button
                onClick={() => this.toggleShow(pends[n].id)}
                className="deny"
                size="sm"
                variant="danger"
              >
                Deny
              </Button>
            </ListGroup.Item>
            <ListGroup.Item className="dates list">
              {pends[n].stamp}
            </ListGroup.Item>
          </ListGroup>
        );
      }
    }

    for (let j = 0; j < Math.min(past.length, ctr); j++) {
      if (past[j].status === "accepted") {
        pastList.push(
          <ListGroup key={j} horizontal>
            <ListGroup.Item className="past list" action disabled>
              You <span className="accepted">accepted</span>{" "}
              {this.docIdToName(past[j].docid)}'s request for{" "}
              {this.entryIdToName(past[j].entryid)} {dateStyler(past[j].dates)}
            </ListGroup.Item>
            <ListGroup.Item className="edates list">
              {past[j].stamp}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                onClick={() => this.deleteMessage(past[j].id, past[j].deleted)}
                className="deletemsg"
                size="sm"
                variant="danger"
              >
                Delete
              </Button>
            </ListGroup.Item>
          </ListGroup>
        );
      } else if (past[j].status === "denied") {
        pastList.push(
          <ListGroup key={j} horizontal>
            <ListGroup.Item
              className="past list"
              action
              onClick={() => this.toggleDShow(past[j].msg)}
            >
              You <span className="denied">denied</span>{" "}
              {this.docIdToName(past[j].docid)}'s request for{" "}
              {this.entryIdToName(past[j].entryid)} {dateStyler(past[j].dates)}
            </ListGroup.Item>
            <ListGroup.Item className="edates list">
              {past[j].stamp}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                onClick={() => this.deleteMessage(past[j].id, past[j].deleted)}
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
        pastList.push(
          <ListGroup key={j} horizontal>
            <ListGroup.Item
              className="past list"
              action
              onClick={() => this.toggleDShow(past[j].msg2)}
            >
              You responded with <span className="maybed">maybe</span> to{" "}
              {this.docIdToName(past[j].docid)}'s request for{" "}
              {this.entryIdToName(past[j].entryid)} {dateStyler(past[j].dates)}
            </ListGroup.Item>
            <ListGroup.Item className="edates list">
              {past[j].stamp2}
            </ListGroup.Item>
          </ListGroup>
        );
      }
    }

    let docSelect = peopleList.map((doc, i) => {
      return (
        <option key={i} value={doc.lastname}>
          {doc.lastname}
        </option>
      );
    });

    docSelect.unshift(
      <option key={-1} value="All">
        All
      </option>
    );

    return (
      <div>
        <h4 className="requests">Pending</h4>
        <div className="listStyleA">{pendingList}</div>
        <div className="titleDropdown">
          <h4 className="past requests">Past Requests</h4>
          <span className="filter">
            <h5 className="filtertitle">Filter: </h5>
            <select
              onChange={this.onPhysicianChange}
              className="dropdownfilter"
            >
              {docSelect}
            </select>
          </span>
        </div>
        <div className="listStyleE">{pastList}</div>
        <div>{this.showButton(past.length)}</div>
        <div className="modal">
          <Modal show={show} onHide={this.toggleShow}>
            <Modal.Header closeButton>
              <Modal.Title id="modalTitle">
                Denied Request Explanation
              </Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Control
                    onChange={this.onMsgChange}
                    as="textarea"
                    rows="4"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.toggleShow} variant="secondary">
                  Close
                </Button>
                <Button
                  onClick={() => this.respond(this.state.id, "denied")}
                  variant="primary"
                >
                  Submit
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </div>
        <div className="modal">
          <Modal show={dshow} onHide={() => this.toggleDShow("")}>
            <Modal.Header closeButton>
              <Modal.Title id="modalTitle">
                Maybe/Denied Request Explanation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>{msg}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => this.toggleDShow("")} variant="secondary">
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div className="modal">
          <Modal show={mshow} onHide={this.toggleMShow}>
            <Modal.Header closeButton>
              <Modal.Title id="modalTitle">
                Maybe Request Explanation
              </Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Control
                    onChange={this.onMsgChange}
                    as="textarea"
                    rows="4"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.toggleMShow} variant="secondary">
                  Close
                </Button>
                <Button
                  onClick={() => this.maybeResponse(this.state.id)}
                  variant="primary"
                >
                  Submit
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

export default AMessages;
