import React from 'react';
import ReactRouter from 'react-router'
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
        console.log('node props',this.props.match)
        console.log('node props',this.props.params)
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