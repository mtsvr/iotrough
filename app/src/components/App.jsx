import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
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

var pjson = require('../../../package.json');

require("./App.scss");

export default class App extends React.Component{
  render() {
      return (
        <div>
          <Header />

          <div className="ui main text container">
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
                <Link to='/nodes' className="item "><i className="microchip icon"></i> Nodes</Link>
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