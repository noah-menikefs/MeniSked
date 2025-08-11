import React, { useState, useEffect, useCallback, useRef } from "react";
import Calendar from "./Calendar/Calendar";
import ScheduleDownloadLink from "./../PDF/ScheduleDownloadLink.jsx";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
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

const PerSchedule = (props) => {
  // State management with hooks
  const [activeDocs, setActiveDocs] = useState([]);
  const [docIndex, setDocIndex] = useState(0);
  const [entryIndex, setEntryIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [radio, setRadio] = useState(-1);
  const [day, setDay] = useState(0);
  const [personalDays, setPersonalDays] = useState([]);
  const [pending, setPending] = useState([]);
  const [stamp, setStamp] = useState(moment().format("YYYY-MM-DD HH:mm"));

  // Extract shared data from props
  const {
    user,
    today,
    callList,
    nrHolidayList,
    depts,
    processHolidaysForDate,
    entryList,
  } = props;
  const isMountedRef = useRef(true);

  // Load functions
  // Keep this function identity stable; callers must pass the docs array explicitly
  const loadPersonalDays = useCallback((index, docs) => {
    setPersonalDays([...docs[index].worksked]);
  }, []);

  const loadActiveDocs = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/sked/docs")
      .then((response) => response.json())
      .then((docs) => {
        if (isMountedRef.current) {
          const doctors = [...docs];
          for (let i = 0; i < doctors.length; i++) {
            if (doctors[i].id === user.id) {
              loadPersonalDays(i, doctors);
              setDocIndex(i);
            }
          }
          setActiveDocs(docs);
        }
      });
  }, [user.id, loadPersonalDays]);

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
    maxDate: today.year() + 10,
  });

  const holiDays = useHolidays({
    dateContext,
    nrHolidayList,
    processHolidaysForDate,
  });

  const loadPersonalSked = useCallback((user) => {
    setActiveDocs((prevActiveDocs) => {
      let activeDocs = [...prevActiveDocs];
      for (let i = 0; i < activeDocs.length; i++) {
        if (user.id === activeDocs[i].id) {
          let currentUser = Object.assign({}, activeDocs[i]);
          currentUser.worksked = [...user.worksked];
          activeDocs[i] = currentUser;
          setPersonalDays(currentUser.worksked);
          return activeDocs;
        }
      }
      return prevActiveDocs;
    });
  }, []);

  const loadPending = useCallback(
    (userid = user.id) => {
      fetch("https://secure-earth-82827.herokuapp.com/emessages/" + userid)
        .then((response) => response.json())
        .then((messages) => {
          if (isMountedRef.current) {
            setPending(
              messages.filter((message) => message.status === "pending")
            );
          }
        });
    },
    [user.id]
  );

  const assignCall = useCallback(
    (typeID, method, date) => {
      fetch("https://secure-earth-82827.herokuapp.com/sked/assign", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId: activeDocs[docIndex].id,
          typeId: typeID,
          date: date,
        }),
      })
        .then((response) => response.json())
        .then((user) => {
          if (user.lastname) {
            loadPersonalSked(user);
          }
        });
      if (radio !== -1) {
        setShow(false);
      }
    },
    [activeDocs, docIndex, radio, loadPersonalSked]
  );

  const requestCall = useCallback(
    (typeID, date) => {
      fetch("https://secure-earth-82827.herokuapp.com/request", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docid: user.id,
          entryid: typeID,
          date: date,
          stamp: today.format("MM/DD/YYYY"),
        }),
      })
        .then((response) => response.json())
        .then((message) => {
          if (message) {
            loadPending();
          }
        });
      if (radio !== -1) {
        setShow(false);
      }
    },
    [user.id, today, radio, loadPending]
  );

  const editCall = useCallback(
    (typeID, date) => {
      fetch("https://secure-earth-82827.herokuapp.com/request", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docid: parseInt(user.id),
          entryid: parseInt(typeID, 10),
          date: date,
        }),
      })
        .then((response) => response.json())
        .then((message) => {
          if (message) {
            loadPending();
          }
        });
      if (radio !== -1) {
        setShow(false);
      }
    },
    [user.id, radio, loadPending]
  );

  const deleteCall = useCallback(
    (typeID, date, docid = parseInt(user.id, 10)) => {
      fetch("https://secure-earth-82827.herokuapp.com/drequest", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docid: docid,
          entryid: parseInt(typeID, 10),
          date: date,
          pending: pending,
        }),
      })
        .then((response) => response.json())
        .then((messages) => {
          if (messages) {
            loadPending();
          }
        });
      if (radio !== -1) {
        setShow(false);
      }
    },
    [user.id, pending, radio, loadPending]
  );

  const assignOrDelete = useCallback(
    (typeId, selectedDay = day) => {
      if (typeId !== -1) {
        const typeID = parseInt(typeId, 10);
        const date =
          dateContext.format("MM") +
          "/" +
          selectedDay +
          "/" +
          dateContext.format("YYYY");
        if (user.isadmin) {
          let method = "post";
          for (let i = 0; i < personalDays.length; i++) {
            if (
              personalDays[i].date === date &&
              typeID === personalDays[i].id
            ) {
              method = "delete";
              break;
            }
          }
          assignCall(typeID, method, date);
          for (let j = 0; j < pending.length; j++) {
            for (let n = 0; n < pending[j].dates.length; n++) {
              if (pending[j].dates[n] === date) {
                deleteCall(pending[j].entryid, date, activeDocs[docIndex].id);
                break;
              }
            }
          }
        } else if (!user.isadmin) {
          let flag = false;
          let flag2 = false;

          for (let j = 0; j < pending.length; j++) {
            for (let n = 0; n < pending[j].dates.length; n++) {
              if (pending[j].dates[n] === date) {
                if (parseInt(pending[j].entryid, 10) === typeID) {
                  flag2 = true;
                }
                deleteCall(typeID, date);
                break;
              }
            }
          }

          if (!flag2) {
            for (let i = 0; i < pending.length; i++) {
              if (
                user.id === parseInt(pending[i].docid, 10) &&
                typeID === parseInt(pending[i].entryid, 10)
              ) {
                flag = true;
              }
            }
            if (!flag) {
              requestCall(typeID, date);
            } else {
              editCall(typeID, date);
            }
          }
        }
      }

      setDay(0);
      setRadio(-1);
    },
    [
      day,
      dateContext,
      user.isadmin,
      user.id,
      assignCall,
      personalDays,
      pending,
      deleteCall,
      activeDocs,
      docIndex,
      requestCall,
      editCall,
    ]
  );

  // Event handlers
  const onDayClick = useCallback(
    (e, day) => {
      const id = entryList[entryIndex].id;
      if (id === 1) {
        setDay(day);
        setShow(true);
      } else {
        assignOrDelete(id, day);
      }
    },
    [entryList, entryIndex, assignOrDelete]
  );

  const nextDoc = useCallback(() => {
    let i = docIndex;
    if (i !== activeDocs.length - 1) {
      loadPersonalDays(i + 1, activeDocs);
      loadPending(activeDocs[i + 1].id);
      setDocIndex(i + 1);
    } else {
      loadPersonalDays(0, activeDocs);
      loadPending(activeDocs[0].id);
      setDocIndex(0);
    }
  }, [docIndex, activeDocs, loadPersonalDays, loadPending]);

  const prevDoc = useCallback(() => {
    let i = docIndex;
    if (i !== 0) {
      loadPersonalDays(i - 1, activeDocs);
      loadPending(activeDocs[i - 1].id);
      setDocIndex(i - 1);
    } else {
      loadPersonalDays(activeDocs.length - 1, activeDocs);
      loadPending(activeDocs[activeDocs.length - 1].id);
      setDocIndex(activeDocs.length - 1);
    }
  }, [docIndex, activeDocs, loadPersonalDays, loadPending]);

  const nextEntry = useCallback(() => {
    let i = entryIndex;
    if (i !== entryList.length - 1) {
      setEntryIndex(i + 1);
    } else {
      setEntryIndex(0);
    }
  }, [entryIndex, entryList.length]);

  const prevEntry = useCallback(() => {
    let i = entryIndex;
    if (i !== 0) {
      setEntryIndex(i - 1);
    } else {
      setEntryIndex(entryList.length - 1);
    }
  }, [entryIndex, entryList.length]);

  // Form handlers
  const onPhysicianChange = useCallback(
    (event) => {
      if (event.target.key) {
        loadPersonalDays(event.target.key, activeDocs);
        setDocIndex(event.target.key);
      } else {
        let index = -1;
        for (let i = 0; i < activeDocs.length; i++) {
          if (activeDocs[i].lastname === event.target.value) {
            index = i;
            break;
          }
        }
        loadPersonalDays(index, activeDocs);
        loadPending(activeDocs[index].id);
        setDocIndex(index);
      }
    },
    [activeDocs, loadPersonalDays, loadPending]
  );

  const onEntryChange = useCallback(
    (event) => {
      let index = -1;
      for (let i = 0; i < entryList.length; i++) {
        if (entryList[i].name === event.target.value) {
          index = i;
          break;
        }
      }
      setEntryIndex(index);
    },
    [entryList]
  );

  const onMonthChange = useCallback(
    (event) => {
      setMonth(event.target.value);
    },
    [setMonth]
  );

  const onYearChange = useCallback(
    (event) => {
      setYear(event.target.value);
    },
    [setYear]
  );

  const radioChange = useCallback((event) => {
    setRadio(event.target.id);
  }, []);

  const toggleShow = useCallback(() => {
    setShow(!show);
  }, [show]);

  const adminButton = useCallback(() => {
    if (user.isadmin) {
      return (
        <div>
          <Button
            onClick={prevDoc}
            className="arrow top-child"
            variant="secondary"
          >
            &#x25C0;
          </Button>
          <Button
            onClick={nextDoc}
            className="arrow top-child"
            variant="secondary"
          >
            &#x25B6;
          </Button>
        </div>
      );
    } else {
      return <p className="vis top-child"></p>;
    }
  }, [user.isadmin, prevDoc, nextDoc]);

  const hoverSpan = useCallback(() => {
    setStamp(moment().format("YYYY-MM-DD HH:mm"));
  }, []);

  // useEffect hooks for lifecycle management
  useEffect(() => {
    loadActiveDocs();
  }, [loadActiveDocs]);

  useEffect(() => {
    if (user.id) {
      loadPending();
    }
  }, [user.id, loadPending]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Render logic
  let docSelect = activeDocs.map((doc, i) => {
    return (
      <option key={i} value={doc.lastname}>
        {doc.lastname}
      </option>
    );
  });

  let adminSelect = () => {
    if (user.isadmin && activeDocs.length !== 0) {
      return (
        <select
          value={activeDocs[docIndex].lastname}
          onChange={onPhysicianChange}
          className="top-child doc selector"
        >
          {docSelect}
        </select>
      );
    } else {
      return <h6 className="top-child">{user.lastname}</h6>;
    }
  };

  let entryFilter = entryList.filter((entry) => {
    return entry.isactive;
  });

  let entrySelect = entryFilter.map((entry, i) => {
    return (
      <option key={i} value={entry.name}>
        {entry.name}
      </option>
    );
  });

  let eSelect = () => {
    if (entryList.length !== 0) {
      return (
        <select
          value={entryList[entryIndex].name}
          onChange={onEntryChange}
          className="top-child types selector"
        >
          {entrySelect}
        </select>
      );
    } else {
      return <p id="entriesP">Entries</p>;
    }
  };

  let yearSelect = [];
  let fYear = today.year();

  for (let i = 2020; i <= fYear + 10; i++) {
    yearSelect.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  let radioSelect = [];
  for (let j = 0; j < callList.length; j++) {
    if (callList[j].isactive) {
      radioSelect.push(
        <Form.Check
          required
          key={j}
          name="callType"
          type="radio"
          id={callList[j].id}
          label={callList[j].name}
        />
      );
    }
  }

  // Precompute MyDocument props and filename
  const personalDocProps = {
    stamp,
    depts,
    entries: entryList,
    callList,
    personalDays,
    holiDays,
    type: `${user.firstname} ${user.lastname}'s Personal`,
    dateContext,
    user,
  };
  const personalFileName =
    dateContext.format("MMMM") + dateContext.format("Y") + "pesonalsked.pdf";

  return (
    <div className="screen">
      <CalendarHeader
        leadingCols={[
          {
            label: "Physician",
            content: adminSelect(),
            controls: adminButton(),
          },
          {
            label: "Type of Entry",
            content: eSelect(),
            controls: (
              <>
                <Button
                  onClick={prevEntry}
                  className="arrow top-child"
                  size="sm"
                  variant="secondary"
                >
                  &#x25C0;
                </Button>
                <Button
                  onClick={nextEntry}
                  className="arrow top-child"
                  size="sm"
                  variant="secondary"
                >
                  &#x25B6;
                </Button>
              </>
            ),
          },
        ]}
        monthValue={dateContext.format("MMMM")}
        yearValue={dateContext.format("Y")}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onPrevYear={prevYear}
        onNextYear={nextYear}
        onReset={reset}
        yearOptions={yearSelect}
      />
      <div className="curr">
        <h3 id="pcurr">
          {dateContext.format("MMMM") + " " + dateContext.format("Y")}
        </h3>
      </div>
      <div className="sked">
        <Calendar
          pending={pending}
          entries={entryList}
          callList={callList}
          personalDays={personalDays}
          holiDays={holiDays}
          type="Personal"
          dateContext={dateContext}
          today={today}
          style={style}
          onDayClick={(e, day) => onDayClick(e, day)}
        />
      </div>
      <div className="bottom">
        <Col id="downloadLink">
          <ScheduleDownloadLink
            docProps={personalDocProps}
            fileName={personalFileName}
            colour={false}
            label="Download as PDF"
            onHover={hoverSpan}
          />
        </Col>
      </div>

      <div className="modal">
        <Modal show={show} onHide={toggleShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">Select Call Type</Modal.Title>
          </Modal.Header>
          <Form>
            <Modal.Body>
              <Form.Group onChange={radioChange} controlId="formBasicRadio">
                {radioSelect}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={toggleShow} variant="secondary">
                Close
              </Button>
              <Button onClick={() => assignOrDelete(radio)} variant="primary">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default PerSchedule;
