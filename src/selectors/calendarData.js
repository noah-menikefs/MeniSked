import React from "react";
import { idToNameFromLists } from "../utils/scheduleUtils";

export function buildCallMonthDays({
  dateContext,
  holiDays = [],
  callSked = [],
  callList = [],
}) {
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

  // Call assignments
  for (let i = 0; i < callSked.length; i++) {
    const { date, id, colour, name } = callSked[i];
    const [m, dStr, y] = date.split("/");
    const d = Number(dStr);
    if (m === monthStr && y === yearStr) {
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
  const monthStr = dateContext.format("MM");
  const yearStr = dateContext.format("YYYY");

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
    const [m, dStr, y] = String(pd.date).split("/");
    const d = Number(dStr);
    if (m === monthStr && y === yearStr) {
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
      const [m, dStr, y] = String(p.dates[n]).split("/");
      const d = Number(dStr);
      if (m === monthStr && y === yearStr) {
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
  const monthStr = dateContext.format("MM");
  const yearStr = dateContext.format("YYYY");

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
    const [m, dStr, y] = String(item.date).split("/");
    const d = Number(dStr);
    if (m === monthStr && y === yearStr) {
      ensureDay(d).contentItems.push(
        <li key={`s-${i}`} className="call" id="call">
          {idToNameFromLists(callList, entryList, item.id) + " "}
          <span style={{ backgroundColor: item.colour }}>{item.name}</span>
        </li>
      );
    }
  });

  vNotes.forEach((n, i) => {
    const [m, dStr, y] = String(n.date).split("/");
    const d = Number(dStr);
    if (m === monthStr && y === yearStr) {
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
      const [m, dStr, y] = String(n.date).split("/");
      const d = Number(dStr);
      if (m === monthStr && y === yearStr) {
        ensureDay(d).contentItems.push(
          <li key={`in-${i}`} className="note" id="iNote">
            {n.msg}
          </li>
        );
      }
    });

    const numByDay = new Map();
    numNotes.forEach((n) => {
      const [m, dStr, y] = String(n.date).split("/");
      const d = Number(dStr);
      if (m === monthStr && y === yearStr) numByDay.set(d, n.msg);
    });
    for (const [d, msg] of numByDay.entries()) {
      const item = ensureDay(d);
      item.numberNote = msg;
    }
  }

  return Array.from(daysMap.values());
}
