import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// File sync
import Create from './addons/fileSync/pages/create';
import Edit from './addons/fileSync/pages/edit';
import Files from './addons/fileSync/pages/files';
import List from './addons/fileSync/pages/list';
// Base
import NoMatch from './pages/404';
import App from './pages/App';
// Eln
import Users from './pages/eln/users';
import Login from './pages/login';
// Measurements
import MeasurementDetail from './pages/measurements/transfer/detail';
import MeasurementsList from './pages/measurements/transfer/list';
import SamplesList from './pages/samples/list';
import SamplesDetail from './pages/samples/detail';

// Events
import EventDetail from '@/addons/events/pages/EventDetail';
import EventsList from '@/addons/events/pages/EventsList';

interface RouteType {
  Component: React.ComponentType<Record<string, never>>;
  path: string;
}
const routes: RouteType[] = [
  { Component: Users, path: '/eln/users' },
  { Component: List, path: '/fileSync/list' },
  { Component: Create, path: '/fileSync/create' },
  { Component: Files, path: '/fileSync/files/:id' },
  { Component: Edit, path: '/fileSync/edit/:id' },
  { Component: EventsList, path: '/event/list' },
  { Component: EventDetail, path: '/event/detail/:id' },
  { Component: MeasurementsList, path: '/measurement/list' },
  { Component: MeasurementDetail, path: '/measurement/detail/:type/:id' },
  { Component: SamplesList, path: '/sample/list' },
  { Component: SamplesDetail, path: '/sample/detail/:id' },
  { Component: Login, path: '/login' },
  { Component: NoMatch, path: '*' },
];

render(
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
