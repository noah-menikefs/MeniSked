import React, { useEffect, useState, useCallback } from "react";
import Calendar from "./Calendar/Calendar";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyDocument from "./../PDF/MyDocument";
import Modal from "react-bootstrap/Modal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import moment from "moment";

import "./Schedules.css";

const style = {
  position: "relative",
  margin: "10px auto",
  width: "90%",
};

const CSchedule = (props) => {
  const [dateContext, setDateContext] = useState(moment());
  const [show, setShow] = useState(false);
  const [holiDays, setHoliDays] = useState([]);
  const [rHolidayList, setRHolidayList] = useState([]);
  const [nrHolidayList, setNrHolidayList] = useState([]);
  const [render, setRender] = useState(false);
  const [callSked, setCallSked] = useState([]);
  const [day, setDay] = useState(-1);
  const [depts, setDepts] = useState([]);
  const [stamp, setStamp] = useState(moment().format("YYYY-MM-DD HH:mm"));

  const { today, user, callList, loadCallTypes } = props;

  const priorityCheck = useCallback(
    (id) => {
      for (let n = 0; n < callList.length; n++) {
        if (callList[n].id === id) {
          return callList[n].priority;
        }
      }
    },
    [callList]
  );

  const loadCallSked = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/people")
      .then((response) => response.json())
      .then((docs) => {
        let arr = [];
        let callIds = callList.map((c) => c.id);
        for (let i = 0; i < docs.length; i++) {
          for (let j = 0; j < docs[i].worksked.length; j++) {
            for (let m = 0; m < callIds.length; m++) {
              if (docs[i].worksked[j].id === callIds[m]) {
                arr.push({
                  id: docs[i].worksked[j].id,
                  date: docs[i].worksked[j].date,
                  name: docs[i].lastname,
                  colour: docs[i].colour,
                  priority: priorityCheck(docs[i].worksked[j].id),
                });
              }
            }
          }
        }
        arr.sort((a, b) => a.priority - b.priority);
        setCallSked(arr);
      });
  }, [callList, priorityCheck]);

  const loadrHolidays = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/holiday/r")
      .then((response) => response.json())
      .then((holidays) =>
        setRHolidayList(holidays.filter((holiday) => holiday.isactive === true))
      );
  }, []);

  const loadnrHolidays = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/holiday/nr")
      .then((response) => response.json())
      .then((holidays) => setNrHolidayList(holidays));
  }, []);

  const loadDepts = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/departments")
      .then((response) => response.json())
      .then((departments) => setDepts(departments));
  }, []);

  useEffect(() => {
    loadrHolidays();
    loadnrHolidays();
    loadCallTypes();
    loadCallSked();
    loadDepts();
  }, [loadCallSked, loadCallTypes, loadnrHolidays, loadrHolidays, loadDepts]);

  const loadNewDays = (ctx) => {
    let newArr = [];
    nrHolidayList.forEach((nholiday) => {
      nholiday.eventsked.forEach((date) => {
        let dateArr = date.split("/");
        if (
          dateArr[0] === ctx.format("MM") &&
          dateArr[2] === ctx.format("YYYY")
        ) {
          newArr.push({
            day: parseInt(dateArr[1], 10),
            name: nholiday.name,
          });
        }
      });
    });
    rHolidayList.forEach((holiday) => {
      if (holiday.month === ctx.format("MMMM")) {
        newArr.push({
          day: holiday.day,
          name: holiday.name,
        });
      }
    });
    setHoliDays(newArr);
    setRender(true);
  };

  const onDayClick = (e, d) => {
    const ctx = moment(dateContext).set("date", d);
    setDateContext(ctx);
    toggleShow(d);
  };

  const toggleShow = (d) => {
    setShow((prev) => !prev);
    setDay(d);
  };

  const months = moment.months(); // List of each month

  const setMonth = (month) => {
    const monthNo = months.indexOf(month);
    const ctx = moment(dateContext).set("month", monthNo);
    setDateContext(ctx);
    loadNewDays(ctx);
  };

  const nextMonth = () => {
    const ctx = moment(dateContext).add(1, "month");
    if (ctx.year() <= today.year() + 10) {
      setDateContext(ctx);
      loadNewDays(ctx);
    }
  };

  const prevMonth = () => {
    const ctx = moment(dateContext).subtract(1, "month");
    if (ctx.year() >= 2020) {
      setDateContext(ctx);
      loadNewDays(ctx);
    }
  };

  const nextYear = () => {
    const ctx = moment(dateContext).add(1, "year");
    if (ctx.year() <= today.year() + 10) {
      setDateContext(ctx);
      loadNewDays(ctx);
    }
  };

  const prevYear = () => {
    const ctx = moment(dateContext).subtract(1, "year");
    if (ctx.year() >= 2020) {
      setDateContext(ctx);
      loadNewDays(ctx);
    }
  };

  const setYear = (year) => {
    const ctx = moment(dateContext).set("year", year);
    setDateContext(ctx);
    loadNewDays(ctx);
  };

  const onMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const onYearChange = (e) => {
    setYear(e.target.value);
  };

  const reset = () => {
    setDateContext(today);
    loadNewDays(today);
  };

  const idToName = (id) => {
    for (let n = 0; n < callList.length; n++) {
      if (callList[n].id === id) {
        return callList[n].name;
      }
    }
  };

  const hoverSpan = () => {
    setStamp(moment().format("YYYY-MM-DD HH:mm"));
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

  let modalList = [];
  for (let i = 0; i < callSked.length; i++) {
    const splitArr = callSked[i].date.split("/");
    if (
      splitArr[0] === dateContext.format("MM") &&
      parseInt(splitArr[1], 10) === day &&
      splitArr[2] === dateContext.format("YYYY")
    ) {
      modalList.push(
        <li key={-i - 1}>
          {idToName(callSked[i].id) + " "}
          <span style={{ backgroundColor: callSked[i].colour }}>
            {callSked[i].name}
          </span>
        </li>
      );
    }
  }

  return (
    <div className="screen">
      <Row className="clabels">
        <Col>
          <h5 className="labels-child">Year</h5>
        </Col>
        <Col>
          <h5 className="labels-child">Month</h5>
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
      <Row className="cheader">
        <Col>
          <select
            value={dateContext.format("Y")}
            onChange={onYearChange}
            className="top-child year selector"
          >
            {yearSelect}
          </select>
        </Col>
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
          <p className="vis top-child"></p>
        </Col>
      </Row>
      <Row className="csubheader">
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
          <p className="vis top-child"></p>
        </Col>
      </Row>
      <Row className="curr">
        <Col xl>
          <h3>{dateContext.format("MMMM") + " " + dateContext.format("Y")}</h3>
        </Col>
      </Row>
      <div className="sked">
        {nrHolidayList.length > 0 && !render ? loadNewDays(today) : false}
        <Calendar
          callList={callList}
          callSked={callSked}
          holiDays={holiDays}
          type="Call"
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
                entries={[]}
                callList={callList}
                callSked={callSked}
                holiDays={holiDays}
                type="Call"
                dateContext={dateContext}
                user={user}
              />
            }
            fileName={
              dateContext.format("MMMM") +
              dateContext.format("Y") +
              "callsked.pdf"
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
                numNotes={[]}
                vNotes={[]}
                iNotes={[]}
                entries={[]}
                callList={callList}
                callSked={callSked}
                holiDays={holiDays}
                type="Call"
                dateContext={dateContext}
                user={user}
              />
            }
            fileName={
              dateContext.format("MMMM") +
              dateContext.format("Y") +
              "callsked.pdf"
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
      <div className="modal">
        <Modal show={show} onHide={toggleShow}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">
              {dateContext.format("MMMM DD, YYYY")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>{modalList}</ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggleShow}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CSchedule;
