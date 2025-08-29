import React, { useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectIsSignedIn,
  selectRoute,
  onRouteChange,
  setUser,
} from "./store/slices/userSlice";
import {
  selectCallList,
  selectFilteredEntries,
  selectPeopleList,
  selectDepts,
  fetchReferenceData,
} from "./store/slices/referenceDataSlice";
import {
  selectRHolidayList,
  selectNrHolidayList,
  fetchHolidayData,
} from "./store/slices/holidaySlice";
import Navigation from "./Components/Navigation/Navigation";
import Login from "./Components/Login/Login";
import Register from "./Components/Login/Register";
import PerSchedule from "./Components/Schedules/PerSchedule";
import PubSchedule from "./Components/Schedules/PubSchedule";
import CSchedule from "./Components/Schedules/CSchedule";
import Account from "./Components/Account/Account";
import AMessages from "./Components/Messages/AMessages";
import EMessages from "./Components/Messages/EMessages";
import Holidays from "./Components/Settings/Holidays";
import CallTypes from "./Components/Settings/CallTypes";
import People from "./Components/Settings/People";
import Entries from "./Components/Settings/Entries";
import moment from "moment";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const today = useMemo(() => moment(), []);

  // Get state from Redux
  const user = useSelector(selectUser);
  const isSignedIn = useSelector(selectIsSignedIn);
  const route = useSelector(selectRoute);

  // Get reference data from Redux
  const callList = useSelector(selectCallList);
  const entryList = useSelector(selectFilteredEntries);
  const peopleList = useSelector(selectPeopleList);
  const depts = useSelector(selectDepts);

  // Get holiday data from Redux
  const rHolidayList = useSelector(selectRHolidayList);
  const nrHolidayList = useSelector(selectNrHolidayList);

  const loadUser = useCallback(
    (data) => {
      dispatch(setUser(data));
    },
    [dispatch]
  );

  const handleRouteChange = useCallback(
    (route, signedIn = true) => {
      dispatch(onRouteChange({ route, signedIn }));
    },
    [dispatch]
  );

  useEffect(() => {
    // Fetch all data when component mounts
    dispatch(fetchReferenceData());
    dispatch(fetchHolidayData());
  }, [dispatch]);

  // NEW: Shared utility functions
  const processHolidaysForDate = useCallback(
    (dateContext) => {
      let newArr = [];
      nrHolidayList.forEach((nholiday) => {
        nholiday.eventsked.forEach((date) => {
          let dateArr = date.split("/");
          if (
            dateArr[0] === dateContext.format("MM") &&
            dateArr[2] === dateContext.format("YYYY")
          ) {
            newArr.push({
              day: parseInt(dateArr[1], 10),
              name: nholiday.name,
            });
          }
        });
      });

      rHolidayList.forEach((holiday) => {
        if (holiday.month === dateContext.format("MMMM")) {
          newArr.push({
            day: holiday.day,
            name: holiday.name,
          });
        }
      });
      return newArr;
    },
    [nrHolidayList, rHolidayList]
  );

  const filteredEntries = useMemo(() => {
    return entryList.filter((entry) => entry.isactive === true);
  }, [entryList]);

  //used for rendering when signed in
  const inRenderSwitch = (route) => {
    switch (route) {
      case "Personal Schedule":
        return (
          <PerSchedule
            callList={callList}
            today={today}
            user={user}
            // NEW: Pass shared data
            nrHolidayList={nrHolidayList}
            depts={depts}
            processHolidaysForDate={processHolidaysForDate}
            entryList={filteredEntries}
          />
        );
      case "Master Schedule":
        return (
          <PubSchedule
            callList={callList}
            today={today}
            user={user}
            // NEW: Pass shared data
            nrHolidayList={nrHolidayList}
            depts={depts}
            processHolidaysForDate={processHolidaysForDate}
            entryList={filteredEntries}
            peopleList={peopleList}
          />
        );
      case "Call Schedule":
        return (
          <CSchedule
            callList={callList}
            today={today}
            user={user}
            // NEW: Pass shared data
            rHolidayList={rHolidayList}
            nrHolidayList={nrHolidayList}
            depts={depts}
            processHolidaysForDate={processHolidaysForDate}
            peopleList={peopleList}
          />
        );
      case "Account Information":
        return <Account loadUser={loadUser} user={user} />;
      case "Admin Messages":
        return (
          <AMessages
            today={today}
            entryList={entryList}
            peopleList={peopleList}
            callList={callList}
          />
        );
      case "Messages":
        return (
          <EMessages user={user} entryList={entryList} callList={callList} />
        );
      case "Holidays":
        return <Holidays today={today} />;
      case "Call Types":
        return <CallTypes />;
      case "People":
        return <People department={user.department} />;
      case "Entries":
        return <Entries />;
      default:
        return (
          <PerSchedule
            callList={callList}
            today={today}
            user={user}
            // NEW: Pass shared data
            nrHolidayList={nrHolidayList}
            depts={depts}
            processHolidaysForDate={processHolidaysForDate}
            entryList={filteredEntries}
          />
        );
    }
  };

  //Used for rendering when signed out
  const outRenderSwitch = (route) => {
    return route === "Login" ? (
      <Login loadUser={loadUser} onRouteChange={handleRouteChange} />
    ) : (
      <Register loadUser={loadUser} onRouteChange={handleRouteChange} />
    );
  };

  return (
    <div className="App">
      {!isSignedIn ? (
        outRenderSwitch(route)
      ) : (
        <>
          <Navigation />
          <br />
          <h1>{route}</h1>
          {inRenderSwitch(route)}
        </>
      )}
    </div>
  );
};

export default App;
