import { useCallback, useMemo, useState } from "react";
import moment from "moment";

/**
 * Navigation hook for month/year calendar views with simple year bounds.
 *
 * Params:
 * - initialDate: moment instance or value accepted by moment()
 * - minYear: minimum allowed calendar year (inclusive)
 * - maxYear: maximum allowed calendar year (inclusive)
 * - onChange?: optional callback(newMoment) invoked after navigation changes
 */
export default function useCalendarNavigation({
  initialDate,
  minYear = 2020,
  maxYear,
  onChange,
}) {
  const [dateContext, setDateContext] = useState(() => moment(initialDate));

  const months = useMemo(() => moment.months(), []);

  const withinBounds = useCallback(
    (ctx) => {
      const y = ctx.year();
      if (typeof minYear === "number" && y < minYear) return false;
      if (typeof maxYear === "number" && y > maxYear) return false;
      return true;
    },
    [minYear, maxYear]
  );

  const emitChange = useCallback(
    (nextCtx) => {
      if (onChange) onChange(nextCtx);
    },
    [onChange]
  );

  const setMonth = useCallback(
    (month) => {
      const monthIndex =
        typeof month === "number" ? month : months.indexOf(String(month));
      if (monthIndex < 0) return;
      const next = moment(dateContext).set("month", monthIndex);
      if (!withinBounds(next)) return;
      setDateContext(next);
      emitChange(next);
    },
    [dateContext, months, withinBounds, emitChange]
  );

  const setYear = useCallback(
    (year) => {
      const y = Number(year);
      const next = moment(dateContext).set("year", y);
      if (!withinBounds(next)) return;
      setDateContext(next);
      emitChange(next);
    },
    [dateContext, withinBounds, emitChange]
  );

  const nextMonth = useCallback(() => {
    const next = moment(dateContext).add(1, "month");
    if (!withinBounds(next)) return;
    setDateContext(next);
    emitChange(next);
  }, [dateContext, withinBounds, emitChange]);

  const prevMonth = useCallback(() => {
    const next = moment(dateContext).subtract(1, "month");
    if (!withinBounds(next)) return;
    setDateContext(next);
    emitChange(next);
  }, [dateContext, withinBounds, emitChange]);

  const nextYear = useCallback(() => {
    const next = moment(dateContext).add(1, "year");
    if (!withinBounds(next)) return;
    setDateContext(next);
    emitChange(next);
  }, [dateContext, withinBounds, emitChange]);

  const prevYear = useCallback(() => {
    const next = moment(dateContext).subtract(1, "year");
    if (!withinBounds(next)) return;
    setDateContext(next);
    emitChange(next);
  }, [dateContext, withinBounds, emitChange]);

  const reset = useCallback(() => {
    const next = moment(initialDate);
    if (!withinBounds(next)) return;
    setDateContext(next);
    emitChange(next);
  }, [initialDate, withinBounds, emitChange]);

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
