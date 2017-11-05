import React from 'react';
import ReactDOM from 'react-dom';

import axios from "axios";
import $ from 'jquery';

export default class Dashboard extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            nodes:[],
            last_reads:{}
        }
    }

    componentWillMount(){
        
    }

    componentDidMount(){
        socket.emit('get_nodes_info');
        socket.on('nodes_info',data => {
            console.log('nodes info stuff',data.info.nodes)
            this.setState({nodes:data.info.nodes})
        })
    }

    render(){
        return (
            <div>
                <div className="ui stackable grid">
                    <div className="four wide column">
                        <div className="ui card">
                            <div className="content">
                                contenido
                            </div>
                        </div>
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <div className="content">
                                contenido
                            </div>
                        </div>
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <div className="content">
                                contenido
                            </div>
                        </div>
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <div className="content">
                                contenido
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}