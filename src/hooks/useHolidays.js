import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectRHolidayList,
  selectNrHolidayList,
} from "../store/slices/holidaySlice";

/**
 * Custom hook for managing holiday display
 * @param {Object} dateContext - Moment.js date object
 * @returns {Array} Array of holiday objects with day and name
 */
export default function useHolidays({ dateContext }) {
  const [holiDays, setHoliDays] = useState([]);

  // Get holiday data directly from Redux
  const rHolidayList = useSelector(selectRHolidayList);
  const nrHolidayList = useSelector(selectNrHolidayList);

  useEffect(() => {
    if (!dateContext || !nrHolidayList?.length) {
      setHoliDays([]);
      return;
    }

    const targetMonth = dateContext.format("MM"); // Always 2 digits
    const targetYear = dateContext.format("YYYY");
    const targetMonthName = dateContext.format("MMMM");

    const processedHolidays = [];

    // Process non-regular holidays
    nrHolidayList.forEach((nholiday) => {
      if (!nholiday.eventsked?.length) return;

      nholiday.eventsked.forEach((dateString) => {
        // Normalize date string to handle DD vs D and MM vs M
        const normalizedDate = normalizeDateString(dateString);

        if (
          normalizedDate.month === targetMonth &&
          normalizedDate.year === targetYear
        ) {
          processedHolidays.push({
            day: normalizedDate.day,
            name: nholiday.name,
          });
        }
      });
    });

    // Process regular holidays
    rHolidayList.forEach((holiday) => {
      if (holiday.month === targetMonthName) {
        processedHolidays.push({
          day: holiday.day,
          name: holiday.name,
        });
      }
    });

    setHoliDays(processedHolidays);
  }, [dateContext, nrHolidayList, rHolidayList]);

  return holiDays;
}

/**
 * Normalize date string to handle different formats (DD vs D, MM vs M)
 * @param {string} dateString - Date string in format "MM/DD/YYYY" or "M/D/YYYY"
 * @returns {Object} Normalized date object with month, day, year
 */
function normalizeDateString(dateString) {
  const parts = dateString.split("/");
  const [month, day, year] = parts;

  // Only normalize month to 2 digits, leave day as-is
  const normalizedMonth = month.padStart(2, "0");

  return {
    month: normalizedMonth,
    day: parseInt(day, 10),
    year: year,
  };
}
