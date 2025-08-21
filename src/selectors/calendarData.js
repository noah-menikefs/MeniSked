import React from "react";
import { idToNameFromLists } from "../utils/scheduleUtils";
import { isSameMonthYear, parseMDYNumbers } from "../utils/date";
import AssignmentItem from "../Components/Schedules/CalendarItems/AssignmentItem";
import NoteItem from "../Components/Schedules/CalendarItems/NoteItem";

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
  onEditNote = null,
  onDeleteNote = null,
}) {
  const daysMap = new Map();
  const ensureDay = (d) => {
    if (!daysMap.has(d))
      daysMap.set(d, {
        day: d,
        contentItems: [],
        assignments: [],
        notes: [],
        holidayName: null,
        numberNote: null,
      });
    return daysMap.get(d);
  };

  for (const h of holiDays) {
    const item = ensureDay(h.day);
    item.holidayName = h.name;
  }

  sked.forEach((item, i) => {
    if (isSameMonthYear(item.date, dateContext)) {
      const { dayNum: d } = parseMDYNumbers(item.date);
      const dayItem = ensureDay(d);
      const assignmentElement = (
        <AssignmentItem
          key={`s-${i}`}
          item={item}
          index={i}
          callList={callList}
          entryList={entryList}
        />
      );
      dayItem.contentItems.push(assignmentElement);
      dayItem.assignments.push(assignmentElement);
    }
  });

  vNotes.forEach((n, i) => {
    if (isSameMonthYear(n.date, dateContext)) {
      const { dayNum: d } = parseMDYNumbers(n.date);
      const dayItem = ensureDay(d);
      const noteElement = (
        <NoteItem
          key={`vn-${i}`}
          note={n}
          index={i}
          type="vn"
          isAdmin={isAdmin}
          onEditNote={onEditNote}
          onDeleteNote={onDeleteNote}
        />
      );
      dayItem.contentItems.push(noteElement);
      dayItem.notes.push(noteElement);
    }
  });

  // Invisible notes only visible to admins
  if (isAdmin) {
    iNotes.forEach((n, i) => {
      if (isSameMonthYear(n.date, dateContext)) {
        const { dayNum: d } = parseMDYNumbers(n.date);
        const dayItem = ensureDay(d);
        const noteElement = (
          <NoteItem
            key={`in-${i}`}
            note={n}
            index={i}
            type="in"
            isAdmin={isAdmin}
            onEditNote={onEditNote}
            onDeleteNote={onDeleteNote}
          />
        );
        dayItem.contentItems.push(noteElement);
        dayItem.notes.push(noteElement);
      }
    });

    numNotes.forEach((n, i) => {
      if (isSameMonthYear(n.date, dateContext)) {
        const { dayNum: d } = parseMDYNumbers(n.date);
        const dayItem = ensureDay(d);

        // Store the number note message for backward compatibility
        if (!dayItem.numberNote) dayItem.numberNote = n.msg;

        // Add the number note to the notes array so it appears in the modal
        const noteElement = (
          <NoteItem
            key={`nn-${i}`}
            note={n}
            index={i}
            type="nn"
            isAdmin={isAdmin}
            onEditNote={onEditNote}
            onDeleteNote={onDeleteNote}
          />
        );
        dayItem.contentItems.push(noteElement);
        dayItem.notes.push(noteElement);
      }
    });
  }

  return Array.from(daysMap.values());
}
