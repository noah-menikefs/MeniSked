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
