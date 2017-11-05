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

        this.getLastReadTime();
        this.getTotalMeasurements();

        socket.on('db_changes',data =>{
            this.getLastReadTime();
            this.getTotalMeasurements();

        })
        
    }
    componentWillReceiveProps(nextProps){
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
