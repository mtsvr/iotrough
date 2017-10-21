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
        
        return (
            <div>
                <a className="ui teal label">
                    Mediciones Totales
                    <div className="detail"> 100 </div>
                </a>

                <a className="ui blue label">
                    Última Medición
                    <div className="detail"> 12:30 10/10/2017 </div>
                </a>
            </div>
        );
    }
}
