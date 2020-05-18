import React, {Component} from 'react';
import logo from './logo.svg';
import Navigation from './Components/Navigation/Navigation';
import Login from './Components/Login/Login';
import Register from './Components/Login/Register';
import PerSchedule from './Components/Schedules/PerSchedule';
import PubSchedule from './Components/Schedules/PubSchedule';
import CSchedule from './Components/Schedules/CSchedule';
import Account from './Components/Account/Account';
import AMessages from './Components/Messages/AMessages';
import EMessages from './Components/Messages/EMessages';
import Holidays from './Components/Settings/Holidays/Holidays';
import CallTypes from './Components/Settings/CallTypes/CallTypes';
import People from './Components/Settings/People/People';
import './App.css';





class App extends Component {
  constructor(){
    super();
    this.state = {
      isSignedIn: true,
      route: 'Call Types',
      title: '',
      user:{
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        colour: '',
        isAdmin: true
      }
    }
  }

  /*
  Different cases:
  login
  register
  Personal Schedule
  Published Schedule
  Call Schedule
  Account Information
  Admin Messages
  Messages
  Holidays
  Call Types
  People
  */
  

  //used for rendering when signed in 
  inRenderSwitch(route){
    switch(route){
      case 'Personal Schedule': 
        return <PerSchedule/>
      case 'Published Schedule': 
        return <PubSchedule/>
      case 'Call Schedule': 
        return <CSchedule/>
      case 'Account Information': 
        return <Account/>
      case 'Admin Messages': 
        return <AMessages/>
      case 'Messages': 
        return <EMessages />
      case 'Holidays': 
        return <Holidays/>
      case 'Call Types': 
        return <CallTypes/>
      case 'People': 
        return <People/>
    }
  }

  //Used for rendering when signed out
  outRenderSwitch(route){
    return route === 'login' ? <Login/> : <Register/>
  }


  render(){
     const {title, route, isSignedIn, user} = this.state;
     const {isAdmin} = user;
     return (
        <div className="App">
          { (! isSignedIn)
            ? this.outRenderSwitch(route)
            : <div>
                <Navigation testIsAdmin={isAdmin}/>
                <br/>
                <h1>{route}</h1>
                {this.inRenderSwitch(route)}

            </div>
          }

        </div>
      );
  }

}

export default App;
