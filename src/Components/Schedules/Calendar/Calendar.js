import React, { useMemo } from "react";
import moment from "moment";
import "./Calendar.css";

moment().format();

const Calendar = (props) => {
  const {
    style = {},
    type,
    dateContext,
    holiDays = [],
    callSked = [],
    personalDays = [],
    sked = [],
    vNotes = [],
    iNotes = [],
    numNotes = [],
    pending = [],
    callList = [],
    entries = [],
    testisadmin,
    onDayClick,
  } = props;

  const { monthStr, yearStr, firstDay, daysInMonth, currentDay } =
    useMemo(() => {
      const monthStr = dateContext.format("MM");
      const yearStr = dateContext.format("YYYY");
      const firstDay = moment(dateContext).startOf("month").format("d");
      const daysInMonth = dateContext.daysInMonth();
      const currentDay = Number(dateContext.format("D"));
      return { monthStr, yearStr, firstDay, daysInMonth, currentDay };
    }, [dateContext]);

  const parseMDY = (s) => {
    const [month, day, year] = s.split("/");
    return { month, day: Number(day), year };
  };

  const isSameDay = (dateStr, d) => {
    const { month, day, year } = parseMDY(dateStr);
    return month === monthStr && day === d && year === yearStr;
  };

  const idToName = (id) => {
    const foundCall = callList.find((call) => call.id === id);
    if (foundCall) return foundCall.name;
    const foundEntry = entries.find((entry) => entry.id === id);
    if (foundEntry) return foundEntry.name;
    return "";
  };

  const holidayToday = (d) => {
    const hit = holiDays.find((h) => h.day === d);
    return hit ? <span id="holiday">{hit.name}</span> : null;
  };

  const callToday = (d) => {
    const list = [];
    for (let i = 0; i < callSked.length; i++) {
      const item = callSked[i];
      if (isSameDay(item.date, d)) {
        list.push(
          <li key={i} className="call" id="call">
            {idToName(item.id) + " "}
            <span style={{ backgroundColor: item.colour }}>{item.name}</span>
          </li>
        );
      }
    }
    return list;
  };

  const personalToday = (d) => {
    for (let i = 0; i < personalDays.length; i++) {
      const item = personalDays[i];
      if (isSameDay(item.date, d)) {
        return (
          <li key={i} className="personal" id="personal">
            {idToName(item.id)}
          </li>
        );
      }
    }
    return null;
  };

  const workToday = (d) => {
    const list = [];
    for (let i = 0; i < sked.length; i++) {
      const item = sked[i];
      if (isSameDay(item.date, d)) {
        list.push(
          <li key={i} className="call" id="call">
            {idToName(item.id) + " "}
            <span style={{ backgroundColor: item.colour }}>{item.name}</span>
          </li>
        );
      }
    }
    return list;
  };

  const noteToday = (d) => {
    const list = [];
    for (let i = 0; i < vNotes.length; i++) {
      const item = vNotes[i];
      if (isSameDay(item.date, d)) {
        list.push(
          <li key={i} className="note" id="note">
            {item.msg}
          </li>
        );
      }
    }
    if (testisadmin) {
      for (let i = 0; i < iNotes.length; i++) {
        const item = iNotes[i];
        if (isSameDay(item.date, d)) {
          list.push(
            <li key={-i - 1} className="note" id="iNote">
              {item.msg}
            </li>
          );
        }
      }
    }
    return list;
  };

  const numToday = (d, hasHoliday) => {
    if (!(numNotes && testisadmin)) return null;
    for (let i = 0; i < numNotes.length; i++) {
      const item = numNotes[i];
      if (isSameDay(item.date, d)) {
        const idVar = hasHoliday ? "num2" : "num";
        return (
          <span key={i} id={idVar}>
            {item.msg}
          </span>
        );
      }
    }
    return null;
  };

  const pendingToday = (d) => {
    for (let i = 0; i < pending.length; i++) {
      const p = pending[i];
      for (let n = 0; n < p.dates.length; n++) {
        if (isSameDay(p.dates[n], d)) {
          const name = idToName(Number(p.entryid));
          return p.maybe ? (
            <li key={i + n} className="maybe" id="maybe">
              {name}
            </li>
          ) : (
            <li key={i + n} className="pending" id="pending">
              {name}
            </li>
          );
        }
      }
    }
    return null;
  };

  const dayType = (d) => {
    if (type === "Personal") {
      return (
        <ul>
          {personalToday(d)}
          {pendingToday(d)}
        </ul>
      );
    }
    if (type === "Call") {
      return <ul>{callToday(d)}</ul>;
    }
    return (
      <ul>
        {workToday(d)}
        {noteToday(d)}
      </ul>
    );
  };

  //Map the weekdays as <td>
  const weekdaysElements = moment.weekdaysShort().map((day) => (
    <td key={day} className="week-day">
      {day}
    </td>
  ));

  // Leading blanks
  const blanks = Array.from({ length: firstDay }, (_, i) => (
    <td key={`blank-start-${i}`} className="emptySlot" />
  ));

  // Days in month
  const daysInMonthElements = Array.from({ length: daysInMonth }, (_, idx) => {
    const d = idx + 1;
    const holidayNode = holidayToday(d);
    const className = d === currentDay ? "day current-day" : "day";
    return (
      <td
        key={d}
        onClick={(e) => onDayClick && onDayClick(e, d)}
        className={className}
      >
        <div className="spacer">
          {holidayNode}
          {numToday(d, !!holidayNode)}
          <span className="text">{d}</span>
        </div>
        <hr />
        {dayType(d)}
      </td>
    );
  });

  // Trailing blanks to complete weeks
  const totalLen = blanks.length + daysInMonthElements.length;
  const pad = (7 - (totalLen % 7 || 7)) % 7;
  const extraBlanks = Array.from({ length: pad }, (_, i) => (
    <td key={`blank-end-${i}`} className="emptySlot" />
  ));

  const totalSlots = [...blanks, ...daysInMonthElements, ...extraBlanks];

  // Chunk into rows of 7
  const rows = [];
  for (let i = 0; i < totalSlots.length; i += 7) {
    rows.push(<tr key={`row-${i / 7}`}>{totalSlots.slice(i, i + 7)}</tr>);
  }

  return (
    <div className="calendar-container" style={style}>
      <table className="calendar">
        <tbody>
          <tr>{weekdaysElements}</tr>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
