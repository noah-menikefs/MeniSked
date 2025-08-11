import React, { useMemo } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import moment from "moment";

const CalendarHeader = ({
  monthValue,
  yearValue,
  onMonthChange,
  onYearChange,
  onPrevMonth,
  onNextMonth,
  onPrevYear,
  onNextYear,
  onReset,
  yearOptions,
}) => {
  const months = useMemo(() => moment.months(), []);

  return (
    <>
      <Row className="clabels">
        <Col>
          <h5 className="labels-child">Year</h5>
        </Col>
        <Col>
          <h5 className="labels-child">Month</h5>
        </Col>
        <Col>
          <Button
            onClick={onReset}
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
            value={yearValue}
            onChange={onYearChange}
            className="top-child year selector"
          >
            {yearOptions}
          </select>
        </Col>
        <Col>
          <select
            value={monthValue}
            onChange={onMonthChange}
            className="top-child month selector"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Col>
        <Col>
          <p className="vis top-child"></p>
        </Col>
      </Row>
      <Row className="csubheader">
        <Col>
          <Button
            onClick={onPrevYear}
            className="arrow top-child"
            variant="secondary"
          >
            &#x25C0;
          </Button>
          <Button
            onClick={onNextYear}
            className="arrow top-child"
            variant="secondary"
          >
            &#x25B6;
          </Button>
        </Col>
        <Col>
          <Button
            onClick={onPrevMonth}
            className="arrow top-child"
            variant="secondary"
          >
            &#x25C0;
          </Button>
          <Button
            onClick={onNextMonth}
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
    </>
  );
};

export default CalendarHeader;
