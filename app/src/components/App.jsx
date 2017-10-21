import React from 'react'
import { render } from 'react-dom'
import { Link } from 'react-router'
import '../../semantic/dist/semantic.css';

import RadioOption from './Utilities.jsx';
import Button from './Button.jsx';
import Quickview from './Quickview.jsx';

import Dashboard from './Dashboard.jsx'
import Nodes from './Nodes.jsx'

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
    <TabContainer active="dashboard" />
    )
  }
}

export class NodesContainer extends React.Component{
  render() {
    return (
    <TabContainer active="nodes" />
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