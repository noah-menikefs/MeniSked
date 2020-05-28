import React, {Component} from 'react';
import Navigation from './Components/Navigation/Navigation';
import Login from './Components/Login/Login';
import Register from './Components/Login/Register';
import PerSchedule from './Components/Schedules/PerSchedule';
import PubSchedule from './Components/Schedules/PubSchedule';
import CSchedule from './Components/Schedules/CSchedule';
import Account from './Components/Account/Account';
import AMessages from './Components/Messages/AMessages';
import EMessages from './Components/Messages/EMessages';
import Holidays from './Components/Settings/Holidays';
import CallTypes from './Components/Settings/CallTypes';
import People from './Components/Settings/People';
import moment from 'moment';
import './App.css';





class App extends Component {
  constructor(){
    super();
    this.state = {
      today: moment(),
      isSignedIn: false,
      route: 'Login',
      // title: '',
      user:{
        id: '',
        firstName: '',
        lastName: 'Ismail',
        email: '',
        colour: '',
        department: '',
        isAdmin: true,
        isActive: true
      },
      docs: [
        "Ismail", 
        "Menikefs", 
        "Ahn", 
        "Abbass",
        "Smith"
      ],
      entries: [
        "Request No Call",
        "Vacation",
        "Staycation",
        "No Assignment",
        "Not Available",
        "Not Available Night",
        "Assign Call Type"
      ]
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      colour: data.colour,
      department: data.department,
      isAdmin: data.isAdmin,
      isActive: data.isActive
    }})
  }


  /*
  Different cases:
  Login
  Register
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
      case "Personal Schedule": 
        return <PerSchedule today={this.state.today} entries={this.state.entries} docs={this.state.docs} user={this.state.user} testIsAdmin={this.state.user.isAdmin}/>
      case 'Published Schedule': 
        return <PubSchedule today={this.state.today} user={this.state.user} testIsAdmin={this.state.user.isAdmin}/>
      case 'Call Schedule': 
        return <CSchedule today={this.state.today} testIsAdmin={this.state.user.isAdmin}/>
      case 'Account Information': 
        return <Account />
      case 'Admin Messages': 
        return <AMessages  />
      case 'Messages': 
        return <EMessages />
      case 'Holidays': 
        return <Holidays today={this.state.today}/>
      case 'Call Types': 
        return <CallTypes />
      case 'People': 
        return <People />
      default:
        return <PerSchedule entries={this.state.entries} docs={this.state.docs} user={this.state.user} testIsAdmin={this.state.user.isAdmin}/>
    }
  }


  //Used for rendering when signed out
  outRenderSwitch(route){
    return route === 'Login' ? <Login loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
  }

  onRouteChange = (route, isSignedIn = true) => {
    this.setState({
      isSignedIn: isSignedIn,
      route: route
    });
  }


  render(){
     const {route, isSignedIn, user} = this.state;
     const {isAdmin} = user;
     return (
        <div>
        <div className="App">
          { (! isSignedIn)
            ? this.outRenderSwitch(route)
            : <div>
                <Navigation onRouteChange={this.onRouteChange} testIsAdmin={isAdmin}/>
                <br/>
                <h1>{route}</h1>
                {this.inRenderSwitch(route)}

              </div>
          }

        </div>
        </div>
      );
  }

}

export default App;
