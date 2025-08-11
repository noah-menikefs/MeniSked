import React, { useState, useEffect, useCallback, useMemo } from "react";
import Calendar from "./Calendar/Calendar";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyDocument from "./../PDF/MyDocument";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { PDFDownloadLink } from "@react-pdf/renderer";
import moment from "moment";

import "./Schedules.css";

const style = {
  position: "relative",
  margin: "10px auto",
  width: "90%",
};

const PubSchedule = (props) => {
  const [show, setShow] = useState(false);
  const [nShow, setNShow] = useState(false);
  const [dateContext, setDateContext] = useState(moment());
  const [note, setNote] = useState("");
  const [radio, setRadio] = useState(0);
  const [holiDays, setHoliDays] = useState([]);
  const [render, setRender] = useState(false);
  const [day, setDay] = useState(-1);
  const [published, setPublished] = useState(-1);
  const [stamp, setStamp] = useState(moment().format("YYYY-MM-DD HH:mm"));
  const [msg, setMsg] = useState("");
  const [id, setId] = useState(-1);
  const [allNotes, setAllNotes] = useState({
    numNotes: [],
    vNotes: [],
    iNotes: [],
  });

  const months = moment.months(); // List of each month

  const { numNotes, vNotes, iNotes } = allNotes;

  // Extract shared data from props
  const {
    today,
    user,
    callList,
    nrHolidayList,
    depts,
    processHolidaysForDate,
    peopleList,
    entryList,
  } = props;

  const priorityCheck = useCallback(
    (id) => {
      for (let n = 0; n < callList.length; n++) {
        if (callList[n].id === id) {
          return callList[n].priority;
        }
      }
      return 1000;
    },
    [callList]
  );

  // NEW: Shared data processing
  const sked = useMemo(() => {
    let allSked = [];
    peopleList.forEach((person) => {
      person.worksked.forEach((work) => {
        allSked.push({
          id: work.id,
          date: work.date,
          name: person.lastname,
          colour: person.colour,
          priority: priorityCheck(work.id),
        });
      });
    });
    allSked.sort((a, b) => a.priority - b.priority);
    return allSked;
  }, [peopleList, priorityCheck]);

  const loadAllNotes = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/sked/allNotes")
      .then((response) => response.json())
      .then((notes) => {
        setAllNotes({
          numNotes: notes.filter((note) => note.type === 1),
          vNotes: notes.filter((note) => note.type === 2),
          iNotes: notes.filter((note) => note.type === 3),
        });
      });
  }, []);

  const loadPublished = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/published")
      .then((response) => response.json())
      .then((num) => setPublished(num));
  }, []);

  const publishSked = () => {
    var a = moment([2020, 5, 1]);
    var b = dateContext;
    const num = b.diff(a, "months");
    fetch("https://secure-earth-82827.herokuapp.com/published", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newNum: num,
      }),
    })
      .then((response) => response.json())
      .then((num) => setPublished(num));
  };

  const loadNewDays = useCallback(
    (dateContext) => {
      const newArr = processHolidaysForDate(dateContext);
      setHoliDays(newArr);
      setRender(true);
    },
    [processHolidaysForDate]
  );

  useEffect(() => {
    loadPublished();
    loadAllNotes();
  }, [loadPublished, loadAllNotes]);

  useEffect(() => {
    if (nrHolidayList.length > 0 && !render) {
      loadNewDays(today);
    }
  }, [nrHolidayList.length, render, today, loadNewDays]);

  const onDayClick = (e, day) => {
    let newDateContext = moment(dateContext).set("date", day);
    setDateContext(newDateContext);
    setDay(day);
    toggleShow(day);
  };

  const toggleShow = () => {
    setShow(!show);
  };

  const setMonth = (month) => {
    let monthNo = months.indexOf(month);
    let newDateContext = moment(dateContext).set("month", monthNo);
    setDateContext(newDateContext);
    loadNewDays(newDateContext);
  };

  const nextMonth = () => {
    let newDateContext = moment(dateContext).add(1, "month");
    if (!user.isadmin) {
      let nMonth = moment([2020, 5, 1]).add(published, "month").month();
      let nYear = moment([2020, 5, 1]).add(published, "month").year();
      if (newDateContext.year() < nYear) {
        setDateContext(newDateContext);
        loadNewDays(newDateContext);
      } else if (newDateContext.year() === nYear) {
        if (newDateContext.month() <= nMonth) {
          setDateContext(newDateContext);
          loadNewDays(newDateContext);
        }
      }
    } else if (newDateContext.year() <= today.year() + 10) {
      setDateContext(newDateContext);
      loadNewDays(newDateContext);
    }
  };

  const prevMonth = () => {
    let newDateContext = moment(dateContext).subtract(1, "month");
    if (newDateContext.year() >= 2020) {
      setDateContext(newDateContext);
      loadNewDays(newDateContext);
    }
  };

  const nextYear = () => {
    if (!user.isadmin) {
      let nYear = moment([2020, 5, 1]).add(published, "month").year();
      if (dateContext.year() + 1 <= nYear) {
        let newDateContext = moment(dateContext).add(1, "year");
        setDateContext(newDateContext);
        loadNewDays(newDateContext);
      }
    } else if (dateContext.year() + 1 <= today.year() + 10) {
      let newDateContext = moment(dateContext).add(1, "year");
      setDateContext(newDateContext);
      loadNewDays(newDateContext);
    }
  };

  const prevYear = () => {
    if (dateContext.year() - 1 >= 2020) {
      let newDateContext = moment(dateContext).subtract(1, "year");
      setDateContext(newDateContext);
      loadNewDays(newDateContext);
    }
  };

  const setYear = (year) => {
    let newDateContext = moment(dateContext).set("year", year);
    if (!user.isadmin) {
      let nMonth = moment([2020, 5, 1]).add(published, "month").month();
      let nYear = moment([2020, 5, 1]).add(published, "month").year();
      if (newDateContext.year() === nYear && nMonth < newDateContext.month()) {
        newDateContext = moment(newDateContext).set("month", nMonth);
      }
    }
    setDateContext(newDateContext);
    loadNewDays(newDateContext);
  };

  const onMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const onYearChange = (event) => {
    setYear(event.target.value);
  };

  const noteRadioChange = (event) => {
    setRadio(event.target.id);
  };

  const onNotesSubmit = () => {
    if (note.length > 0 && radio > 0) {
      fetch("https://secure-earth-82827.herokuapp.com/sked/notes", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date:
            dateContext.format("MM") +
            "/" +
            day +
            "/" +
            dateContext.format("Y"),
          type: parseInt(radio, 10),
          msg: note,
        }),
      })
        .then((response) => response.json())
        .then((notes) => {
          if (notes.id) {
            loadAllNotes();
          }
        });
      setRadio(0);
      setNote("");
      toggleShow();
    }
  };

  const onNoteChange = (event) => {
    setNote(event.target.value);
  };

  const reset = () => {
    setDateContext(today);
    loadNewDays(today);
  };

  const yearSelect = () => {
    let arr = [];
    let fYear = today.year();
    if (user.isadmin) {
      for (let i = 2020; i <= fYear + 10; i++) {
        arr.push(
          <option key={i} value={i}>
            {i}
          </option>
        );
      }
    } else {
      let nYear = moment([2020, 5, 1]).add(published, "month").year();
      for (let i = 2020; i <= nYear; i++) {
        arr.push(
          <option key={i} value={i}>
            {i}
          </option>
        );
      }
    }
    return arr;
  };

  const monthSelect = () => {
    let m = 11;
    let arr = [];
    if (!user.isadmin) {
      let nYear = moment([2020, 5, 1]).add(published, "month").year();
      let nMonth = moment([2020, 5, 1]).add(published, "month").month();
      if (dateContext.year() === nYear) {
        m = nMonth;
      }
    }
    for (let i = 0; i <= m; i++) {
      arr.push(
        <option key={i} value={months[i]}>
          {months[i]}
        </option>
      );
    }
    return arr;
  };

  const publishShow = () => {
    if (user.isadmin) {
      let nYear = moment([2020, 5, 1]).add(published, "month").year();
      let nMonth = moment([2020, 5, 1]).add(published, "month").month();
      let p = true;
      if (dateContext.year() === nYear) {
        if (dateContext.month() > nMonth) {
          p = false;
        }
      } else if (dateContext.year() > nYear) {
        p = false;
      }
      if (p) {
        return (
          <Col>
            <h5>Published</h5>
          </Col>
        );
      }
      return (
        <Col>
          <Button onClick={publishSked} className="top-child" variant="primary">
            Publish
          </Button>
        </Col>
      );
    } else {
      return (
        <Col>
          <p></p>
        </Col>
      );
    }
  };

  const adminNotes = () => {
    if (user.isadmin) {
      return (
        <Form>
          <hr />
          <Form.Group>
            <Form.Control
              onChange={onNoteChange}
              id="note-text"
              size="sm"
              type="text"
              placeholder="Add Note"
            />
          </Form.Group>
          <Form.Label id="typeON">Type of Note:</Form.Label>
          <Form.Group onChange={noteRadioChange}>
            <Form.Check
              name="noteType"
              inline
              label="Numbers"
              type="radio"
              id="1"
            />
            <Form.Check
              inline
              name="noteType"
              label="Visible"
              type="radio"
              id="2"
            />
            <Form.Check
              inline
              name="noteType"
              label="Invisible"
              type="radio"
              id="3"
            />
          </Form.Group>
          <Form.Group>
            <Button onClick={onNotesSubmit} size="sm" variant="primary">
              Submit Note
            </Button>
          </Form.Group>
        </Form>
      );
    }
  };

  const idToName = (id) => {
    for (let n = 0; n < callList.length; n++) {
      if (callList[n].id === id) {
        return callList[n].name;
      }
    }
    for (let i = 0; i < entryList.length; i++) {
      if (entryList[i].id === id) {
        return entryList[i].name;
      }
    }
  };

  const hoverSpan = () => {
    setStamp(moment().format("YYYY-MM-DD HH:mm"));
  };

  const adminDownload = () => {
    if (user.isadmin) {
      let userCopy = { ...user };
      userCopy.isadmin = false;

      return (
        <Row>
          <Col id="downloadLink">
            <PDFDownloadLink
              document={
                <MyDocument
                  colour={false}
                  stamp={stamp}
                  depts={depts}
                  numNotes={numNotes}
                  vNotes={vNotes}
                  iNotes={iNotes}
                  holiDays={holiDays}
                  callList={callList}
                  entries={entryList}
                  sked={sked}
                  type="Published"
                  dateContext={dateContext}
                  user={userCopy}
                />
              }
              fileName={
                dateContext.format("MMMM") +
                dateContext.format("Y") +
                "publishedsked.pdf"
              }
            >
              {({ loading }) =>
                loading ? (
                  "Loading document..."
                ) : (
                  <span onMouseOver={hoverSpan}>
                    Employee Black & White Download
                  </span>
                )
              }
            </PDFDownloadLink>
          </Col>
          <Col id="downloadLink">
            <PDFDownloadLink
              document={
                <MyDocument
                  colour={true}
                  stamp={stamp}
                  depts={depts}
                  numNotes={numNotes}
                  vNotes={vNotes}
                  iNotes={iNotes}
                  holiDays={holiDays}
                  callList={callList}
                  entries={entryList}
                  sked={sked}
                  type="Published"
                  dateContext={dateContext}
                  user={userCopy}
                />
              }
              fileName={
                dateContext.format("MMMM") +
                dateContext.format("Y") +
                "publishedsked.pdf"
              }
            >
              {({ loading }) =>
                loading ? (
                  "Loading document..."
                ) : (
                  <span onMouseOver={hoverSpan}>Employee Colour Download</span>
                )
              }
            </PDFDownloadLink>
          </Col>
        </Row>
      );
    }
  };

  const editNote = (id) => {
    fetch("https://secure-earth-82827.herokuapp.com/sked/editNote", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        msg: msg,
      }),
    })
      .then((response) => response.json())
      .then((notes) => {
        if (notes.id) {
          loadAllNotes();
        }
      });
    toggleNote(-1, "");
  };

  const deleteNote = (id) => {
    fetch("https://secure-earth-82827.herokuapp.com/sked/deleteNote", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((notes) => {
        if (notes.id) {
          loadAllNotes();
        }
      });
  };

  const toggleNote = (id, msg) => {
    setMsg(msg);
    setId(id);
    setNShow(!nShow);
  };

  const onMsgChange = (e) => {
    setMsg(e.target.value);
  };

  let modalList = [];
  sked.forEach((item, index) => {
    const splitArr = item.date.split("/");
    if (
      splitArr[0] === dateContext.format("MM") &&
      parseInt(splitArr[1], 10) === day &&
      splitArr[2] === dateContext.format("YYYY")
    ) {
      modalList.push(
        <li key={index}>
          {idToName(item.id) + " "}
          <span style={{ backgroundColor: item.colour }}>{item.name}</span>
        </li>
      );
    }
  });

  let noteList = [];

  if (user.isadmin) {
    for (let n = 0; n < numNotes.length; n++) {
      const split = numNotes[n].date.split("/");
      if (
        split[0] === dateContext.format("MM") &&
        parseInt(split[1], 10) === day &&
        split[2] === dateContext.format("YYYY")
      ) {
        noteList.push(
          <li key={n} id="numNotes">
            {numNotes[n].msg}
            <Button
              key={n}
              onClick={() => toggleNote(numNotes[n].id, numNotes[n].msg)}
              className="edit butn"
              size="sm"
              variant="secondary"
            >
              Edit
            </Button>
            <Button
              key={-n - 1}
              onClick={() => deleteNote(numNotes[n].id)}
              className="delete butn"
              size="sm"
              variant="danger"
            >
              Delete
            </Button>
          </li>
        );
      }
    }
    for (let i = 0; i < iNotes.length; i++) {
      const splitArr = iNotes[i].date.split("/");
      if (
        splitArr[0] === dateContext.format("MM") &&
        parseInt(splitArr[1], 10) === day &&
        splitArr[2] === dateContext.format("YYYY")
      ) {
        noteList.push(
          <li key={i} id="iNotes">
            {iNotes[i].msg}
            <Button
              key={i}
              onClick={() => toggleNote(iNotes[i].id, iNotes[i].msg)}
              className="edit butn"
              size="sm"
              variant="secondary"
            >
              Edit
            </Button>
            <Button
              key={-i - 1}
              onClick={() => deleteNote(iNotes[i].id)}
              className="delete butn"
              size="sm"
              variant="danger"
            >
              Delete
            </Button>
          </li>
        );
      }
    }
    for (let i = 0; i < vNotes.length; i++) {
      const splitArr = vNotes[i].date.split("/");
      if (
        splitArr[0] === dateContext.format("MM") &&
        parseInt(splitArr[1], 10) === day &&
        splitArr[2] === dateContext.format("YYYY")
      ) {
        noteList.push(
          <li key={i} id="notes">
            {vNotes[i].msg}
            <Button
              key={i}
              onClick={() => toggleNote(vNotes[i].id, vNotes[i].msg)}
              className="edit butn"
              size="sm"
              variant="secondary"
            >
              Edit
            </Button>
            <Button
              key={-i - 1}
              onClick={() => deleteNote(vNotes[i].id)}
              className="delete butn"
              size="sm"
              variant="danger"
            >
              Delete
            </Button>
          </li>
        );
      }
    }
  } else {
    for (let i = 0; i < vNotes.length; i++) {
      const splitArr = vNotes[i].date.split("/");
      if (
        splitArr[0] === dateContext.format("MM") &&
        parseInt(splitArr[1], 10) === day &&
        splitArr[2] === dateContext.format("YYYY")
      ) {
        noteList.push(
          <li key={i} id="notes">
            {vNotes[i].msg}
          </li>
        );
      }
    }
  }

  return (
    <div className="screen">
      <div>
        <Row className="plabels">
          {publishShow()}
          <Col>
            <h5 className="labels-child">Month</h5>
          </Col>
          <Col>
            <h5 className="labels-child">Year</h5>
          </Col>
          <Col>
            <Button
              onClick={reset}
              id="today"
              className="top-child"
              variant="primary"
            >
              Today
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <p></p>
          </Col>
          <Col>
            <select
              value={dateContext.format("MMMM")}
              onChange={onMonthChange}
              className="top-child month selector"
            >
              {monthSelect()}
            </select>
          </Col>
          <Col>
            <select
              value={dateContext.format("Y")}
              onChange={onYearChange}
              className="top-child year selector"
            >
              {yearSelect()}
            </select>
          </Col>
          <Col>
            <p></p>
          </Col>
        </Row>
        <Row className="psubheader">
          <Col>
            <p></p>
          </Col>
          <Col>
            <Button
              onClick={prevMonth}
              className="arrow top-child"
              variant="secondary"
            >
              &#x25C0;
            </Button>
            <Button
              onClick={nextMonth}
              className="arrow top-child"
              variant="secondary"
            >
              &#x25B6;
            </Button>
          </Col>
          <Col>
            <Button
              onClick={prevYear}
              className="arrow top-child"
              variant="secondary"
            >
              &#x25C0;
            </Button>
            <Button
              onClick={nextYear}
              className="arrow top-child"
              variant="secondary"
            >
              &#x25B6;
            </Button>
          </Col>
          <Col>
            <p></p>
          </Col>
        </Row>
      </div>
      <Row className="curr">
        <Col xl>
          <h3>{dateContext.format("MMMM") + " " + dateContext.format("Y")}</h3>
        </Col>
      </Row>
      <div className="sked">
        <Calendar
          testisadmin={user.isadmin}
          numNotes={numNotes}
          vNotes={vNotes}
          iNotes={iNotes}
          callList={callList}
          entries={entryList}
          sked={sked}
          holiDays={holiDays}
          type="Published"
          dateContext={dateContext}
          today={today}
          style={style}
          onDayClick={(e, day) => onDayClick(e, day)}
        />
      </div>
      <div className="bottom">
        <Col id="downloadLink">
          <PDFDownloadLink
            document={
              <MyDocument
                colour={false}
                stamp={stamp}
                depts={depts}
                numNotes={numNotes}
                vNotes={vNotes}
                iNotes={iNotes}
                holiDays={holiDays}
                callList={callList}
                entries={entryList}
                sked={sked}
                type="Published"
                dateContext={dateContext}
                user={user}
              />
            }
            fileName={
              dateContext.format("MMMM") +
              dateContext.format("Y") +
              "publishedsked.pdf"
            }
          >
            {({ loading }) =>
              loading ? (
                "Loading document..."
              ) : (
                <span onMouseOver={hoverSpan}>
                  Download as Black & White PDF
                </span>
              )
            }
          </PDFDownloadLink>
        </Col>
        <Col id="downloadLink">
          <PDFDownloadLink
            document={
              <MyDocument
                colour={true}
                stamp={stamp}
                depts={depts}
                numNotes={numNotes}
                vNotes={vNotes}
                iNotes={iNotes}
                holiDays={holiDays}
                callList={callList}
                entries={entryList}
                sked={sked}
                type="Published"
                dateContext={dateContext}
                user={user}
              />
            }
            fileName={
              dateContext.format("MMMM") +
              dateContext.format("Y") +
              "publishedsked.pdf"
            }
          >
            {({ loading }) =>
              loading ? (
                "Loading document..."
              ) : (
                <span onMouseOver={hoverSpan}>Download as Colour PDF</span>
              )
            }
          </PDFDownloadLink>
        </Col>
      </div>
      {adminDownload()}
      <div className="modal">
        <Modal show={show} onHide={toggleShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">
              {dateContext.format("MMMM") +
                " " +
                day +
                " " +
                dateContext.format("Y")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>{modalList}</ul>
            <ul>{noteList}</ul>
            {adminNotes()}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggleShow}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="modal">
        <Modal show={nShow} onHide={toggleNote}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Edit Note</Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Group id="note">
                <Form.Control
                  required
                  value={msg}
                  onChange={onMsgChange}
                  type="text"
                  placeholder="Note"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={toggleNote}>
                Close
              </Button>
              <Button onClick={() => editNote(id)} variant="primary">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PubSchedule;
