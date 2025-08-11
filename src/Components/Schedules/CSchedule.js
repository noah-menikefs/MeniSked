import React, { useState, useCallback, useMemo } from "react";
import CalendarGrid from "./Calendar/CalendarGrid";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyDocument from "./../PDF/MyDocument";
import Modal from "react-bootstrap/Modal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import moment from "moment";
import useCalendarNavigation from "../../hooks/useCalendarNavigation";
import useHolidays from "../../hooks/useHolidays";
import CalendarHeader from "./Calendar/CalendarHeader";

import "./Schedules.css";

const style = {
  position: "relative",
  margin: "10px auto",
  width: "90%",
};

const CSchedule = (props) => {
  const [show, setShow] = useState(false);
  const [day, setDay] = useState(-1);
  const [stamp, setStamp] = useState(moment().format("YYYY-MM-DD HH:mm"));

  // Extract shared data from props
  const {
    today,
    user,
    callList,
    nrHolidayList,
    depts,
    processHolidaysForDate,
    peopleList,
  } = props;

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

  const callSked = useMemo(() => {
    let arr = [];
    peopleList.forEach((person) => {
      person.worksked.forEach((work) => {
        if (callList.some((c) => c.id === work.id)) {
          arr.push({
            id: work.id,
            date: work.date,
            name: person.lastname,
            colour: person.colour,
            priority: priorityCheck(work.id),
          });
        }
      });
    });
    arr.sort((a, b) => a.priority - b.priority);
    return arr;
  }, [callList, peopleList, priorityCheck]);

  const {
    dateContext,
    setDateContext,
    setMonth,
    setYear,
    nextMonth,
    prevMonth,
    nextYear,
    prevYear,
    reset,
  } = useCalendarNavigation({
    initialDate: today,
    minYear: 2020,
    maxYear: today.year() + 10,
  });

  // Holidays recompute when dateContext or holiday data changes
  const holiDays = useHolidays({
    dateContext,
    nrHolidayList,
    processHolidaysForDate,
  });

  const onDayClick = (d) => {
    const ctx = moment(dateContext).set("date", d);
    setDateContext(ctx);
    toggleShow(d);
  };

  const toggleShow = (maybeDay) => {
    setShow((prev) => !prev);
    if (typeof maybeDay === "number" && Number.isFinite(maybeDay)) {
      setDay(maybeDay);
    } else {
      // Reset day when called from events like Modal.onHide/Button.onClick
      setDay(-1);
    }
  };

  const onMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const onYearChange = (e) => {
    setYear(e.target.value);
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

  // Build DayCell[] for CalendarGrid (only Call schedule content)
  const monthStr = dateContext.format("MM");
  const yearStr = dateContext.format("YYYY");
  const daysMap = new Map();
  const ensureDay = (d) => {
    if (!daysMap.has(d)) {
      daysMap.set(d, { day: d, contentItems: [] });
    }
    return daysMap.get(d);
  };
  // Holidays
  for (const h of holiDays) {
    const item = ensureDay(h.day);
    item.holidayName = h.name;
  }
  // Calls
  for (let i = 0; i < callSked.length; i++) {
    const { date, id, colour, name } = callSked[i];
    const [m, dStr, y] = date.split("/");
    const d = Number(dStr);
    if (m === monthStr && y === yearStr) {
      const item = ensureDay(d);
      item.contentItems.push(
        <li key={`c-${i}`} className="call" id="call">
          {idToName(id) + " "}
          <span style={{ backgroundColor: colour }}>{name}</span>
        </li>
      );
    }
  }
  const days = Array.from(daysMap.values());

  return (
    <div className="screen">
      <CalendarHeader
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
      <Row className="curr">
        <Col xl>
          <h3>{dateContext.format("MMMM") + " " + dateContext.format("Y")}</h3>
        </Col>
      </Row>
      <div className="sked">
        <CalendarGrid
          year={Number(dateContext.format("YYYY"))}
          monthIndex={Number(dateContext.format("M")) - 1}
          currentDay={Number(dateContext.format("D"))}
          days={days}
          style={style}
          onDayClick={onDayClick}
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
        <Modal show={show} onHide={() => toggleShow()}>
          <Modal.Header closeButton>
            <Modal.Title id="modalTitle">
              {`${dateContext.format("MMMM")} ${
                typeof day === "number" && day > 0
                  ? String(day).padStart(2, "0")
                  : dateContext.format("DD")
              }, ${dateContext.format("YYYY")}`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>{modalList}</ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => toggleShow()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CSchedule;
