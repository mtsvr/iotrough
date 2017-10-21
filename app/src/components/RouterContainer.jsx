import React from 'react';
import { IndexRoute, Router, Route, browserHistory, Redirect } from 'react-router';
import App, { RegisterContainer, AttendeesContainer } from './App.jsx';
import InitialConfig from './InitialConfig.jsx';

export default class RouterContainer extends React.Component{
  render(){
    return (
      <Router history={browserHistory}>
        <Redirect from="/" to="register" />
        <Route path="/" component={App}>
          <IndexRoute component={RegisterContainer} />
          <Route path="init" component={InitialConfig} />
          <Route path="register" component={RegisterContainer} />
          <Route path="attendees" component={AttendeesContainer} />
        </Route>
      </Router>
    );
  }
}
