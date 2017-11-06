import React from 'react';
import PouchDB from 'pouchdb';

import $ from 'jquery';

export default class Quickview extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        total_reads:0,
        last_read:0,
      }
    }
    
    componentWillMount(){

    }

    componentDidMount() {

        socket.emit('get_last_read')
        socket.emit('get_read_count');

        socket.on('last_read',res => {
            //console.log('last read ',res);
            this.setState({last_read:res.data.time})
        })

        socket.on('read_count',res => {
            //console.log('read count ',res);
            this.setState({total_reads:res.data.count})
        })

        socket.on('db_changes',data =>{

            socket.emit('get_last_read')
            socket.emit('get_read_count');
        })
        
    }
    componentWillReceiveProps(nextProps){
    }

    componentWillUnmount(){
        socket.off('db_changes');
        socket.off('last_read');
        socket.off('read_count');
    }

    getLastReadTime(){
        this.setState({last_read:(new Date().getTime())})
    }

    getTotalMeasurements(){
        this.setState({total_reads:this.state.total_reads+1})
    }
    
       
    render() {
        let last_read = (new Date(this.state.last_read)).toLocaleString('es-CL');

        return (
            <div>
                <a className="ui teal label">
                    Mediciones Totales
                    <div className="detail"> {this.state.total_reads}  </div>
                </a>

                <a className="ui blue label">
                    Última Medición
                    <div className="detail"> {last_read} </div>
                </a>
            </div>
        );
    }
}
