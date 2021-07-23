import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import App from './pages/App';
import Eln from './pages/eln';
import Users from './pages/eln/users';

interface RouteType {
  Component: React.ComponentType<any>;
  path: string;
}
const routes: RouteType[] = [
  { Component: Users, path: '/eln/users' },
  { Component: Eln, path: '/eln' },
];

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path}>
            <App Component={<Component />} />
          </Route>
        ))}
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
