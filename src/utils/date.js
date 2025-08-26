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

/**
 * Check if two date strings represent consecutive days.
 * Dates are in MM/DD/YYYY format.
 */
export function isConsecutive(date1, date2) {
  const moment1 = moment(date1, "MM/D/YYYY");
  const moment2 = moment(date2, "MM/D/YYYY");

  // Check if the second date is exactly one day after the first
  return moment2.diff(moment1, "days") === 1;
}

/**
 * Find all consecutive date ranges in an array of date strings.
 * Returns an array of arrays, where each inner array contains consecutive dates.
 * Dates are in MM/DD/YYYY format.
 */
export function findConsecutiveDateRanges(dates) {
  if (!dates || dates.length === 0) return [];

  // Convert to moment objects and sort chronologically
  const sortedMoments = dates
    .map((date) => moment(date, "MM/D/YYYY"))
    .sort((a, b) => a.diff(b));

  const ranges = [];
  let currentRange = [sortedMoments[0].format("MM/D/YYYY")];

  for (let i = 1; i < sortedMoments.length; i++) {
    const current = sortedMoments[i];
    const previous = sortedMoments[i - 1];

    if (current.diff(previous, "days") === 1) {
      // Consecutive day, add to current range
      currentRange.push(current.format("MM/D/YYYY"));
    } else {
      // Non-consecutive, save current range and start new one
      if (currentRange.length > 0) {
        ranges.push([...currentRange]);
      }
      currentRange = [current.format("MM/D/YYYY")];
    }
  }

  // Don't forget the last range
  if (currentRange.length > 0) {
    ranges.push([...currentRange]);
  }

  return ranges;
}

/**
 * Consolidate an array of date strings by combining consecutive dates into ranges.
 * Returns an array where consecutive dates are grouped together.
 * Dates are in MM/DD/YYYY format.
 */
export function consolidateDateArrays(dates) {
  if (!dates || dates.length === 0) return [];

  const consecutiveRanges = findConsecutiveDateRanges(dates);
  const consolidated = [];

  consecutiveRanges.forEach((range) => {
    if (range.length === 1) {
      // Single date, add as is
      consolidated.push(range[0]);
    } else {
      // Consecutive range, add as a group
      consolidated.push(range);
    }
  });

  return consolidated;
}

/**
 * Check if adding a new date would create or extend a consecutive sequence.
 * Returns true if the new date would connect with existing dates.
 * Dates are in MM/DD/YYYY format.
 */
export function wouldCreateConsecutiveSequence(existingDates, newDate) {
  if (!existingDates || existingDates.length === 0) return false;

  const allDates = [...existingDates, newDate];
  const ranges = findConsecutiveDateRanges(allDates);

  // If we have fewer ranges than dates, it means some dates were consolidated
  return ranges.some((range) => range.length > 1);
}

/**
 * Find the optimal consolidation strategy for a new date with existing dates.
 * Returns an object with consolidation recommendations.
 * Dates are in MM/DD/YYYY format.
 */
export function findOptimalConsolidation(existingDates, newDate) {
  if (!existingDates || existingDates.length === 0) {
    return {
      shouldConsolidate: false,
      newDateRanges: [newDate],
      datesToRemove: [],
      datesToUpdate: [],
    };
  }

  const allDates = [...existingDates, newDate];
  const ranges = findConsecutiveDateRanges(allDates);

  // Find which range contains the new date
  let newDateRange = null;
  let otherRanges = [];

  ranges.forEach((range) => {
    if (range.includes(newDate)) {
      newDateRange = range;
    } else {
      otherRanges.push(range);
    }
  });

  if (!newDateRange || newDateRange.length === 1) {
    // No consolidation possible
    return {
      shouldConsolidate: false,
      newDateRanges: [newDate],
      datesToRemove: [],
      datesToUpdate: [],
    };
  }

  // Consolidation is possible
  return {
    shouldConsolidate: true,
    newDateRanges: [newDateRange, ...otherRanges],
    datesToRemove: existingDates.filter((date) => !newDateRange.includes(date)),
    datesToUpdate: newDateRange.filter((date) => date !== newDate),
  };
}
