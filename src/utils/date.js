/**
 * Parse a date string in MM/DD/YYYY format.
 */
export function parseMDY(dateStr) {
  const [month, day, year] = String(dateStr).split("/");
  return { month, day: Number(day), year };
}

/**
 * Compare a date string (MM/DD/YYYY) to a given target month/year/day.
 */
export function isSameDay(dateStr, { monthStr, yearStr }, day) {
  const { month, day: d, year } = parseMDY(dateStr);
  return month === monthStr && year === yearStr && d === day;
}
