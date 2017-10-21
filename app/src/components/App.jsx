import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import '../../semantic/dist/semantic.css';

import RadioOption from './Utilities.jsx';
import Button from './Button.jsx';
import Quickview from './Quickview.jsx';

import Register from './Register.jsx';
import Attendees from './Attendees.jsx';

require("./App.scss");

export default class App extends React.Component{
  render() {
      console.log("Hola!");
      return (
        <div>
          <Header />
          { this.props.children }
        </div>
      );
  }
}

export class RegisterContainer extends React.Component{
  render() {
    return (
    <TabContainer active="register" />
    )
  }
}

export class AttendeesContainer extends React.Component{
  render() {
    return (
    <TabContainer active="attendees" />
    )
  }
}

export class TabContainer extends React.Component{
  render() {
    let register_is_active = this.props.active == 'register';
    let attendees_is_active = this.props.active == 'attendees';

    let container
    if(register_is_active){
      container = (<Register />)
    }
    if(attendees_is_active){
      container = (<Attendees />)
    }
    return (
      <div>
         <div className="ui main text container">
            <div className="ui two item stackable tabs menu">
              <Link to='/register' className={"item " + (register_is_active ? 'active':'')}><i className="child icon"></i> Acreditación</Link>
              <Link to='/attendees' className={"item " + (attendees_is_active ? 'active':'')}><i className="users icon"></i> Asistentes</Link>
            </div>

            <div className="ui bottom tab container active">
                {container}
            </div>

          </div>
      </div>
    )
  }
}

export class Header extends React.Component{
  render(){
    const logo = require('../../images/logo.png');
    return (
      <div className="ui fixed menu">
        <div className="ui container">
          <div className="brand item">
            <img className="logo" src={logo} alt="" /><span> SAGE</span>
          </div>
          <div className="item">
            <Quickview />
          </div>
        </div>
      </div>
    );
  }
}