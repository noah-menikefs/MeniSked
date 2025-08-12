import { useMemo } from "react";

// Accepts a moment-like dateContext and returns memoized formatted strings
export default function useFormattedDateContext(dateContext) {
  return useMemo(() => {
    const monthLong = dateContext.format("MMMM");
    const monthShort = dateContext.format("MMM");
    const monthNumberTwoDigit = dateContext.format("MM");
    const year = dateContext.format("Y");
    const yearFull = dateContext.format("YYYY");
    const currentDayTwoDigit = dateContext.format("DD");

    const formatMonthYear = () => `${monthLong} ${year}`;
    const formatTitleForDay = (day) => `${monthLong} ${day} ${year}`;
    const formatTitleForDayPadded = (day) =>
      `${monthLong} ${String(day).padStart(2, "0")}, ${yearFull}`;

    return {
      monthLong,
      monthShort,
      monthNumberTwoDigit,
      year,
      yearFull,
      currentDayTwoDigit,
      formatMonthYear,
      formatTitleForDay,
      formatTitleForDayPadded,
    };
  }, [dateContext]);
}
