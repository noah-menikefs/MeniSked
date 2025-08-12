import React, { useState, useEffect, useCallback, useMemo } from "react";
import CalendarGrid from "./Calendar/CalendarGrid";
import { buildPublishedMonthDays } from "../../selectors/calendarData";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScheduleDownloadLink from "./../PDF/ScheduleDownloadLink.jsx";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import moment from "moment";
import {
  lastPublishedMoment,
  publishedBaseDate,
  isSameMonthYearDay,
} from "../../utils/date";
import CalendarHeader from "./Calendar/CalendarHeader";
import useCalendarNavigation from "../../hooks/useCalendarNavigation";
import useHolidays from "../../hooks/useHolidays";
import {
  buildWorkSkedFromPeople,
  idToNameFromLists,
} from "../../utils/scheduleUtils";
import usePdfStamp from "../../hooks/usePdfStamp";

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
  const [msg, setMsg] = useState("");
  const [id, setId] = useState(-1);
  const [allNotes, setAllNotes] = useState({
    numNotes: [],
    vNotes: [],
    iNotes: [],
  });

  const lastPublished = useMemo(
    () => lastPublishedMoment(published),
    [published]
  );
  const { stamp, updateStamp } = usePdfStamp();

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

  const sked = useMemo(() => {
    return buildWorkSkedFromPeople(peopleList, callList, false);
  }, [callList, peopleList]);

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
    const num = dateContext.diff(publishedBaseDate(), "months");
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
    initialDate: user.isadmin ? today : lastPublished,
    maxDate: user.isadmin ? moment(today).add(10, "year") : lastPublished,
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

  const onDayClick = (day) => {
    setDay(day);
    toggleShow(day);
  };

  const toggleShow = () => {
    setShow(!show);
  };

  const onMonthChange = (event) => setMonth(event.target.value);
  const onYearChange = (event) => setYear(event.target.value);

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

  const publishLeading = () => {
    if (!user.isadmin) return null;

    const isAlreadyPublished = dateContext.isSameOrBefore(
      lastPublishedMoment(published),
      "month"
    );
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

  const hoverSpan = () => updateStamp();
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
    if (isSameMonthYearDay(item.date, dateContext, day)) {
      modalList.push(
        <li key={index}>
          {idToNameFromLists(callList, entryList, item.id) + " "}
          <span style={{ backgroundColor: item.colour }}>{item.name}</span>
        </li>
      );
    }
  });

  let noteList = [];

  const renderNoteWithActions = (key, typeId, note) => (
    <li key={key} id={typeId}>
      {note.msg}
      <Button
        key={`${key}-e`}
        onClick={() => toggleNote(note.id, note.msg)}
        className="edit butn"
        size="sm"
        variant="secondary"
      >
        Edit
      </Button>
      <Button
        key={`${key}-d`}
        onClick={() => deleteNote(note.id)}
        className="delete butn"
        size="sm"
        variant="danger"
      >
        Delete
      </Button>
    </li>
  );

  if (user.isadmin) {
    for (let n = 0; n < numNotes.length; n++) {
      const note = numNotes[n];
      if (isSameMonthYearDay(note.date, dateContext, day)) {
        noteList.push(renderNoteWithActions(n, "numNotes", note));
      }
    }
    for (let i = 0; i < iNotes.length; i++) {
      const note = iNotes[i];
      if (isSameMonthYearDay(note.date, dateContext, day)) {
        noteList.push(renderNoteWithActions(i, "iNotes", note));
      }
    }
    for (let i = 0; i < vNotes.length; i++) {
      const note = vNotes[i];
      if (isSameMonthYearDay(note.date, dateContext, day)) {
        noteList.push(renderNoteWithActions(i, "notes", note));
      }
    }
  } else {
    for (let i = 0; i < vNotes.length; i++) {
      const note = vNotes[i];
      if (isSameMonthYearDay(note.date, dateContext, day)) {
        noteList.push(
          <li key={i} id="notes">
            {note.msg}
          </li>
        );
      }
    }
  }

  const days = buildPublishedMonthDays({
    dateContext,
    holiDays,
    sked,
    vNotes,
    iNotes,
    numNotes,
    callList,
    entryList,
    isAdmin: user.isadmin,
  });

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
        onReset={reset}
        minDate={publishedBaseDate()}
        maxDate={user.isadmin ? moment(today).add(10, "year") : lastPublished}
      />
      <Row className="curr">
        <Col xl>
          <h3>{dateContext.format("MMMM") + " " + dateContext.format("Y")}</h3>
        </Col>
      </Row>
      <div className="sked">
        <CalendarGrid
          year={Number(dateContext.format("YYYY"))}
          monthIndex={Number(dateContext.format("M")) - 1}
          days={days}
          style={style}
          onDayClick={onDayClick}
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
