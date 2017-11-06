import React from 'react';
import ReactRouter from 'react-router'
import ReactDOM from 'react-dom';

import axios from "axios";
import $ from 'jquery';

export default class Nodes extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            node_id:'',
            node_name:''
        }
    }

    componentWillMount(){
        this.setState({node_id:this.props.params.id},() => {
            socket.emit('get_nodes_info');
        })
        console.log('node', this.props.params.id)
    }

    componentDidMount(){
        socket.emit('get_nodes_info');
        socket.on('nodes_info',data=>{
            let node = data.info.nodes.find(n => n.node_id==this.state.node_id);
            this.setState({node_name:node.node_name});
        })
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.id!=this.state.node_id){
            console.log('node', nextProps.params.id)
            this.setState({node_id:nextProps.params.id},function(){
                socket.emit('get_nodes_info');
            })
        }
    }

    componentWillUnmount(){
        socket.off('nodes_info');
    }

    render(){
        return (
            <div>
                <div className="ui fluid card">
                    <div className="content">
                        <div className="ui horizontal large statistic">
                            <div className="label"><i className="disabled huge microchip icon"></i></div>
                            <div className="value">{this.state.node_name}</div>
                        </div>
                    </div>
                </div>
                <div className="ui two column grid">
                    <div className="column">
                        <div className="ui fluid card">
                            <div className="content">
                                contenido
                            </div>
                        </div>
                    </div>
                    <div className="column"></div>
                    <div className="column"></div>
                    <div className="column"></div>
                </div>
            </div>
        )
    }
}