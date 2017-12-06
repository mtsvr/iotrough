import React from 'react';
import ReactDOM from 'react-dom';

import Slider, { Range } from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';

import $ from 'jquery';

export default class SettingsModalComponent extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            
		}
	}

    componentWillMount(){
        if(this.props.show){

            this.open();
        } else {
            this.close();
        }
        
    }

    componentDidMount(){
        $('#SettingsModal').modal({
            closable: false
        });
        socket.emit('get_config')
        socket.on('config_response', response => {
            console.log('config',response.config)
            this.setState({config:response.config})
        })
    }

    componentWillUnmount(){
        this.close()
        $('#SettingsModal').remove()
    }

    componentWillReceiveProps(nextProps){
        if(!this.props.show && nextProps.show){
            this.open()
        } else if (this.props.show && !nextProps.show) {
            this.close()
        }
    }

    open(){
        $('#SettingsModal').modal('show');
    }

    close(){
        this.props.closeAction();
        $('#SettingsModal').modal('hide');

    }

    approve(){
        if(this.props.approveAction){
            this.props.approveAction(this.state.config)
        } else {
            console.log('missing approve action')
        }

        this.close();
    }

    handlePeriodChange(value) {
        //console.log('period',value)
        let config = this.state.config;
        config.period = value;
        this.setState({
          config:config
        })
    };

    handleLevelChange(value){
        //console.log('level change',value);
        let config = this.state.config;
        config.sensors.lvl.ideal = 3;
        config.sensors.lvl.warning = value[1];
        config.sensors.lvl.alert = value[0];
        this.setState({
            config:config
        })
    }

    handlePhChange(value){
        //console.log('pH change',value);
        let config = this.state.config;
        config.sensors.sph.alert_min = value[0]
        config.sensors.sph.warning_min = value[1]
        config.sensors.sph.ideal = value[2]
        config.sensors.sph.warning_max = value[3]
        config.sensors.sph.alert_max = value[4]
        this.setState({
            config:config
        })
    }

    handleEcChange(value){
        //console.log('ec change',value);
        let config = this.state.config;
        config.sensors.sec.ideal = value[0];
        config.sensors.sec.warning = value[1];
        config.sensors.sec.alert = value[2];
        this.setState({
            config:config
        })
    }

    handleTempChange(value){
        //console.log('temp change',value);
        let config = this.state.config;
        config.sensors.tem.alert_min = value[0]
        config.sensors.tem.warning_min = value[1]
        config.sensors.tem.ideal = value[2]
        config.sensors.tem.warning_max = value[3]
        config.sensors.tem.alert_max = value[4]
        this.setState({
            config:config
        })
    }

    render(){
        let form = (
            <div>

            </div>
        )
        if(this.state.config){
            form = (<div className="ui grid">
                <div className="four wide column">
                    <div className="ui grey label">
                        Lectura en Dias
                        <a className="detail">{this.state.config.period}</a>
                    </div>
                </div>
                <div className="twelve wide column">
                    <Slider dots 
                        min={1}    
                        max={7} 
                        step={1} 
                        defaultValue={this.state.config.period} 
                        onChange={this.handlePeriodChange.bind(this)}/>
                </div>

                <div className="four wide column">
                    <div className="ui blue label">
                        Nivel
                        <a className="detail">
                            <i className="checkmark icon"></i>
                            {this.state.config.sensors.lvl.ideal}
                            <i className="warning sign icon"></i>
                            {this.state.config.sensors.lvl.warning}
                            <i className="remove icon"></i>
                            {this.state.config.sensors.lvl.alert}
                        </a>
                    </div>
                </div>
                <div className="twelve wide column">
                    <Range  min={0} max={3} step={1}
                            allowCross={false}
                            defaultValue={[this.state.config.sensors.lvl.alert,this.state.config.sensors.lvl.warning,this.state.config.sensors.lvl.ideal]} 
                            onChange={this.handleLevelChange.bind(this)}/>
                </div>

                <div className="four wide column">
                    <div className="ui yellow label">
                        pH
                        <a className="detail">
                        <i className="checkmark icon"></i>
                        {this.state.config.sensors.sph.ideal}
                        <i className="warning sign icon"></i>
                        {this.state.config.sensors.sph.warning_min}-{this.state.config.sensors.sph.warning_max} 
                        <i className="remove icon"></i>
                        {this.state.config.sensors.sph.alert_min}-{this.state.config.sensors.sph.alert_max} 
                        </a>
                    </div>
                </div>
                <div className="twelve wide column">
                    <Range  min={0} max={14} step={0.5}
                            allowCross={false}
                            defaultValue={[this.state.config.sensors.sph.alert_min,this.state.config.sensors.sph.warning_min,this.state.config.sensors.sph.ideal,this.state.config.sensors.sph.warning_max,this.state.config.sensors.sph.alert_max]} 
                            onChange={this.handlePhChange.bind(this)}/>
                </div>

                <div className="four wide column">
                    <div className="ui teal label">
                        Electroconductividad
                        <a className="detail">
                            <i className="checkmark icon"></i>
                            {this.state.config.sensors.sec.ideal}
                            <i className="warning sign icon"></i>
                            {this.state.config.sensors.sec.warning}
                            <i className="remove icon"></i>
                            {this.state.config.sensors.sec.alert}
                        </a>
                    </div>
                </div>
                <div className="twelve wide column">
                    <Range  min={0} max={15000} step={100}
                            allowCross={false}
                            defaultValue={[this.state.config.sensors.sec.ideal,this.state.config.sensors.sec.warning,this.state.config.sensors.sec.alert]} 
                            onChange={this.handleEcChange.bind(this)}/>
                </div>

                <div className="four wide column">
                    <div className="ui orange label">
                        Temperatura
                        <a className="detail">
                            <i className="checkmark icon"></i>
                            {this.state.config.sensors.tem.ideal}
                            <i className="warning sign icon"></i>
                            {this.state.config.sensors.tem.warning_min}-{this.state.config.sensors.tem.warning_max} 
                            <i className="remove icon"></i>
                            {this.state.config.sensors.tem.alert_min}-{this.state.config.sensors.tem.alert_max} 
                        </a>
                    </div>
                </div>
                <div className="twelve wide column">
                    <Range  min={-10} max={50} step={1}
                            allowCross={false}
                            defaultValue={[this.state.config.sensors.tem.alert_min,this.state.config.sensors.tem.warning_min,this.state.config.sensors.tem.ideal,this.state.config.sensors.tem.warning_max,this.state.config.sensors.tem.alert_max]} 
                            onChange={this.handleTempChange.bind(this)}/>
                </div>
            </div>)
        }
            

        return(
            <div className="ui modal" id={'SettingsModal'}>
                <div className="header">
                    Configuración
                </div>
                <div className="content">
                    {this.state.config?form:null}
                </div>
                <div className="ui actions">
                ¿Desea Continuar?
                    <div className="ui red button" onClick={this.close.bind(this)}>Cancelar</div>
                    <div className="ui green button" onClick={this.approve.bind(this)}>Guardar</div>
                </div>
            </div>
        )
    }
}