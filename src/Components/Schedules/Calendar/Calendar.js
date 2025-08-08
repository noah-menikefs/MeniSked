import React, { useState } from "react";
import moment from "moment";
import "./Calendar.css";

moment().format();

const Calendar = (props) => {
  const [style] = useState(props.style || {});

  const weekdaysShort = moment.weekdaysShort(); //List of shortened days

  const daysInMonth = () => {
    return props.dateContext.daysInMonth();
  };

  const currentDay = () => {
    return props.dateContext.format("D");
  };

  const firstDayofMonth = () => {
    let dateContext = props.dateContext;
    let firstDay = moment(dateContext).startOf("month").format("d"); //Day of week 0-6
    return firstDay;
  };

  const onDayClick = (e, day) => {
    props.onDayClick && props.onDayClick(e, day);
  };

  const dayType = (d) => {
    const { type } = props;
    if (type === "Personal") {
      return (
        <ul>
          {personalToday(d)}
          {pendingToday(d)}
        </ul>
      );
    } else if (type === "Call") {
      return <ul>{callToday(d)}</ul>;
    } else {
      return (
        <ul>
          {workToday(d)}
          {noteToday(d)}
        </ul>
      );
    }
  };

  const holidayToday = (d) => {
    const arr = [...props.holiDays];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].day === d) {
        return <span id="holiday">{arr[i].name}</span>;
      }
    }
  };

  const callToday = (d) => {
    const arr = [...props.callSked];
    const { dateContext } = props;
    let list = [];
    for (let i = 0; i < arr.length; i++) {
      const splitArr = arr[i].date.split("/");
      if (
        splitArr[0] === dateContext.format("MM") &&
        parseInt(splitArr[1], 10) === d &&
        splitArr[2] === dateContext.format("YYYY")
      ) {
        list.push(
          <li key={i} className="call" id="call">
            {idToName(arr[i].id) + " "}
            <span style={{ backgroundColor: arr[i].colour }}>
              {arr[i].name}
            </span>
          </li>
        );
      }
    }
    return list;
  };

  const personalToday = (d) => {
    const arr = [...props.personalDays];
    const { dateContext } = props;
    for (let i = 0; i < arr.length; i++) {
      const splitArr = arr[i].date.split("/");
      if (
        splitArr[0] === dateContext.format("MM") &&
        parseInt(splitArr[1], 10) === d &&
        splitArr[2] === dateContext.format("YYYY")
      ) {
        return (
          <li key={i} className="personal" id="personal">
            {idToName(arr[i].id)}
          </li>
        );
      }
    }
  };

  const workToday = (d) => {
    const arr = [...props.sked];
    const { dateContext } = props;
    let list = [];
    for (let i = 0; i < arr.length; i++) {
      const splitArr = arr[i].date.split("/");
      if (
        splitArr[0] === dateContext.format("MM") &&
        parseInt(splitArr[1], 10) === d &&
        splitArr[2] === dateContext.format("YYYY")
      ) {
        list.push(
          <li key={i} className="call" id="call">
            {idToName(arr[i].id) + " "}
            <span style={{ backgroundColor: arr[i].colour }}>
              {arr[i].name}
            </span>
          </li>
        );
      }
    }
    return list;
  };

  const noteToday = (d) => {
    const arr = [...props.vNotes];
    const { dateContext, testisadmin } = props;
    let list = [];
    for (let i = 0; i < arr.length; i++) {
      const splitArr = arr[i].date.split("/");
      if (
        splitArr[0] === dateContext.format("MM") &&
        parseInt(splitArr[1], 10) === d &&
        splitArr[2] === dateContext.format("YYYY")
      ) {
        list.push(
          <li key={i} className="note" id="note">
            {arr[i].msg}
          </li>
        );
      }
    }

    if (testisadmin) {
      const arr2 = [...props.iNotes];
      for (let i = 0; i < arr2.length; i++) {
        const splitArr2 = arr2[i].date.split("/");
        if (
          splitArr2[0] === dateContext.format("MM") &&
          parseInt(splitArr2[1], 10) === d &&
          splitArr2[2] === dateContext.format("YYYY")
        ) {
          list.push(
            <li key={-i - 1} className="note" id="iNote">
              {arr2[i].msg}
            </li>
          );
        }
      }
    }
    return list;
  };

  const numToday = (d, id) => {
    const { numNotes, testisadmin, dateContext } = props;
    if (numNotes && testisadmin) {
      let idVar = "num";
      const arr = [...numNotes];
      for (let i = 0; i < arr.length; i++) {
        const splitArr = arr[i].date.split("/");
        if (
          splitArr[0] === dateContext.format("MM") &&
          parseInt(splitArr[1], 10) === d &&
          splitArr[2] === dateContext.format("YYYY")
        ) {
          if (id) {
            idVar = "num2";
          }
          return (
            <span key={i} id={idVar}>
              {arr[i].msg}
            </span>
          );
        }
      }
    }
  };

  const idToName = (id) => {
    const { callList, entries } = props;
    for (let n = 0; n < callList.length; n++) {
      if (callList[n].id === id) {
        return callList[n].name;
      }
    }
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].id === id) {
        return entries[i].name;
      }
    }
  };

  const pendingToday = (d) => {
    const arr = [...props.pending];
    const { dateContext } = props;
    for (let i = 0; i < arr.length; i++) {
      for (let n = 0; n < arr[i].dates.length; n++) {
        const splitArr = arr[i].dates[n].split("/");
        if (
          splitArr[0] === dateContext.format("MM") &&
          parseInt(splitArr[1], 10) === d &&
          splitArr[2] === dateContext.format("YYYY")
        ) {
          if (arr[i].maybe) {
            return (
              <li key={i + n} className="maybe" id="maybe">
                {idToName(parseInt(arr[i].entryid, 10))}
              </li>
            );
          } else {
            return (
              <li key={i + n} className="pending" id="pending">
                {idToName(parseInt(arr[i].entryid, 10))}
              </li>
            );
          }
        }
      }
    }
  };

  //Map the weekdays as <td>
  let weekdaysElements = weekdaysShort.map((day) => {
    return (
      <td key={day} className="week-day">
        {day}
      </td>
    );
  });

  let blanks = [];
  for (let i = 0; i < firstDayofMonth(); i++) {
    blanks.push(
      <td key={i * 80} className="emptySlot">
        {" "}
      </td>
    );
  }

  let daysInMonthElements = [];
  for (let d = 1; d <= daysInMonth(); d++) {
    let id = holidayToday(d);
    let className = d === currentDay() ? "day current-day" : "day";
    daysInMonthElements.push(
      <td
        key={d}
        onClick={(e) => {
          onDayClick(e, d);
        }}
        className={className}
      >
        <div className="spacer">
          {id}
          {numToday(d, id)}
          <span className="text">{d}</span>
        </div>
        <hr />
        {dayType(d)}
      </td>
    );
  }

  let len = blanks.length + daysInMonthElements.length;

  let extraBlanks = [];

  while (len % 7 !== 0) {
    len++;
    extraBlanks.push(
      <td key={len} className="emptySlot">
        {" "}
      </td>
    );
  }

  var totalSlots = [...blanks, ...daysInMonthElements, ...extraBlanks];
  let rows = [];
  let cells = [];

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row);
    } else {
      let insertRow = cells.slice();
      rows.push(insertRow);
      cells = [];
      cells.push(row);
    }
    if (i === totalSlots.length - 1) {
      let insertRow = cells.slice();
      rows.push(insertRow);
    }
  });

  let trElements = rows.map((d, i) => {
    return <tr key={i * 100}>{d}</tr>;
  });

  return (
    <div className="calendar-container" style={style}>
      <table className="calendar">
        <tbody>
          <tr>{weekdaysElements}</tr>
          {trElements}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
