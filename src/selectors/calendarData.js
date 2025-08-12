import React from "react";
import { idToNameFromLists } from "../utils/scheduleUtils";
import { isSameMonthYear, parseMDYNumbers } from "../utils/date";

export function buildCallMonthDays({
  dateContext,
  holiDays = [],
  callSked = [],
  callList = [],
}) {
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

  // Call assignments
  for (let i = 0; i < callSked.length; i++) {
    const { date, id, colour, name } = callSked[i];
    if (isSameMonthYear(date, dateContext)) {
      const { dayNum: d } = parseMDYNumbers(date);
      const item = ensureDay(d);
      item.contentItems.push(
        <li key={`c-${i}`} className="call" id="call">
          {idToNameFromLists(callList, [], id) + " "}
          <span style={{ backgroundColor: colour }}>{name}</span>
        </li>
      );
    }
  }

  return Array.from(daysMap.values());
}

export function buildPersonalMonthDays({
  dateContext,
  holiDays = [],
  personalDays = [],
  pending = [],
  callList = [],
  entryList = [],
}) {
  const daysMap = new Map();
  const ensureDay = (d) => {
    if (!daysMap.has(d)) daysMap.set(d, { day: d, contentItems: [] });
    return daysMap.get(d);
  };

  for (const h of holiDays) {
    const item = ensureDay(h.day);
    item.holidayName = h.name;
  }

  personalDays.forEach((pd, i) => {
    if (isSameMonthYear(pd.date, dateContext)) {
      const { dayNum: d } = parseMDYNumbers(pd.date);
      const name = idToNameFromLists(callList, entryList, pd.id);
      ensureDay(d).contentItems.push(
        <li key={`pd-${i}`} className="personal" id="personal">
          {name}
        </li>
      );
    }
  });

  pending.forEach((p, i) => {
    for (let n = 0; n < p.dates.length; n++) {
      const dateStr = p.dates[n];
      if (isSameMonthYear(dateStr, dateContext)) {
        const { dayNum: d } = parseMDYNumbers(dateStr);
        const name = idToNameFromLists(callList, entryList, Number(p.entryid));
        ensureDay(d).contentItems.push(
          p.maybe ? (
            <li key={`pm-${i}-${n}`} className="maybe" id="maybe">
              {name}
            </li>
          ) : (
            <li key={`pp-${i}-${n}`} className="pending" id="pending">
              {name}
            </li>
          )
        );
      }
    }
  });

  return Array.from(daysMap.values());
}

export function buildPublishedMonthDays({
  dateContext,
  holiDays = [],
  sked = [],
  iNotes = [],
  vNotes = [],
  numNotes = [],
  callList = [],
  entryList = [],
  isAdmin = false,
}) {
  const daysMap = new Map();
  const ensureDay = (d) => {
    if (!daysMap.has(d)) daysMap.set(d, { day: d, contentItems: [] });
    return daysMap.get(d);
  };

  for (const h of holiDays) {
    const item = ensureDay(h.day);
    item.holidayName = h.name;
  }

  sked.forEach((item, i) => {
    if (isSameMonthYear(item.date, dateContext)) {
      const { dayNum: d } = parseMDYNumbers(item.date);
      ensureDay(d).contentItems.push(
        <li key={`s-${i}`} className="call" id="call">
          {idToNameFromLists(callList, entryList, item.id) + " "}
          <span style={{ backgroundColor: item.colour }}>{item.name}</span>
        </li>
      );
    }
  });

  vNotes.forEach((n, i) => {
    if (isSameMonthYear(n.date, dateContext)) {
      const { dayNum: d } = parseMDYNumbers(n.date);
      ensureDay(d).contentItems.push(
        <li key={`vn-${i}`} className="note" id="note">
          {n.msg}
        </li>
      );
    }
  });

  // Invisible notes only visible to admins
  if (isAdmin) {
    iNotes.forEach((n, i) => {
      if (isSameMonthYear(n.date, dateContext)) {
        const { dayNum: d } = parseMDYNumbers(n.date);
        ensureDay(d).contentItems.push(
          <li key={`in-${i}`} className="note" id="iNote">
            {n.msg}
          </li>
        );
      }
    });

    numNotes.forEach((n) => {
      if (isSameMonthYear(n.date, dateContext)) {
        const { dayNum: d } = parseMDYNumbers(n.date);
        const item = ensureDay(d);
        if (!item.numberNote) item.numberNote = n.msg;
      }
    });
  }

  return Array.from(daysMap.values());
}
