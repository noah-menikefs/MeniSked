import { useEffect, useState } from "react";

/**
 * Computes holidays for the current dateContext when holiday data is available.
 *
 * Params:
 * - dateContext: moment instance for current view
 * - nrHolidayList: non-recurring holiday list (array) used to know readiness
 * - processHolidaysForDate: function(moment) => [{ day, name }]
 */
export default function useHolidays({
  dateContext,
  nrHolidayList,
  processHolidaysForDate,
}) {
  const [holiDays, setHoliDays] = useState([]);

  useEffect(() => {
    if (nrHolidayList && nrHolidayList.length > 0 && dateContext) {
      const arr = processHolidaysForDate(dateContext);
      setHoliDays(arr || []);
    }
  }, [dateContext, nrHolidayList, processHolidaysForDate]);

  return holiDays;
}
