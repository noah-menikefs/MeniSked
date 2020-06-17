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
import Entries from './Components/Settings/Entries';
import moment from 'moment';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      today: moment(),
      isSignedIn: false,
      route: 'Login',
      user:{
        id: '',
        firstname: '',
        lastname: 'Ismail',
        email: '',
        colour: '',
        department: '',
        isadmin: false,
        isactive: true,
        worksked: []
      },
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
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      colour: data.colour,
      department: data.department,
      isadmin: data.isadmin,
      isactive: data.isactive,
      worksked: data.worksked
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
  Entries
  */
  //used for rendering when signed in 
  inRenderSwitch(route){
    switch(route){
      case "Personal Schedule": 
        return <PerSchedule today={this.state.today} entries={this.state.entries}  user={this.state.user} testisadmin={this.state.user.isadmin}/>
      case 'Published Schedule': 
        return <PubSchedule today={this.state.today} user={this.state.user} testisadmin={this.state.user.isadmin}/>
      case 'Call Schedule': 
        return <CSchedule today={this.state.today} user={this.state.user}/>
      case 'Account Information': 
        return <Account />
      case 'Admin Messages': 
        return <AMessages />
      case 'Messages': 
        return <EMessages />
      case 'Holidays': 
        return <Holidays today={this.state.today}/>
      case 'Call Types': 
        return <CallTypes />
      case 'People': 
        return <People department={this.state.user.department}/>
        case 'Entries': 
        return <Entries/>
      default:
        return <PerSchedule entries={this.state.entries}  user={this.state.user} testisadmin={this.state.user.isadmin}/>
    }
  }


  //Used for rendering when signed out
  outRenderSwitch(route){
    return route === 'Login' ? <Login validateEmail={this.validateEmail} loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> : <Register validateEmail={this.validateEmail} loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
  }

  onRouteChange = (route, isSignedIn = true) => {
    this.setState({
      isSignedIn: isSignedIn,
      route: route
    });
  }


  validateEmail = (str) => {
    let first = '';
    let second = '';
    let third = '';
    let index = -1;
    let flag1 = false;
    let flag2 = false;
    for (let i = 0; i < str.length; i++){
      if (!flag1 && str.charAt(i) === '@'){
        first = str.substring(0,i);
        index = i;
        flag1 = true;
      }
      else if (flag1 && !flag2 && str.charAt(i) === '.'){
        second = str.substring(index+1, i);
        third = str.substring(i+1);
        flag2 = true;
        break;
      }
    }
    if (first.length > 0 && second.length > 0 && third.length > 0){
      return true;
    }
    return false;

  }

  render(){
     const {route, isSignedIn, user} = this.state;
     const {isadmin} = user;
     return (
        <div>
        <div className="App">
          { (! isSignedIn)
            ? this.outRenderSwitch(route)
            : <div>
                <Navigation onRouteChange={this.onRouteChange} testisadmin={isadmin}/>
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
