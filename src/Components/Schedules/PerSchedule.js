import React, { useState, useEffect, useCallback, useRef } from "react";
import Calendar from "./Calendar/Calendar";
import MyDocument from "./../PDF/MyDocument";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

const PerSchedule = (props) => {
  // State management with hooks
  const [activeDocs, setActiveDocs] = useState([]);
  const [entries, setEntries] = useState([]);
  const [docIndex, setDocIndex] = useState(0);
  const [entryIndex, setEntryIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [dateContext, setDateContext] = useState(moment());
  const [radio, setRadio] = useState(-1);
  const [day, setDay] = useState(0);
  const [rHolidayList, setRHolidayList] = useState([]);
  const [nrHolidayList, setNrHolidayList] = useState([]);
  const [holiDays, setHoliDays] = useState([]);
  const [personalDays, setPersonalDays] = useState([]);
  const [render, setRender] = useState(false);
  const [pending, setPending] = useState([]);
  const [depts, setDepts] = useState([]);
  const [stamp, setStamp] = useState(moment().format("YYYY-MM-DD HH:mm"));

  const { user, today, callList } = props;
  const months = moment.months(); // List of each month
  const isMountedRef = useRef(true);

  // Load functions
  const loadrHolidays = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/holiday/r")
      .then((response) => response.json())
      .then((holidays) => {
        if (isMountedRef.current) {
          setRHolidayList(
            holidays.filter((holiday) => holiday.isactive === true)
          );
        }
      });
  }, []);

  const loadnrHolidays = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/holiday/nr")
      .then((response) => response.json())
      .then((holidays) => {
        if (isMountedRef.current) {
          setNrHolidayList(holidays);
        }
      });
  }, []);

  const loadPersonalDays = useCallback(
    (index, docs = activeDocs) => {
      setPersonalDays([...docs[index].worksked]);
    },
    [activeDocs]
  );

  const loadActiveDocs = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/sked/docs")
      .then((response) => response.json())
      .then((docs) => {
        if (isMountedRef.current) {
          if (!render) {
            const doctors = [...docs];
            for (let i = 0; i < doctors.length; i++) {
              if (doctors[i].id === user.id) {
                loadPersonalDays(i, doctors);
                setDocIndex(i);
              }
            }
          }
          setActiveDocs(docs);
        }
      });
  }, [render, user.id, loadPersonalDays]);

  const loadEntries = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/sked/entries")
      .then((response) => response.json())
      .then((entries) => {
        if (isMountedRef.current) {
          setEntries(entries.filter((entry) => entry.isactive === true));
        }
      });
  }, []);

  const loadNewDays = useCallback(
    (dateContext) => {
      let newArr = [];
      nrHolidayList.forEach((nholiday) => {
        nholiday.eventsked.forEach((date) => {
          let dateArr = date.split("/");
          if (
            dateArr[0] === dateContext.format("MM") &&
            dateArr[2] === dateContext.format("YYYY")
          ) {
            newArr.push({
              day: parseInt(dateArr[1], 10),
              name: nholiday.name,
            });
          }
        });
      });

      rHolidayList.forEach((holiday) => {
        if (holiday.month === dateContext.format("MMMM")) {
          newArr.push({
            day: holiday.day,
            name: holiday.name,
          });
        }
      });
      setHoliDays(newArr);
      setRender(true);
    },
    [nrHolidayList, rHolidayList]
  );

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

  const loadDepts = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/departments")
      .then((response) => response.json())
      .then((departments) => {
        if (isMountedRef.current) {
          setDepts(departments);
        }
      });
  }, []);

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
      const id = entries[entryIndex].id;
      if (id === 1) {
        setDay(day);
        setShow(true);
      } else {
        assignOrDelete(id, day);
      }
    },
    [entries, entryIndex, assignOrDelete]
  );

  // Navigation functions
  const setMonth = useCallback(
    (month) => {
      let monthNo = months.indexOf(month);
      let newDateContext = moment(dateContext).set("month", monthNo);
      setDateContext(newDateContext);
      loadNewDays(newDateContext);
    },
    [dateContext, months, loadNewDays]
  );

  const nextMonth = useCallback(() => {
    let newDateContext = moment(dateContext).add(1, "month");
    if (newDateContext.year() <= today.year() + 10) {
      setDateContext(newDateContext);
      loadNewDays(newDateContext);
    }
  }, [dateContext, today, loadNewDays]);

  const prevMonth = useCallback(() => {
    let newDateContext = moment(dateContext).subtract(1, "month");
    if (newDateContext.year() >= 2020) {
      setDateContext(newDateContext);
      loadNewDays(newDateContext);
    }
  }, [dateContext, loadNewDays]);

  const nextDoc = useCallback(() => {
    let i = docIndex;
    if (i !== activeDocs.length - 1) {
      loadPersonalDays(i + 1);
      loadPending(activeDocs[i + 1].id);
      setDocIndex(i + 1);
    } else {
      loadPersonalDays(0);
      loadPending(activeDocs[0].id);
      setDocIndex(0);
    }
  }, [docIndex, activeDocs, loadPersonalDays, loadPending]);

  const prevDoc = useCallback(() => {
    let i = docIndex;
    if (i !== 0) {
      loadPersonalDays(i - 1);
      loadPending(activeDocs[i - 1].id);
      setDocIndex(i - 1);
    } else {
      loadPersonalDays(activeDocs.length - 1);
      loadPending(activeDocs[activeDocs.length - 1].id);
      setDocIndex(activeDocs.length - 1);
    }
  }, [docIndex, activeDocs, loadPersonalDays, loadPending]);

  const nextEntry = useCallback(() => {
    let i = entryIndex;
    if (i !== entries.length - 1) {
      setEntryIndex(i + 1);
    } else {
      setEntryIndex(0);
    }
  }, [entryIndex, entries.length]);

  const prevEntry = useCallback(() => {
    let i = entryIndex;
    if (i !== 0) {
      setEntryIndex(i - 1);
    } else {
      setEntryIndex(entries.length - 1);
    }
  }, [entryIndex, entries.length]);

  const nextYear = useCallback(() => {
    if (dateContext.year() + 1 <= today.year() + 10) {
      let newDateContext = moment(dateContext).add(1, "year");
      setDateContext(newDateContext);
      loadNewDays(newDateContext);
    }
  }, [dateContext, today, loadNewDays]);

  const prevYear = useCallback(() => {
    if (dateContext.year() - 1 >= 2020) {
      let newDateContext = moment(dateContext).subtract(1, "year");
      setDateContext(newDateContext);
      loadNewDays(newDateContext);
    }
  }, [dateContext, loadNewDays]);

  const setYear = useCallback(
    (year) => {
      let newDateContext = moment(dateContext).set("year", year);
      setDateContext(newDateContext);
      loadNewDays(newDateContext);
    },
    [dateContext, loadNewDays]
  );

  // Form handlers
  const onPhysicianChange = useCallback(
    (event) => {
      if (event.target.key) {
        loadPersonalDays(event.target.key);
        setDocIndex(event.target.key);
      } else {
        let index = -1;
        for (let i = 0; i < activeDocs.length; i++) {
          if (activeDocs[i].lastname === event.target.value) {
            index = i;
            break;
          }
        }
        loadPersonalDays(index);
        loadPending(activeDocs[index].id);
        setDocIndex(index);
      }
    },
    [activeDocs, loadPersonalDays, loadPending]
  );

  const onEntryChange = useCallback(
    (event) => {
      let index = -1;
      for (let i = 0; i < entries.length; i++) {
        if (entries[i].name === event.target.value) {
          index = i;
          break;
        }
      }
      setEntryIndex(index);
    },
    [entries]
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

  const reset = useCallback(() => {
    setDateContext(today);
    loadNewDays(today);
  }, [today, loadNewDays]);

  const hoverSpan = useCallback(() => {
    setStamp(moment().format("YYYY-MM-DD HH:mm"));
  }, []);

  // useEffect hooks for lifecycle management
  useEffect(() => {
    loadActiveDocs();
    loadEntries();
    props.loadCallTypes();
    loadrHolidays();
    loadnrHolidays();
    loadDepts();
  }, [
    loadActiveDocs,
    loadEntries,
    props.loadCallTypes,
    loadrHolidays,
    loadnrHolidays,
    loadDepts,
    props,
  ]);

  useEffect(() => {
    if (user.id) {
      loadPending();
    }
  }, [user.id, loadPending]);

  useEffect(() => {
    if (nrHolidayList.length > 0 && !render) {
      loadNewDays(today);
    }
  }, [nrHolidayList.length, render, loadNewDays, today]);

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

  let entryFilter = entries.filter((entry) => {
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
    if (entries.length !== 0) {
      return (
        <select
          value={entries[entryIndex].name}
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

  return (
    <div className="screen">
      <Row className="labels">
        <Col>
          <h5 className="labels-child">Physician</h5>
        </Col>
        <Col>
          <h5 className="labels-child">Type of Entry</h5>
        </Col>
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
      <Row className="header">
        <Col>{adminSelect()}</Col>
        <Col>{eSelect()}</Col>
        <Col>
          <select
            value={dateContext.format("MMMM")}
            onChange={onMonthChange}
            className="top-child month selector"
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </Col>
        <Col>
          <select
            value={dateContext.format("Y")}
            onChange={onYearChange}
            className="top-child year selector"
          >
            {yearSelect}
          </select>
        </Col>
        <Col id="smallCol">
          <p className="vis labels-child"></p>
        </Col>
      </Row>
      <Row className="subheader">
        <Col>{adminButton()}</Col>
        <Col>
          <Button
            onClick={prevEntry}
            className="arrow top-child"
            variant="secondary"
          >
            &#x25C0;
          </Button>
          <Button
            onClick={nextEntry}
            className="arrow top-child"
            variant="secondary"
          >
            &#x25B6;
          </Button>
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
          <p className="vis top-child"></p>
        </Col>
      </Row>
      <Row className="labels1">
        <Col>
          <h5 className="labels-child">Physician</h5>
        </Col>
        <Col>
          <h5 className="labels-child">Type of Entry</h5>
        </Col>
      </Row>
      <Row className="header1">
        <Col>{adminSelect()}</Col>
        <Col>{eSelect()}</Col>
      </Row>

      <Row className="subheader1">
        <Col>{adminButton()}</Col>
        <Col>
          <Button
            onClick={prevEntry}
            className="arrow top-child"
            variant="secondary"
          >
            &#x25C0;
          </Button>
          <Button
            onClick={nextEntry}
            className="arrow top-child"
            variant="secondary"
          >
            &#x25B6;
          </Button>
        </Col>
      </Row>
      <Row className="labels2">
        <Col>
          <h5 className="labels-child">Month</h5>
        </Col>
        <Col>
          <h5 className="labels-child">Year</h5>
        </Col>
      </Row>
      <Row className="header2">
        <Col>
          <select
            value={dateContext.format("MMMM")}
            onChange={onMonthChange}
            className="top-child month selector"
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </Col>
        <Col>
          <select
            value={dateContext.format("Y")}
            onChange={onYearChange}
            className="top-child year selector"
          >
            {yearSelect}
          </select>
        </Col>
      </Row>
      <Row className="subheader2">
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
      </Row>
      <div className="curr">
        <h3 id="pcurr">
          {dateContext.format("MMMM") + " " + dateContext.format("Y")}
        </h3>
        <Button
          onClick={reset}
          id="today1"
          className="top-child"
          variant="primary"
        >
          Today
        </Button>
      </div>

      <div className="sked">
        <Calendar
          pending={pending}
          entries={entries}
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
          <PDFDownloadLink
            document={
              <MyDocument
                colour={false}
                stamp={stamp}
                depts={depts}
                numNotes={[]}
                vNotes={[]}
                iNotes={[]}
                entries={entries}
                callList={callList}
                personalDays={personalDays}
                holiDays={holiDays}
                type={user.firstname + " " + user.lastname + "'s Personal"}
                dateContext={dateContext}
                today={today}
                style={style}
                onDayClick={(e, day) => onDayClick(e, day)}
                user={user}
              />
            }
            fileName={
              dateContext.format("MMMM") +
              dateContext.format("Y") +
              "pesonalsked.pdf"
            }
          >
            {({ loading }) =>
              loading ? (
                "Loading document..."
              ) : (
                <span onMouseOver={hoverSpan}>Download as PDF</span>
              )
            }
          </PDFDownloadLink>
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
