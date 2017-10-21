import React from 'react';
import PouchDB from 'pouchdb';

import $ from 'jquery';

export default class Quickview extends React.Component {
    constructor(props){
      super(props);
      this.state = {

      }
    }
    
    componentWillMount(){

    }

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps){

    }
    
       
    render() {
        let event = []
        
        return (
            <div>
                <a className="ui yellow label">
                    Evento:
                    <div className="detail"> { event } </div>
                </a>

                <a className="ui yellow label">
                    Total
                    <div className="detail"> </div>
                </a>

                <a className="ui yellow label">
                    Acreditados
                    <div className="detail"></div>
                </a>

                <a className="ui yellow label">
                    Restantes
                    <div className="detail"></div>
                </a>
            </div>
        );
    }
}
