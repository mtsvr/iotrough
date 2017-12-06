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
import SettingsModalComponent from './ModalComponent.jsx';

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
      settings_modal:false
    }
  }

  componentWillMount(){
    
  }

  componentDidMount(){
    socket.emit('db_connect');
    socket.on('db_connection_resolve', data => {
      console.log('db connection resolve',data)

    })

    socket.emit('get_config')
    socket.on('config_response', response => {
        console.log('config',response.config)
        this.setState({config:response.config})
    })

    socket.on('save_config_response', response => {
      if(response.status=='ok'){
        socket.emit('get_config')
        this.closeSettingsModal();
      }
    })

  }

  saveSettings(config){
    let new_config = config;
    new_config['_id']='config';
    new_config['_rev']=this.state.config._rev;
    if(new_config._id && new_config._rev){
      socket.emit('save_config',new_config);
    }
    

  }

  openSettingsModal(){
    this.setState({settings_modal:true})
  }

  closeSettingsModal(){
    this.setState({settings_modal:false})
  }

  render() {
      return (
        <div className="detatch">
          <Header settingsClickHandler={this.openSettingsModal.bind(this)}/>

          <div className="ui main fluid container">
            <div className="ui bottom tab container active">
              { this.props.children }
            </div>
          </div>
          <SettingsModalComponent show={this.state.settings_modal}
                          closeAction={this.closeSettingsModal.bind(this)}
                          approveAction={this.saveSettings.bind(this)}/>
          
        </div>
      );
  }
}

export class Header extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      nodes:[]
    }
  }

  componentWillMount(){
    
  }

  componentDidMount(){
    $('#nav')
      .dropdown({
        on: 'hover'
      })
    ;
    socket.emit('get_nodes_info');
    socket.on('nodes_info',data => {
      this.setState({nodes:data.info.nodes})
    })

    socket.on('db_changes',data =>{
      if(data.change.id=='info'){
        socket.emit('get_nodes_info');
      }
    })
  }

  componentWillUnmount(){
    socket.off('db_changes');
    socket.off('nodes_info');
  }

  settigsClick(){
    console.log('settings clicked')
    this.props.settingsClickHandler();
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
              <i className="sidebar icon"></i>
              <div className="menu">
                <Link to='/dashboard' className="item "><i className="home icon"></i> Dashboard</Link>
                {this.state.nodes.map((e,i) => {
                  return (
                    <Link key={e.node_id} id={e.node_id} to={'/nodes/'+e.node_id} className="item"><i className="microchip icon"></i> {e.node_name} </Link>
                  )
                })}
              </div>
            </div>
            <a className="ui icon item" id="config" onClick={this.settigsClick.bind(this)}>
                <i className="setting icon"></i>
              </a>
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