import moment from "moment";
export function publishedBaseDate() {
  return moment([2020, 5, 1]); // Jun 1, 2020
}

export function lastPublishedMoment(publishedCount) {
  return publishedBaseDate().add(publishedCount, "month");
}

/**
 * Parse a date string in MM/DD/YYYY format and return numeric parts.
 */
export function parseMDYNumbers(dateStr) {
  const [m, d, y] = String(dateStr).split("/");
  return { monthNum: Number(m), dayNum: Number(d), yearNum: Number(y) };
}

/**
 * Check if a date string (MM/DD/YYYY) falls in the same month/year as dateContext.
 */
export function isSameMonthYear(dateStr, dateContext) {
  const { monthNum, yearNum } = parseMDYNumbers(dateStr);
  return (
    monthNum === Number(dateContext.format("M")) &&
    yearNum === Number(dateContext.format("YYYY"))
  );
}

/**
 * Check if a date string (MM/DD/YYYY) is the same month/year in dateContext and same day number.
 */
export function isSameMonthYearDay(dateStr, dateContext, day) {
  const { monthNum, yearNum, dayNum } = parseMDYNumbers(dateStr);
  return (
    monthNum === Number(dateContext.format("M")) &&
    yearNum === Number(dateContext.format("YYYY")) &&
    dayNum === Number(day)
  );
}
