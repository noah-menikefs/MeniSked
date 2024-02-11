import React, {Component} from 'react';
import Navigation from './Components/Navigation/Navigation';
import Login from './Components/Login/Login';
import RegisterComponent from './Components/Login/RegisterComponent';
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
      callList: [],
      user:{
        id: '',
        firstname: '',
        lastname: '',
        email: '',
        colour: '',
        department: '',
        isadmin: false,
        isactive: false,
        worksked: []
      }
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

  loadCallTypes = () => {
    fetch('https://secure-earth-82827.herokuapp.com/callTypes')
      .then(response => response.json())
      .then(calls => this.setState({callList: calls.sort(function(a, b){return a.priority - b.priority})}));
  }

  //used for rendering when signed in 
  inRenderSwitch(route){
    const {callList, today, user} = this.state;
    switch(route){
      case "Personal Schedule": 
        return <PerSchedule loadCallTypes={this.loadCallTypes} callList={callList} today={today} user={user}/>
      case 'Master Schedule': 
        return <PubSchedule loadCallTypes={this.loadCallTypes} callList={callList} today={today} user={user}/>
      case 'Call Schedule': 
        return <CSchedule loadCallTypes={this.loadCallTypes} callList={callList} today={today} user={user}/>
      case 'Account Information': 
        return <Account loadUser={this.loadUser} user={user}/>
      case 'Admin Messages': 
        return <AMessages user={user} today={today} />
      case 'Messages': 
        return <EMessages user={user}/>
      case 'Holidays': 
        return <Holidays today={today}/>
      case 'Call Types': 
        return <CallTypes />
      case 'People': 
        return <People department={user.department}/>
        case 'Entries': 
        return <Entries/>
      default:
        return <PerSchedule today={today} user={user}/>
    }
  }


  //Used for rendering when signed out
  outRenderSwitch(route){
    return route === 'Login' ? <Login loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> : <RegisterComponent loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
  }

  onRouteChange = (route, isSignedIn = true) => {
    this.setState({
      isSignedIn: isSignedIn,
      route: route
    });
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
