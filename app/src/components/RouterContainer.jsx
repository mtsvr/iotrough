import React from 'react';
import { IndexRoute, Router, Route, hashHistory, Redirect, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history'
import App from './App.jsx';
import Dashboard from './Dashboard.jsx';
import Nodes from './Nodes.jsx';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

export default class RouterContainer extends React.Component{
  render(){
    return (
      <Router history={appHistory}>
        <Redirect from="/" to="dashboard" />
        <Route path="/" component={App}>
          <IndexRoute component={Dashboard} />
          <Route path={"/dashboard"} component={Dashboard} />
          <Route path={"/nodes/:id"} component={Nodes} />
        </Route>
      </Router>
    );
  }
}
