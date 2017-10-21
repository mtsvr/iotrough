import React from 'react';
import ReactDOM from 'react-dom';

import axios from "axios";
import $ from 'jquery';

export default class Dashboard extends React.Component {
    constructor(props){
        super(props)
        this.state ={

        }
    }

    componentWillMount(){

    }

    componentDidMount(){

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