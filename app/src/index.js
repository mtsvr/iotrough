import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from "react-dom";
import RouterContainer from './components/RouterContainer.jsx';
//import { loadState, saveState } from './LocalStore';
import throttle from 'lodash/throttle';


store.subscribe(throttle(() => {
    saveState({
       conections: store.getState().conections,
       event: store.getState().event,
       printer: store.getState().printer
    });
}, 2000));


main();
function main() {
    const app = document.createElement('div');
    document.body.appendChild(app);

    ReactDOM.render(
        
    <Provider store={store}>
      <AppContainer><RouterContainer /></AppContainer>
    </Provider>, app
    )
    if (module.hot) {
        module.hot.accept('./components/RouterContainer.jsx', () => {
            ReactDOM.render(
                <Provider store={store}>
                    <AppContainer component={require('./components/RouterContainer.jsx').default} />
                </Provider>,
                app
            );
        });
    }
}
