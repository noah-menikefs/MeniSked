import { useCallback, useMemo, useState } from "react";
import moment from "moment";
import { publishedBaseDate } from "../utils/date";

/**
 * Navigation hook for month/year calendar views with date bounds.
 *
 * Params:
 * - initialDate: moment instance or value accepted by moment()
 * - minDate?: minimum allowed date (inclusive, month-level)
 * - maxDate?: maximum allowed date (inclusive, month-level)
 * - onChange?: optional callback(newMoment) invoked after navigation changes
 */
export default function useCalendarNavigation({
  initialDate,
  minDate = publishedBaseDate(),
  maxDate,
  onChange,
}) {
  const [dateContext, setDateContext] = useState(() => moment(initialDate));

  const months = useMemo(() => moment.months(), []);

  const withinBounds = useCallback(
    (ctx) => {
      if (minDate && moment(ctx).isBefore(minDate, "month")) return false;
      if (maxDate && moment(ctx).isAfter(maxDate, "month")) return false;
      return true;
    },
    [minDate, maxDate]
  );

  const emitChange = useCallback(
    (nextCtx) => {
      if (!withinBounds(nextCtx)) {
        return;
      }
      setDateContext(nextCtx);
      if (onChange) onChange(nextCtx);
    },
    [onChange, withinBounds]
  );

  const setMonth = useCallback(
    (month) => {
      const monthIndex =
        typeof month === "number" ? month : months.indexOf(String(month));
      if (monthIndex < 0) return;
      const next = moment(dateContext).set("month", monthIndex);
      emitChange(next);
    },
    [dateContext, months, emitChange]
  );

  const setYear = useCallback(
    (year) => {
      const y = Number(year);
      const next = moment(dateContext).set("year", y);
      emitChange(next);
    },
    [dateContext, emitChange]
  );

  const nextMonth = useCallback(() => {
    const next = moment(dateContext).add(1, "month");
    emitChange(next);
  }, [dateContext, emitChange]);

  const prevMonth = useCallback(() => {
    const next = moment(dateContext).subtract(1, "month");
    emitChange(next);
  }, [dateContext, emitChange]);

  const nextYear = useCallback(() => {
    const next = moment(dateContext).add(1, "year");
    emitChange(next);
  }, [dateContext, emitChange]);

  const prevYear = useCallback(() => {
    const next = moment(dateContext).subtract(1, "year");
    emitChange(next);
  }, [dateContext, emitChange]);

  const reset = useCallback(() => {
    const next = moment(initialDate);
    emitChange(next);
  }, [initialDate, emitChange]);

  return {
    dateContext,
    // direct setter exposed for rare cases like setting day within the same month
    setDateContext,
    setMonth,
    setYear,
    nextMonth,
    prevMonth,
    nextYear,
    prevYear,
    reset,
  };
}
