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
 * Check if a date string (M/D/YYYY or MM/D/YYYY) falls in the same month/year as dateContext.
 */
export function isSameMonthYear(dateStr, dateContext) {
  if (!dateStr) return false;
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

/**
 * Normalize a date string to handle both M/D/YYYY and MM/D/YYYY formats.
 * Returns the date in MM/D/YYYY format for consistent comparison.
 * Also removes leading zeros from day for extra security.
 */
export function normalizeDateStringForComparison(dateStr) {
  if (!dateStr) return dateStr;
  const [month, day, year] = String(dateStr).split("/");
  return `${month.padStart(2, "0")}/${parseInt(day, 10)}/${year}`;
}

/**
 * Check if two date strings represent the same date, handling both M/D/YYYY and MM/D/YYYY formats.
 */
export function isSameDate(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return false;
  return (
    normalizeDateStringForComparison(dateStr1) ===
    normalizeDateStringForComparison(dateStr2)
  );
}

/**
 * Find a date in an array that matches the target date, handling both formats.
 * Returns the original date string from the array if found, or null if not found.
 */
export function findMatchingDate(targetDate, dateArray) {
  if (!targetDate || !dateArray) return null;
  const normalizedTarget = normalizeDateStringForComparison(targetDate);

  for (const date of dateArray) {
    if (normalizeDateStringForComparison(date) === normalizedTarget) {
      return date; // Return the original format from the array
    }
  }
  return null;
}
