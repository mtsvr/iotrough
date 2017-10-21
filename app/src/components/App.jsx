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
      console.log("Hola!");
      return (
        <div>
          <Header />
          { this.props.children }
        </div>
      );
  }
}

export class DashboardContainer extends React.Component{
  render() {
    return (
    <SidebarContainer active="dashboard" />
    )
  }
}

export class NodesContainer extends React.Component{
  render() {
    return (
    <SidebarContainer active="nodes" />
    )
  }
}

export class SidebarContainer extends React.Component {

  componentDidMount(){
    $('.ui.sidebar')
    .sidebar('show')
    ;
  }

  render() {

    let dashboard_is_active = this.props.active == 'dashboard';
    let nodes_is_active = this.props.active == 'nodes';

    let container
    if(dashboard_is_active){
      container = (<Dashboard />)
    }
    if(nodes_is_active){
      container = (<Nodes />)
    }

    return (
      <div>
        <div className="ui main text container">
          <div className="ui sidebar vertical menu">
            <Link to='/dashboard' className={"item " + (dashboard_is_active ? 'active':'')}><i className="child icon"></i> Dashboard</Link>
            <Link to='/nodes' className={"item " + (nodes_is_active ? 'active':'')}><i className="users icon"></i> Nodes</Link>
          </div>

          <div className="ui bottom tab container active">
            {container}
          </div>
        </div>
      </div>
    )
  }
}

export class TabContainer extends React.Component{
  render() {
    let dashboard_is_active = this.props.active == 'dashboard';
    let nodes_is_active = this.props.active == 'nodes';

    let container
    if(dashboard_is_active){
      container = (<Dashboard />)
    }
    if(nodes_is_active){
      container = (<Nodes />)
    }

    return (
      <div>
         <div className="ui main text container">
            <div className="ui two item stackable tabs menu">
              <Link to='/dashboard' className={"item " + (dashboard_is_active ? 'active':'')}><i className="child icon"></i> Dashboard</Link>
              <Link to='/nodes' className={"item " + (nodes_is_active ? 'active':'')}><i className="users icon"></i> Nodes</Link>
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
    const logo = require('../../images/chip.svg');
    return (
      <div className="ui fixed menu">
        <div className="ui container">
          <div className="brand item">
            <img className="ui mini image" src={logo} alt="" /><span> IoTrough</span>
          </div>
          <div className="item">
            <Quickview />
          </div>
        </div>
      </div>
    );
  }
}