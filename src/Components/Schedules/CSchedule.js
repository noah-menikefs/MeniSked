import React, { useState, useMemo } from "react";
import CalendarGrid from "./Calendar/CalendarGrid";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ScheduleDownloadLink from "./../PDF/ScheduleDownloadLink.jsx";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import useCalendarNavigation from "../../hooks/useCalendarNavigation";
import useHolidays from "../../hooks/useHolidays";
import CalendarHeader from "./Calendar/CalendarHeader";
import { buildCallMonthDays } from "../../selectors/calendarData";
import { buildCallSkedFromPeople } from "../../utils/scheduleUtils";
import usePdfStamp from "../../hooks/usePdfStamp";

import "./Schedules.css";

const style = {
  position: "relative",
  margin: "10px auto",
  width: "90%",
};

const CSchedule = (props) => {
  const [show, setShow] = useState(false);
  const [day, setDay] = useState(-1);
  const { stamp, updateStamp } = usePdfStamp();

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

  const callSked = useMemo(
    () => buildCallSkedFromPeople(peopleList, callList),
    [peopleList, callList]
  );

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
    maxDate: today.year() + 10,
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

  const hoverSpan = () => updateStamp();

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

  // Build DayCell[] for CalendarGrid using selector
  const days = buildCallMonthDays({
    dateContext,
    holiDays,
    callSked,
    callList,
  });

  // Precompute common PDF props and filename (kept out of JSX)
  const commonDocProps = {
    stamp,
    depts,
    holiDays,
    callList,
    callSked,
    type: "Call",
    dateContext,
    user,
  };
  const pdfFileName = `${dateContext.format("MMMM")}${dateContext.format(
    "Y"
  )}callsked.pdf`;

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
          days={days}
          style={style}
          onDayClick={onDayClick}
        />
      </div>
      <div className="bottom">
        <Col id="downloadLink">
          <ScheduleDownloadLink
            docProps={commonDocProps}
            fileName={pdfFileName}
            colour={false}
            label="Download as Black & White PDF"
            onHover={hoverSpan}
          />
        </Col>
        <Col id="downloadLink">
          <ScheduleDownloadLink
            docProps={commonDocProps}
            fileName={pdfFileName}
            colour={true}
            label="Download as Colour PDF"
            onHover={hoverSpan}
          />
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
