import React, { useState, useEffect, useCallback, useRef } from "react";
import CalendarGrid from "./Calendar/CalendarGrid";
import { buildPersonalMonthDays } from "../../selectors/calendarData";
import ScheduleDownloadLink from "./../PDF/ScheduleDownloadLink.jsx";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import moment from "moment";
import { publishedBaseDate } from "../../utils/date";
import CalendarHeader from "./Calendar/CalendarHeader";
import useCalendarNavigation from "../../hooks/useCalendarNavigation";
import useHolidays from "../../hooks/useHolidays";
import usePdfStamp from "../../hooks/usePdfStamp";

import "./Schedules.css";
import CallTypeSelectModal from "./Modals/CallTypeSelectModal.jsx";

const style = {
  position: "relative",
  margin: "10px auto",
  width: "90%",
};

const PerSchedule = (props) => {
  // State management with hooks
  const [activeDocs, setActiveDocs] = useState([]);
  const [docIndex, setDocIndex] = useState(0);
  const [entryIndex, setEntryIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [day, setDay] = useState(0);
  const [personalDays, setPersonalDays] = useState([]);
  const [pending, setPending] = useState([]);
  const { stamp, updateStamp } = usePdfStamp();

  // Extract shared data from props
  const {
    user,
    today,
    callList,
    nrHolidayList,
    depts,
    processHolidaysForDate,
    entryList,
  } = props;
  const isMountedRef = useRef(true);

  // Load functions
  // Keep this function identity stable; callers must pass the docs array explicitly
  const loadPersonalDays = useCallback((index, docs) => {
    setPersonalDays([...docs[index].worksked]);
  }, []);

  const loadActiveDocs = useCallback(() => {
    fetch("https://secure-earth-82827.herokuapp.com/sked/docs")
      .then((response) => response.json())
      .then((docs) => {
        if (isMountedRef.current) {
          const doctors = [...docs];
          for (let i = 0; i < doctors.length; i++) {
            if (doctors[i].id === user.id) {
              loadPersonalDays(i, doctors);
              setDocIndex(i);
            }
          }
          setActiveDocs(docs);
        }
      });
  }, [user.id, loadPersonalDays]);

  const {
    dateContext,
    setMonth,
    setYear,
    nextMonth,
    prevMonth,
    nextYear,
    prevYear,
    reset,
  } = useCalendarNavigation({
    initialDate: today,
    maxDate: moment(today).add(10, "year"),
  });

  const holiDays = useHolidays({
    dateContext,
    nrHolidayList,
    processHolidaysForDate,
  });

  const loadPersonalSked = useCallback((user) => {
    setActiveDocs((prevActiveDocs) => {
      let activeDocs = [...prevActiveDocs];
      for (let i = 0; i < activeDocs.length; i++) {
        if (user.id === activeDocs[i].id) {
          let currentUser = Object.assign({}, activeDocs[i]);
          currentUser.worksked = [...user.worksked];
          activeDocs[i] = currentUser;
          setPersonalDays(currentUser.worksked);
          return activeDocs;
        }
      }
      return prevActiveDocs;
    });
  }, []);

  const loadPending = useCallback(
    (userid = user.id) => {
      fetch("https://secure-earth-82827.herokuapp.com/emessages/" + userid)
        .then((response) => response.json())
        .then((messages) => {
          if (isMountedRef.current) {
            setPending(
              messages.filter((message) => message.status === "pending")
            );
          }
        });
    },
    [user.id]
  );

  const assignCall = useCallback(
    (typeID, method, date) => {
      fetch("https://secure-earth-82827.herokuapp.com/sked/assign", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docId: activeDocs[docIndex].id,
          typeId: typeID,
          date: date,
        }),
      })
        .then((response) => response.json())
        .then((user) => {
          if (user.lastname) {
            loadPersonalSked(user);
          }
        });
      setShow(false);
    },
    [activeDocs, docIndex, loadPersonalSked]
  );

  const requestCall = useCallback(
    (typeID, date) => {
      fetch("https://secure-earth-82827.herokuapp.com/request", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docid: user.id,
          entryid: typeID,
          date: date,
          stamp: today.format("MM/DD/YYYY"),
        }),
      })
        .then((response) => response.json())
        .then((message) => {
          if (message) {
            loadPending();
          }
        });
      setShow(false);
    },
    [user.id, today, loadPending]
  );

  const editCall = useCallback(
    (typeID, date) => {
      fetch("https://secure-earth-82827.herokuapp.com/request", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docid: parseInt(user.id),
          entryid: parseInt(typeID, 10),
          date: date,
        }),
      })
        .then((response) => response.json())
        .then((message) => {
          if (message) {
            loadPending();
          }
        });
      setShow(false);
    },
    [user.id, loadPending]
  );

  const deleteCall = useCallback(
    (typeID, date, docid = parseInt(user.id, 10)) => {
      fetch("https://secure-earth-82827.herokuapp.com/drequest", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docid: docid,
          entryid: parseInt(typeID, 10),
          date: date,
          pending: pending,
        }),
      })
        .then((response) => response.json())
        .then((messages) => {
          if (messages) {
            loadPending();
          }
        });
      setShow(false);
    },
    [user.id, pending, loadPending]
  );

  const assignOrDelete = useCallback(
    (typeId, selectedDay = day) => {
      const typeID = Number(typeId);
      const date = moment(dateContext).date(selectedDay).format("MM/D/YYYY");
      const selectedDocId = activeDocs[docIndex]?.id;

      // Helpers that clarify intent
      const isAssignedForDateAndType = personalDays.some(
        (d) => d.date === date && d.id === typeID
      );
      const hasPendingOnDateForType = pending.some(
        (p) => p.dates?.includes(date) && Number(p.entryid) === typeID
      );
      const hasPendingForType = pending.some(
        (p) =>
          Number(p.docid) === Number(user.id) && Number(p.entryid) === typeID
      );
      if (user.isadmin) {
        const method = isAssignedForDateAndType ? "delete" : "post";
        assignCall(typeID, method, date);
        pending.forEach((p) => {
          if (p.dates?.includes(date)) {
            deleteCall(p.entryid, date, selectedDocId);
          }
        });
      } else {
        if (hasPendingOnDateForType) {
          deleteCall(typeID, date);
        } else if (hasPendingForType) {
          editCall(typeID, date);
        } else {
          requestCall(typeID, date);
        }
      }

      setDay(0);
    },
    [
      day,
      dateContext,
      user.isadmin,
      user.id,
      assignCall,
      personalDays,
      pending,
      deleteCall,
      activeDocs,
      docIndex,
      requestCall,
      editCall,
    ]
  );

  // Event handlers
  const onDayClick = useCallback(
    (day) => {
      const id = entryList[entryIndex].id;
      if (id === 1) {
        setDay(day);
        setShow(true);
      } else {
        assignOrDelete(id, day);
      }
    },
    [entryList, entryIndex, assignOrDelete]
  );

  const nextDoc = useCallback(() => {
    let i = docIndex;
    if (i !== activeDocs.length - 1) {
      loadPersonalDays(i + 1, activeDocs);
      loadPending(activeDocs[i + 1].id);
      setDocIndex(i + 1);
    } else {
      loadPersonalDays(0, activeDocs);
      loadPending(activeDocs[0].id);
      setDocIndex(0);
    }
  }, [docIndex, activeDocs, loadPersonalDays, loadPending]);

  const prevDoc = useCallback(() => {
    let i = docIndex;
    if (i !== 0) {
      loadPersonalDays(i - 1, activeDocs);
      loadPending(activeDocs[i - 1].id);
      setDocIndex(i - 1);
    } else {
      loadPersonalDays(activeDocs.length - 1, activeDocs);
      loadPending(activeDocs[activeDocs.length - 1].id);
      setDocIndex(activeDocs.length - 1);
    }
  }, [docIndex, activeDocs, loadPersonalDays, loadPending]);

  const nextEntry = useCallback(() => {
    let i = entryIndex;
    if (i !== entryList.length - 1) {
      setEntryIndex(i + 1);
    } else {
      setEntryIndex(0);
    }
  }, [entryIndex, entryList.length]);

  const prevEntry = useCallback(() => {
    let i = entryIndex;
    if (i !== 0) {
      setEntryIndex(i - 1);
    } else {
      setEntryIndex(entryList.length - 1);
    }
  }, [entryIndex, entryList.length]);

  // Form handlers
  const onPhysicianChange = useCallback(
    (event) => {
      const index = activeDocs.findIndex(
        (doc) => doc.lastname === event.target.value
      );
      if (index === -1) return;
      loadPersonalDays(index, activeDocs);
      loadPending(activeDocs[index].id);
      setDocIndex(index);
    },
    [activeDocs, loadPersonalDays, loadPending]
  );

  const onEntryChange = useCallback(
    (event) => {
      const index = entryList.findIndex(
        (entry) => entry.name === event.target.value
      );
      if (index === -1) return;
      setEntryIndex(index);
    },
    [entryList]
  );

  const onMonthChange = (event) => setMonth(event.target.value);

  const onYearChange = (event) => setYear(event.target.value);

  const toggleShow = () => setShow(!show);

  const adminButton = useCallback(() => {
    if (user.isadmin) {
      return (
        <div>
          <Button
            onClick={prevDoc}
            className="arrow top-child"
            variant="secondary"
          >
            &#x25C0;
          </Button>
          <Button
            onClick={nextDoc}
            className="arrow top-child"
            variant="secondary"
          >
            &#x25B6;
          </Button>
        </div>
      );
    } else {
      return <p className="vis top-child"></p>;
    }
  }, [user.isadmin, prevDoc, nextDoc]);

  const hoverSpan = () => updateStamp();

  // useEffect hooks for lifecycle management
  useEffect(() => {
    loadActiveDocs();
  }, [loadActiveDocs]);

  useEffect(() => {
    if (user.id) {
      loadPending();
    }
  }, [user.id, loadPending]);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Render logic
  const doctorOptions = activeDocs.map((doc) => (
    <option key={doc.id} value={doc.lastname}>
      {doc.lastname}
    </option>
  ));

  const doctorSelectControl =
    user.isadmin && activeDocs.length !== 0 ? (
      <select
        value={activeDocs[docIndex].lastname}
        onChange={onPhysicianChange}
        className="top-child doc selector"
      >
        {doctorOptions}
      </select>
    ) : (
      <h6 className="top-child">{user.lastname}</h6>
    );

  const entryOptions = entryList
    .filter((entry) => entry.isactive)
    .map((entry) => (
      <option key={entry.name} value={entry.name}>
        {entry.name}
      </option>
    ));

  const entrySelectControl =
    entryList.length !== 0 ? (
      <select
        value={entryList[entryIndex].name}
        onChange={onEntryChange}
        className="top-child types selector"
      >
        {entryOptions}
      </select>
    ) : (
      <p id="entriesP">Entries</p>
    );

  const callTypeOptions = callList
    .filter((call) => call.isactive)
    .map((call) => ({ id: call.id, label: call.name }));

  // Precompute MyDocument props and filename
  const personalDocProps = {
    stamp,
    depts,
    entries: entryList,
    callList,
    personalDays,
    holiDays,
    type: `${user.firstname} ${user.lastname}'s Personal`,
    dateContext,
    user,
  };
  const personalFileName =
    dateContext.format("MMMM") + dateContext.format("Y") + "pesonalsked.pdf";

  const days = buildPersonalMonthDays({
    dateContext,
    holiDays,
    personalDays,
    pending,
    callList,
    entryList,
  });

  return (
    <div className="screen">
      <CalendarHeader
        leadingCols={[
          {
            label: "Physician",
            content: doctorSelectControl,
            controls: adminButton(),
          },
          {
            label: "Type of Entry",
            content: entrySelectControl,
            controls: (
              <>
                <Button
                  onClick={prevEntry}
                  className="arrow top-child"
                  size="sm"
                  variant="secondary"
                >
                  &#x25C0;
                </Button>
                <Button
                  onClick={nextEntry}
                  className="arrow top-child"
                  size="sm"
                  variant="secondary"
                >
                  &#x25B6;
                </Button>
              </>
            ),
          },
        ]}
        monthValue={dateContext.format("MMMM")}
        yearValue={dateContext.format("Y")}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onPrevYear={prevYear}
        onNextYear={nextYear}
        onReset={reset}
        minDate={publishedBaseDate()}
        maxDate={moment(today).add(10, "year")}
      />
      <div className="curr">
        <h3 id="pcurr">
          {dateContext.format("MMMM") + " " + dateContext.format("Y")}
        </h3>
      </div>
      <div className="sked">
        <CalendarGrid
          year={Number(dateContext.format("YYYY"))}
          monthIndex={Number(dateContext.format("M")) - 1}
          days={days}
          style={style}
          onDayClick={onDayClick}
        />
      </div>
      <div className="bottom">
        <Col id="downloadLink">
          <ScheduleDownloadLink
            docProps={personalDocProps}
            fileName={personalFileName}
            colour={false}
            label="Download as PDF"
            onHover={hoverSpan}
          />
        </Col>
      </div>

      <CallTypeSelectModal
        show={show}
        onHide={toggleShow}
        options={callTypeOptions}
        onSubmit={(selectedId) => assignOrDelete(selectedId)}
      />
    </div>
  );
};

export default PerSchedule;
