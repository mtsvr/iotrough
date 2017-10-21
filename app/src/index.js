import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from "react-dom";
import RouterContainer from './components/RouterContainer.jsx';
//import { loadState, saveState } from './LocalStore';
import throttle from 'lodash/throttle';

main();
function main() {
    const app = document.createElement('div');
    document.body.appendChild(app);

    ReactDOM.render(
        
      <AppContainer><RouterContainer /></AppContainer>, app
    )
    if (module.hot) {
        module.hot.accept('./components/RouterContainer.jsx', () => {
            ReactDOM.render(
                    <AppContainer component={require('./components/RouterContainer.jsx').default} />,
                app
            );
        });
    }
}
