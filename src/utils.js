export const validateEmail = (str) => {
  const [local, domain] = str.split("@");
  if (!domain) return false;
  // eslint-disable-next-line no-unused-vars
  const [_, tld] = domain.split(".");
  return local?.length > 0 && tld?.length > 0;
};

export const dateStyler = (dates) => {
  if (dates.length === 1) {
    const [month, day, year] = dates[0].split("/");
    return `on ${this.months[month - 1]} ${day}, ${year}`;
  }

  // Normalize single-digit days to two digits (e.g., 4/1/2023 → 4/01/2023)
  const normalizedDates = dates.map((date) => {
    const parts = date.split("/");
    if (parts[1].length === 1) {
      parts[1] = "0" + parts[1];
    }
    return parts.join("/");
  });

  // Sort by day (MM/DD/YYYY → compare DD as integer)
  const sortedDates = [...normalizedDates].sort(
    (a, b) => parseInt(a.substring(3, 5), 10) - parseInt(b.substring(3, 5), 10)
  );

  const parsedDates = sortedDates.map((date) => date.split("/")); // [[MM, DD, YYYY], ...]

  // Check if the dates form a continuous range (same month/year, days incrementing by 1)
  const isRange = parsedDates.every((curr, idx, arr) => {
    if (idx === 0) return true;
    const [prevMonth, prevDay, prevYear] = arr[idx - 1];
    const [currMonth, currDay, currYear] = curr;
    return (
      currMonth === prevMonth &&
      currYear === prevYear &&
      parseInt(currDay, 10) === parseInt(prevDay, 10) + 1
    );
  });

  if (!isRange) {
    return (
      "on " +
      parsedDates
        .map(
          ([month, day, year]) => `${this.months[month - 1]} ${day}, ${year}`
        )
        .join(", ")
    );
  }

  const [startMonth, startDay, startYear] = parsedDates[0];
  const [endMonth, endDay, endYear] = parsedDates[parsedDates.length - 1];

  return `from ${this.months[startMonth - 1]} ${startDay}, ${startYear} - ${
    this.months[endMonth - 1]
  } ${endDay}, ${endYear}`;
};

export const sortDates = (arr) => {
  return [...arr].sort((a, b) => {
    const [am, ad, ay] = a.stamp.split("/").map(Number);
    const [bm, bd, by] = b.stamp.split("/").map(Number);

    // Sort descending: latest date first
    if (by !== ay) return by - ay;
    if (bm !== am) return bm - am;
    return bd - ad;
  });
};
