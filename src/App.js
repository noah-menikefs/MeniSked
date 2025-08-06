import React, { useCallback, useState, useEffect, useMemo } from "react";
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

const initialUser = {
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  colour: "",
  department: "",
  isadmin: false,
  isactive: false,
  worksked: [],
};

const App = () => {
  const today = useMemo(() => moment(), []);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [route, setRoute] = useState("Login");
  const [callList, setCallList] = useState([]);
  const [user, setUser] = useState(initialUser);
  const [entryList, setEntryList] = useState([]);
  const [peopleList, setPeopleList] = useState([]);

  const loadUser = useCallback((data) => {
    setUser({
      ...initialUser,
      ...data,
    });
  }, []);

  const onRouteChange = useCallback((route, signedIn = true) => {
    setRoute(route);
    setIsSignedIn(signedIn);
  }, []);

  useEffect(() => {
    const fetchSharedData = async () => {
      const [entriesRes, peopleRes, callTypesRes] = await Promise.all([
        fetch("https://secure-earth-82827.herokuapp.com/sked/entries"),
        fetch("https://secure-earth-82827.herokuapp.com/people"),
        fetch("https://secure-earth-82827.herokuapp.com/callTypes"),
      ]);
      const [entries, people, calls] = await Promise.all([
        entriesRes.json(),
        peopleRes.json(),
        callTypesRes.json(),
      ]);
      setEntryList(entries);
      setPeopleList(people);
      setCallList(calls.sort((a, b) => a.priority - b.priority));
    };

    fetchSharedData();
  }, []);

  //used for rendering when signed in
  const inRenderSwitch = (route) => {
    switch (route) {
      case "Personal Schedule":
        return <PerSchedule callList={callList} today={today} user={user} />;
      case "Master Schedule":
        return <PubSchedule callList={callList} today={today} user={user} />;
      case "Call Schedule":
        return <CSchedule callList={callList} today={today} user={user} />;
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
        return <PerSchedule today={today} user={user} />;
    }
  };

  //Used for rendering when signed out
  const outRenderSwitch = (route) => {
    return route === "Login" ? (
      <Login loadUser={loadUser} onRouteChange={onRouteChange} />
    ) : (
      <Register loadUser={loadUser} onRouteChange={onRouteChange} />
    );
  };

  return (
    <div className="App">
      {!isSignedIn ? (
        outRenderSwitch(route)
      ) : (
        <>
          <Navigation
            onRouteChange={onRouteChange}
            testisadmin={user.isadmin}
          />
          <br />
          <h1>{route}</h1>
          {inRenderSwitch(route)}
        </>
      )}
    </div>
  );
};

export default App;
