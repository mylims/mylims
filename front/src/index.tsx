import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import App from './pages/App';
import Login from './pages/login';
import NoMatch from './pages/404';
// Eln
import Eln from './pages/eln';
import Users from './pages/eln/users';
// File sync
import List from './addons/fileSync/pages/list';
import Create from './addons/fileSync/pages/create';
import Files from './addons/fileSync/pages/files';
import Edit from './addons/fileSync/pages/edit';

interface RouteType {
  Component: React.ComponentType<{}>;
  path: string;
}
const routes: RouteType[] = [
  { Component: Users, path: '/eln/users' },
  { Component: Eln, path: '/eln' },
  { Component: List, path: '/fileSync/list' },
  { Component: Create, path: '/fileSync/create' },
  { Component: Files, path: '/fileSync/files/:id' },
  { Component: Edit, path: '/fileSync/edit/:id' },
  { Component: Login, path: '/login' },
  { Component: NoMatch, path: '*' },
];

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        {routes.map(({ path, Component }) => (
          <Route key={path} path={path}>
            <App Component={Component} />
          </Route>
        ))}
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
