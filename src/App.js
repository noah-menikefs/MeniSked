import React, { useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectIsSignedIn,
  selectRoute,
  onRouteChange,
  setUser,
} from "./store/slices/userSlice";
import { fetchReferenceData } from "./store/slices/referenceDataSlice";
import { fetchHolidayData } from "./store/slices/holidaySlice";
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

  //used for rendering when signed in
  const inRenderSwitch = (route) => {
    switch (route) {
      case "Personal Schedule":
        return <PerSchedule today={today} />;
      case "Master Schedule":
        return <PubSchedule today={today} />;
      case "Call Schedule":
        return <CSchedule today={today} />;
      case "Account Information":
        return <Account loadUser={loadUser} user={user} />;
      case "Admin Messages":
        return <AMessages today={today} />;
      case "Messages":
        return <EMessages />;
      case "Holidays":
        return <Holidays today={today} />;
      case "Call Types":
        return <CallTypes />;
      case "People":
        return <People department={user.department} />;
      case "Entries":
        return <Entries />;
      default:
        return <PerSchedule today={today} />;
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
