import React from 'react';
import ReactDOM from 'react-dom';

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
            console.log('config',response)
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
            this.props.approveAction()  
        } else {
            console.log('missing approve action')
        }

        this.close();
    }

    render(){

        return(
            <div className="ui modal" id={'SettingsModal'}>
                <div className="header">
                    Configuración
                </div>
                <div className="content">

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