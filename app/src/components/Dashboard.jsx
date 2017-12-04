import React from 'react';
import ReactDOM from 'react-dom';

import axios from "axios";
import $ from 'jquery';

export default class Dashboard extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            nodes:[],
            last_reads:[],
            period:7
        }
    }

    componentWillMount(){
        
    }

    componentDidMount(){
        socket.emit('get_nodes_info');
        socket.on('nodes_info',data => {
            this.setState({nodes:data.info.nodes},function(){
                this.getLastReads();
            }.bind(this))
        })

        socket.on('node_last_read',res => {
            let node_id = res.node_id;
            let last_reads = JSON.parse(JSON.stringify(this.state.last_reads));
            
            if(this.state.last_reads.findIndex(r => r.key==node_id)!=-1){
                let read_idx = last_reads.findIndex(r => r.key==node_id);
                last_reads.splice(read_idx,1);
            }
            last_reads.push(res.read)
            this.setState({last_reads:last_reads})
        })

        socket.emit('get_all_reads',this.state.period);
        socket.on('all_reads',data => {
            //console.log(data.data);
        });

        socket.on('db_changes',data => {
            socket.emit('get_nodes_info');
            socket.emit('get_all_reads',this.state.period);
            this.getLastReads();
            this.getAllReads();
        })
    }

    componentWillUnmount(){
        socket.off('db_changes');
        socket.off('nodes_info');
        socket.off('all_reads');
        socket.off('node_last_read');
    }

    getLastReads(){
        if(this.state.nodes.length>0){
            for(let n of this.state.nodes){
                setTimeout(function(){
                    socket.emit('get_node_last_read',{node_id:n.node_id});
                },100)
            }
        }
    }
    getAllReads(){
        if(this.state.nodes.length > 0){
            for(let n of this.state.nodes){
                setTimeout(function(){
                    socket.emit('get_all_reads',{node_id:n.node_id,days:this.state.period});
                }, 100)
            }
        }
    }

    getReadStatus(node_id,sensor){
        
        let sensor_values = {
            lvl:{warning:1,alert:0},
            sph:{warning:2,alert:3},
            sec:{warning:10,alert:15},
            tem:{warning:10,alert:15}
        }

        let alert_value = 0;
        let warning_value = alert_value+1;
        let status = 'optimal';

        let last_read = this.state.last_reads.find(r => r.key==node_id)
        
        if(last_read && last_read.doc.data[sensor]){
            let last_read_value = last_read.doc.data[sensor];

            if(sensor=='lvl'){
                alert_value = sensor_values[sensor].alert;
                warning_value = sensor_values[sensor].warning;

                if(last_read_value <= alert_value){
                    status = 'alert'
                } else if (last_read_value <= warning_value){
                    status = 'warning';
                }

            } else if(sensor=='sph'){
                alert_value = sensor_values[sensor].alert;
                warning_value = sensor_values[sensor].warning;

                if(last_read_value <= 7-alert_value || last_read_value >= 7+alert_value){
                    status = 'alert'
                } else if (last_read_value <= 7-warning_value || last_read_value >= 7+warning_value){
                    status = 'warning';
                }

            } else if(sensor=='sec'){
                alert_value = sensor_values[sensor].alert;
                warning_value = sensor_values[sensor].warning;

                if(last_read_value >= alert_value){
                    status = 'alert'
                } else if (last_read_value >= warning_value){
                    status = 'warning';
                }

            } else if(sensor=='tem'){
                alert_value = sensor_values[sensor].alert;
                warning_value = sensor_values[sensor].warning;

                if(last_read_value <= 15-alert_value || last_read_value >= 15+alert_value){
                    status = 'alert'
                } else if (last_read_value <= 15-warning_value || last_read_value >= 15+warning_value){
                    status = 'warning';
                }
            }

        } else {
            //no read for sensor in node
            return ( <i className="red remove icon"></i> )
        }

        if(status=='alert'){
            return ( <i className="red remove icon"></i> )
        } else if (status=='warning'){
            return ( <i className="orange warning sign icon"></i> )
        }
        
        return (
            <i className="green checkmark icon"></i>
        )
    }

    render(){
        return (
            <div>
                <div className="ui stackable grid">
                    <div className="four wide column">
                        <div className="ui horizontal segments">
                            <div className="ui segment">
                                <div className="ui small statistic">
                                    <div className="value"><i className="circular blue theme icon"></i></div>
                                    <div className="label">Nivel</div>
                                </div>
                            </div>
                            <div className="ui segment">
                                <table className="ui very basic table">
                                    <tbody>
                                        {this.state.nodes.map((e,i) => {
                                            return (
                                            <tr key={'lvl'+e.node_id}>
                                                <td>{e.node_name}</td>
                                                <td>{this.getReadStatus(e.node_id,'lvl')}</td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="four wide column">
                        <div className="ui horizontal segments">
                            <div className="ui segment">
                                <div className="ui small statistic">
                                    <div className="value"><i className="circular yellow lemon icon"></i></div>
                                    <div className="label">Ph</div>
                                </div>
                            </div>
                            <div className="ui segment">
                                <table className="ui very basic table">
                                    <tbody>
                                        {this.state.nodes.map((e,i) => {
                                            return (
                                            <tr key={'sph'+e.node_id}>
                                                <td>{e.node_name}</td>
                                                <td>{this.getReadStatus(e.node_id,'sph')}</td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="four wide column">
                        <div className="ui horizontal segments">
                            <div className="ui segment">
                                <div className="ui small statistic">
                                    <div className="value"><i className="circular teal lightning icon"></i></div>
                                    <div className="label">E-Conduct.</div>
                                </div>
                            </div>
                            <div className="ui segment">
                                <table className="ui very basic collapsable table">
                                    <tbody>
                                        {this.state.nodes.map((e,i) => {
                                            return (
                                            <tr key={'sec'+e.node_id}>
                                                <td>{e.node_name}</td>
                                                <td>{this.getReadStatus(e.node_id,'sec')}</td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="four wide column">
                        <div className="ui horizontal segments">
                            <div className="ui segment">
                                <div className="ui small statistic">
                                    <div className="value"><i className="circular orange half thermometer icon"></i></div>
                                    <div className="label">Temperatura</div>
                                </div>
                            </div>
                            <div className="ui segment">
                                <table className="ui very basic table">
                                    <tbody>
                                        {this.state.nodes.map((e,i) => {
                                            return (
                                            <tr key={'tem'+e.node_id}>
                                                <td>{e.node_name}</td>
                                                <td>{this.getReadStatus(e.node_id,'tem')}</td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="five wide column">
                        <div className="ui card">
                            <div className="content">
                                <div className="ui horizontal statistic">
                                    <div className="value">{this.state.nodes.length}</div>
                                    <div className="label">Nodos</div>
                                </div>
                            </div>
                            <div className="content">
                                <table className="ui very basic celled table">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>ID</th>
                                            <th>Agregado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.nodes.map((e,i)=>{
                                            return (
                                                <tr key={e.node_id}>
                                                    <td>{e.node_name}</td>
                                                    <td>{e.node_id}</td>
                                                    <td>{(new Date(e.added)).toLocaleDateString('es-CL')}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="eleven wide column">
                        <div className="ui fluid card">
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