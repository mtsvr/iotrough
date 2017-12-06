import React from 'react';
import ReactRouter from 'react-router'
import ReactDOM from 'react-dom';

import axios from "axios";
import $ from 'jquery';

import {Line} from 'react-chartjs-2';


export default class Nodes extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            node_id:'',
            node_name:'',
            period:7,
            chart_data:
            {
                labels:[],
                data:{
                    lvl:[],
                    sph:[],
                    sec:[],
                    tem:[]
                }
            }
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

        socket.emit('get_node_data',{node_id:this.state.node_id,days:this.state.period});
        socket.on('node_data',res => {
            if(res.node_id==this.state.node_id){
                let labels = [];
                let data = {
                    lvl:[],
                    sph:[],
                    sec:[],
                    tem:[]
                };
                for(let d of res.data){
                    labels.push((new Date(d.doc.time)).toLocaleString('es-CL'));
                    for(let sensor in d.doc.data){
                        data[sensor].push(d.doc.data[sensor]);
                    }
                }
                let chart_data = {
                    labels:labels,
                    data:data
                }

                console.log('chart data',chart_data)
                this.setState({chart_data:chart_data});
            }
        });

        socket.on('db_changes',data => {
            if(data.node_id && data.node_id==this.state.node_id){
                socket.emit('get_nodes_info');
                socket.emit('get_node_data',{node_id:this.state.node_id,days:this.state.period});
            }
        })
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.id!=this.state.node_id){
            console.log('node', nextProps.params.id)
            this.setState({node_id:nextProps.params.id},function(){
                socket.emit('get_nodes_info');
                socket.emit('get_node_data',{node_id:this.state.node_id,days:this.state.period});
            })
        }
    }

    componentWillUnmount(){
        socket.off('db_changes')
        socket.off('nodes_info');
        socket.off('node_data');
    }

    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    lowOpacityColor(hex,opacity=100){
        let rgb = this.hexToRgb(hex);
        return 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+opacity/100+')'
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
                                <Line   options={{scales: {yAxes: [{ticks: {beginAtZero:true}}]}}} 
                                        data={{ labels:this.state.chart_data.labels,
                                                datasets:[{ label:'Nivel',
                                                            borderColor:'#2185D0',
                                                            backgroundColor:this.lowOpacityColor('#2185D0',20),
                                                            data:this.state.chart_data.data.lvl}]}} />
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="ui fluid card">
                            <div className="content">
                                <Line   data={{labels:this.state.chart_data.labels,
                                        datasets:[{ label:'Ph',
                                                    borderColor:'#FBBD08',
                                                    backgroundColor:this.lowOpacityColor('#FBBD08',20),
                                                    data:this.state.chart_data.data.sph}]}} />
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="ui fluid card">
                            <div className="content">
                                <Line   data={{labels:this.state.chart_data.labels, 
                                        datasets:[{ label:'E-Conduct.',
                                                    borderColor:'#00B5AD', 
                                                    backgroundColor:this.lowOpacityColor('#00B5AD',20),
                                                    data:this.state.chart_data.data.sec}]}} />
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="ui fluid card">
                            <div className="content">
                                <Line   data={{labels:this.state.chart_data.labels, 
                                        datasets:[{ label:'Temperatura',   
                                                    borderColor:'#F2711C',
                                                    backgroundColor:this.lowOpacityColor('#F2711C',20),
                                                    data:this.state.chart_data.data.tem}]}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}