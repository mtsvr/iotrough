import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import io from 'socket.io-client';
import '../../semantic/dist/semantic.css';
window.jQuery = $; // Assure it's available globally.
window.$ = $;
var jQuery = $;
var s = require('../../semantic/dist/semantic.js');

import RadioOption from './Utilities.jsx';
import Button from './Button.jsx';
import Quickview from './Quickview.jsx';

import Dashboard from './Dashboard.jsx'
import Nodes from './Nodes.jsx'

import $ from 'jquery';

var socket = io();
window.socket = socket;

var pjson = require('../../../package.json');

require("./App.scss");

export default class App extends React.Component{
  constructor(){
    super();
    socket.on('connect', data => {
      console.log("conectado a servidor!");
    });
    this.state = {
    }
  }

  componentWillMount(){
    
  }

  componentDidMount(){
    socket.emit('db_connect');
    socket.on('db_connection_resolve', data => {
      console.log('db connection resolve',data)
    })

  }

  render() {
      return (
        <div className="detatch">
          <Header />

          <div className="ui main fluid container">
            <div className="ui bottom tab container active">
              { this.props.children }
            </div>
          </div>
          
        </div>
      );
  }
}

export class DashboardContainer extends React.Component{
  render() {
    return (
      <div>
        <Dashboard />  
      </div>
    )
  }
}

export class NodesContainer extends React.Component{
  render() {
    return (
      <div>
        <Nodes />  
      </div>
    )
  }
}

export class Header extends React.Component{

  componentDidMount(){
    $('#nav')
      .dropdown({
        on: 'hover'
      })
    ;
  }

  render(){
    const logo = require('../../images/chip.svg');
    return (
      <div className="ui fixed menu">
        <div className="ui fluid container">

          <div className="ui header item">
            <img className="ui mini image" src={logo} alt="" /><span> IoTrough</span>
          </div>
          <div className="left menu">
            <div className="ui dropdown icon item" id="nav">
              <i className="wrench icon"></i>
              <div className="menu">
                <Link to='/dashboard' className="item "><i className="home icon"></i> Dashboard</Link>
                <Link to='/nodes/1' className="item"><i className="microchip icon"></i> Node 1</Link>
                <Link to='/nodes/2' className="item"><i className="microchip icon"></i> Node 2</Link>
              </div>
            </div>
          </div>
          <div className="item">
            <Quickview />
          </div>
          <div className="right menu">
            
          </div>
        </div>
      </div>
    );
  }
}