import React from "react";
import { Page, Text, Document, StyleSheet, View } from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  header: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
    color: "#808080",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
  },
  weekday: {
    marginTop: 5,
    marginBottom: 3,
    fontSize: 12,
    alignSelf: "center",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0.75,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  tableBody: {
    paddingRight: 8,
    paddingLeft: 5,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "13.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    height: 125,
    borderTopWidth: 0,
  },
  tableCell: {
    marginTop: 1,
    fontSize: 8,
    paddingLeft: 2,
    borderStyle: "solid",
    borderBottomWidth: 0.5,
  },
  tableCellList: {
    fontSize: 8,
    paddingLeft: 1,
  },
  footer: {
    marginTop: 1,
    fontSize: 10,
    textAlign: "center",
    color: "grey",
  },
});

// PDF Document component
const MyDocument = ({
  user,
  type,
  dateContext,
  holiDays = [],
  personalDays = [],
  entries = [],
  callList = [],
  callSked = [],
  sked = [],
  numNotes = [],
  iNotes = [],
  vNotes = [],
  depts = [],
  stamp = "",
  colour = false,
}) => {
  const firstDayOfWeekIndex = Number(dateContext.startOf("month").format("d")); // 0-6
  const daysInMonth = dateContext.daysInMonth();

  // Select which list to render
  const listType =
    Array.isArray(callSked) && callSked.length > 0
      ? callSked
      : Array.isArray(sked) && sked.length > 0
      ? sked
      : personalDays;

  // Index lookups
  const entryById = new Map(entries.map((e) => [e.id, e.name]));
  const callById = new Map(callList.map((c) => [c.id, c.name]));
  const holidayByDay = new Map(holiDays.map((h) => [h.day, h.name]));

  const toDateStr = (d) =>
    `${dateContext.format("MM")}/${d}/${dateContext.format("YYYY")}`;

  // Build maps for notes (visible, invisible, numeric)
  const groupByDate = (arr) => {
    const map = new Map();
    for (const n of arr) {
      const key = n.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(n.msg);
    }
    return map;
  };
  const visibleNotesByDate = groupByDate(vNotes);
  const invisibleNotesByDate = groupByDate(iNotes);
  const numberNotesByDate = new Map();
  for (const n of numNotes) {
    numberNotesByDate.set(n.date, n.msg);
  }

  const showAdminNotes = Boolean(user?.isadmin);

  const renderSecondaryName = (secondaryName, hexColour) => {
    if (!secondaryName) return <Text />;
    if (colour && hexColour) {
      return (
        <Text style={{ backgroundColor: String(hexColour) }}>
          {secondaryName}
        </Text>
      );
    }
    return <Text>{secondaryName}</Text>;
  };

  // Build calendar cells (6 rows x 7 cols)
  const rows = [];
  let dayCounter = 1;
  for (let rowIdx = 0; rowIdx < 6; rowIdx++) {
    const cols = [];
    for (let colIdx = 0; colIdx < 7; colIdx++) {
      let items = [];
      let headerDay = "";
      let headerHoliday = "";
      let headerNumNote = "";

      const isCurrentMonthCell =
        (rowIdx !== 0 || colIdx >= firstDayOfWeekIndex) &&
        dayCounter <= daysInMonth;
      if (isCurrentMonthCell) {
        headerDay = dayCounter;
        headerHoliday = holidayByDay.get(dayCounter) || "";

        const dateStr = toDateStr(dayCounter);

        // Assignments for this date
        for (let idx = 0; idx < listType.length; idx++) {
          const item = listType[idx];
          if (item.date === dateStr) {
            const baseName =
              callById.get(item.id) ?? entryById.get(item.id) ?? "";
            const secondaryName = item.name || "";
            const bg = item.colour
              ? String(item.colour).substring(0, 7)
              : undefined;
            items.push(
              <Text key={`a-${idx}`} style={styles.tableCellList}>
                {baseName} {renderSecondaryName(secondaryName, bg)}
              </Text>
            );
          }
        }

        // Visible notes for everyone
        const vMsgs = visibleNotesByDate.get(dateStr) || [];
        vMsgs.forEach((msg, i) =>
          items.push(
            <Text key={`v-${i}`} style={styles.tableCellList}>
              {` - ${msg}`}
            </Text>
          )
        );

        if (showAdminNotes) {
          // Invisible notes
          const iMsgs = invisibleNotesByDate.get(dateStr) || [];
          iMsgs.forEach((msg, i) =>
            items.push(
              <Text key={`i-${i}`} style={styles.tableCellList}>
                {` - ${msg}`}
              </Text>
            )
          );
          // Numeric note for header
          headerNumNote = numberNotesByDate.get(dateStr) || "";
        }

        dayCounter++;
      }

      if (showAdminNotes) {
        cols.push(
          <View key={colIdx} style={styles.tableCol}>
            <View key={`h-${colIdx}`} style={styles.tableCell}>
              <Text>{`${headerDay || ""}  ${headerNumNote}`}</Text>
              <Text>{headerHoliday}</Text>
            </View>
            {items}
          </View>
        );
      } else {
        cols.push(
          <View key={colIdx} style={styles.tableCol}>
            <Text style={styles.tableCell}>{`${
              headerDay || ""
            }   ${headerHoliday}`}</Text>
            {items}
          </View>
        );
      }
    }
    rows.push(cols);
  }

  // Department header
  let department = String(user?.department || "").replace(" Admin", "");
  for (let i = 0; i < depts.length; i++) {
    if (depts[i].code === department) {
      department = depts[i].name;
      break;
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{`${department}, ${type} Schedule`}</Text>
        <Text style={styles.title}>{dateContext.format("MMMM Y")}</Text>
        <Text style={styles.weekday}>
          {
            "Sunday             Monday            Tuesday         Wednesday         Thursday            Friday            Saturday"
          }
        </Text>
        <View style={styles.tableBody}>
          <View style={styles.table}>
            <View style={styles.tableRow}>{rows[0]}</View>
            <View style={styles.tableRow}>{rows[1]}</View>
            <View style={styles.tableRow}>{rows[2]}</View>
            <View style={styles.tableRow}>{rows[3]}</View>
            <View style={styles.tableRow}>{rows[4]}</View>
            <View style={styles.tableRow}>{rows[5]}</View>
          </View>
        </View>
        <Text style={styles.footer}>{`Created: ${stamp}`}</Text>
      </Page>
    </Document>
  );
};

export default MyDocument;
