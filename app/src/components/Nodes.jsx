import React from 'react';
import ReactDOM from 'react-dom';

import axios from "axios";
import $ from 'jquery';

export default class Nodes extends React.Component {
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