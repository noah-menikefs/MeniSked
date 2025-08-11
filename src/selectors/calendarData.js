import React from "react";
import { idToNameFromLists } from "../utils/scheduleUtils";

export function buildCallMonthDays({
  dateContext,
  holiDays = [],
  callSked = [],
  callList = [],
}) {
  const monthNum = Number(dateContext.format("M"));
  const yearNum = Number(dateContext.format("YYYY"));

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
    const [m, dStr, y] = String(date).split("/");
    const d = Number(dStr);
    if (Number(m) === monthNum && Number(y) === yearNum) {
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
  const monthNum = Number(dateContext.format("M"));
  const yearNum = Number(dateContext.format("YYYY"));

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
    if (Number(m) === monthNum && Number(y) === yearNum) {
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
      if (Number(m) === monthNum && Number(y) === yearNum) {
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
  const monthNum = Number(dateContext.format("M"));
  const yearNum = Number(dateContext.format("YYYY"));

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
    if (Number(m) === monthNum && Number(y) === yearNum) {
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
    if (Number(m) === monthNum && Number(y) === yearNum) {
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
      if (Number(m) === monthNum && Number(y) === yearNum) {
        ensureDay(d).contentItems.push(
          <li key={`in-${i}`} className="note" id="iNote">
            {n.msg}
          </li>
        );
      }
    });

    numNotes.forEach((n) => {
      const [m, dStr, y] = String(n.date).split("/");
      const d = Number(dStr);
      if (Number(m) === monthNum && Number(y) === yearNum) {
        const item = ensureDay(d);
        if (!item.numberNote) item.numberNote = n.msg;
      }
    });
  }

  return Array.from(daysMap.values());
}
