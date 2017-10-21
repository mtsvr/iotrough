import React from 'react';
import { IndexRoute, Router, Route, hashHistory, Redirect, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history'
import App, { DashboardContainer, NodesContainer } from './App.jsx';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

export default class RouterContainer extends React.Component{
  render(){
    return (
      <Router history={appHistory}>
        <Redirect from="/" to="dashboard" />
        <Route path="/" component={App}>
          <IndexRoute component={DashboardContainer} />
          <Route path={"/dashboard"} component={DashboardContainer} />
          <Route path={"/nodes/:nodeId"} component={NodesContainer} />
        </Route>
      </Router>
    );
  }
}
