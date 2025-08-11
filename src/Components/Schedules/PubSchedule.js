import React, { useState, useEffect, useCallback, useMemo } from "react";
import Calendar from "./Calendar/Calendar";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScheduleDownloadLink from "./../PDF/ScheduleDownloadLink.jsx";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import moment from "moment";
import CalendarHeader from "./Calendar/CalendarHeader";
import useCalendarNavigation from "../../hooks/useCalendarNavigation";
import useHolidays from "../../hooks/useHolidays";

import "./Schedules.css";

const style = {
  position: "relative",
  margin: "10px auto",
  width: "90%",
};

const PubSchedule = (props) => {
  const [show, setShow] = useState(false);
  const [nShow, setNShow] = useState(false);
  const [note, setNote] = useState("");
  const [radio, setRadio] = useState(0);
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
  const lastPublished = useMemo(
    () => moment([2020, 5, 1]).add(published, "month"),
    [published]
  );

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

  const {
    dateContext,
    setMonth,
    setYear,
    nextMonth,
    prevMonth,
    nextYear,
    prevYear,
    reset,
  } = useCalendarNavigation({
    initialDate: today,
    maxDate: user.isadmin ? undefined : lastPublished,
  });

  const holiDays = useHolidays({
    dateContext,
    nrHolidayList,
    processHolidaysForDate,
  });

  useEffect(() => {
    loadPublished();
    loadAllNotes();
  }, [loadPublished, loadAllNotes]);

  const onDayClick = (e, day) => {
    setDay(day);
    toggleShow(day);
  };

  const toggleShow = () => {
    setShow(!show);
  };

  const onMonthChange = (event) => setMonth(event.target.value);
  const onYearChange = (event) => setYear(event.target.value);
  const onReset = () => {
    if (
      !user.isadmin &&
      lastPublished &&
      moment(today).isAfter(lastPublished, "month")
    ) {
      setYear(lastPublished.year());
      setMonth(months[lastPublished.month()]);
    } else {
      reset();
    }
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

  const publishLeading = () => {
    if (!user.isadmin) return null;
    let nYear = moment([2020, 5, 1]).add(published, "month").year();
    let nMonth = moment([2020, 5, 1]).add(published, "month").month();
    let isAlreadyPublished = true;
    if (dateContext.year() === nYear) {
      if (dateContext.month() > nMonth) {
        isAlreadyPublished = false;
      }
    } else if (dateContext.year() > nYear) {
      isAlreadyPublished = false;
    }
    if (isAlreadyPublished) {
      return <h5>Published</h5>;
    }
    return (
      <Button onClick={publishSked} className="top-child" variant="primary">
        Publish
      </Button>
    );
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

  // Precompute shared MyDocument props and filename for public downloads
  const publicDocProps = {
    stamp,
    depts,
    numNotes,
    vNotes,
    iNotes,
    holiDays,
    callList,
    entries: entryList,
    sked,
    type: "Published",
    dateContext,
    user,
  };
  const publicFileName =
    dateContext.format("MMMM") + dateContext.format("Y") + "publishedsked.pdf";

  const adminDownload = () => {
    if (user.isadmin) {
      // Precompute admin employee-view PDF props and filename
      const adminEmployeeDocProps = {
        ...publicDocProps,
        user: { ...user, isadmin: false },
      };

      return (
        <Row>
          <Col id="downloadLink">
            <ScheduleDownloadLink
              docProps={adminEmployeeDocProps}
              fileName={publicFileName}
              colour={false}
              label="Employee Black & White Download"
              onHover={hoverSpan}
            />
          </Col>
          <Col id="downloadLink">
            <ScheduleDownloadLink
              docProps={adminEmployeeDocProps}
              fileName={publicFileName}
              colour={true}
              label="Employee Colour Download"
              onHover={hoverSpan}
            />
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
      <CalendarHeader
        leadingCols={[{ content: publishLeading() }]}
        monthValue={dateContext.format("MMMM")}
        yearValue={dateContext.format("Y")}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onPrevYear={prevYear}
        onNextYear={nextYear}
        onReset={onReset}
        yearOptions={yearSelect()}
      />
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
          <ScheduleDownloadLink
            docProps={publicDocProps}
            fileName={publicFileName}
            colour={false}
            label="Download as Black & White PDF"
            onHover={hoverSpan}
          />
        </Col>
        <Col id="downloadLink">
          <ScheduleDownloadLink
            docProps={publicDocProps}
            fileName={publicFileName}
            colour={true}
            label="Download as Colour PDF"
            onHover={hoverSpan}
          />
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
