import React, { useMemo } from "react";
import moment from "moment";
import "./Calendar.css";

/**
 * Dumb calendar grid component. Renders a month view from pre-digested props.
 *
 * Props:
 * - year: number (YYYY)
 * - monthIndex: number (0-11)
 * - onDayClick: (day: number) => void
 * - days: Array<{ day: number, holidayName?: string, numberNote?: string, contentItems?: React.ReactNode[] }>
 * - style?: React.CSSProperties
 */
const CalendarGrid = ({
  year,
  monthIndex,
  onDayClick,
  days = [],
  style = {},
}) => {
  const { firstDay, daysInMonth } = useMemo(() => {
    const ctx = moment({ year, month: monthIndex, day: 1 });
    return {
      firstDay: Number(ctx.startOf("month").format("d")),
      daysInMonth: ctx.daysInMonth(),
    };
  }, [year, monthIndex]);

  const dayMap = useMemo(() => {
    const map = new Map();
    for (const d of days) {
      map.set(d.day, d);
    }
    return map;
  }, [days]);

  const weekdays = moment.weekdaysShort();

  const weekdayCells = weekdays.map((w) => (
    <td key={w} className="week-day">
      {w}
    </td>
  ));

  const blanks = Array.from({ length: firstDay }, (_, i) => (
    <td key={`blank-start-${i}`} className="emptySlot" />
  ));

  const dayCells = Array.from({ length: daysInMonth }, (_, idx) => {
    const d = idx + 1;
    const data = dayMap.get(d) || {};
    const hasHoliday = Boolean(data.holidayName);
    return (
      <td key={d} onClick={() => onDayClick(d)} className="day">
        <div className="spacer">
          {hasHoliday ? <span id="holiday">{data.holidayName}</span> : null}
          {data.numberNote ? (
            <span id={hasHoliday ? "num2" : "num"}>{data.numberNote}</span>
          ) : null}
          <span className="text">{d}</span>
        </div>
        <hr />
        <ul>{data.contentItems}</ul>
      </td>
    );
  });

  const totalLen = blanks.length + dayCells.length;
  const pad = (7 - (totalLen % 7 || 7)) % 7;
  const tail = Array.from({ length: pad }, (_, i) => (
    <td key={`blank-end-${i}`} className="emptySlot" />
  ));

  const slots = [...blanks, ...dayCells, ...tail];
  const rows = [];
  for (let i = 0; i < slots.length; i += 7) {
    rows.push(<tr key={`row-${i / 7}`}>{slots.slice(i, i + 7)}</tr>);
  }

  return (
    <div className="calendar-container" style={style}>
      <table className="calendar">
        <tbody>
          <tr>{weekdayCells}</tr>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

export default CalendarGrid;
