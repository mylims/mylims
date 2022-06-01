import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

import EventDetail from '@/addons/events/pages/EventDetail';
import EventsList from '@/addons/events/pages/EventsList';
import Create from '@/addons/fileSync/pages/create';
import Edit from '@/addons/fileSync/pages/edit';
import Files from '@/addons/fileSync/pages/files';
import List from '@/addons/fileSync/pages/list';
import NoMatch from '@/pages/404';
import App from '@/pages/App';
import Login from '@/pages/login';
import MeasurementCreate from '@/pages/measurements/Create';
import MeasurementDetail from '@/pages/measurements/Detail';
import MeasurementsList from '@/pages/measurements/List';
import NotebookCreate from '@/pages/notebook/Create';
import NotebookDetail from '@/pages/notebook/Detail';
import NotebookList from '@/pages/notebook/List';
import SampleDetail from '@/pages/samples/Detail';
import SampleUpdate from '@/pages/samples/Update';
import SampleCreate from '@/pages/samples/create/Sample';
import WaferCreate from '@/pages/samples/create/Wafer';
import DeviceList from '@/pages/samples/list/Device';
import DyeList from '@/pages/samples/list/Dye';
import SampleList from '@/pages/samples/list/Sample';
import WaferList from '@/pages/samples/list/Wafer';
import { MultiCreate } from '@/pages/samples/multiCreate/Default';
import Users from '@/pages/users';

function AppRoutes() {
  const routes = useRoutes([
    { path: 'users', element: <App Component={Users} /> },
    { path: 'login', element: <App Component={Login} /> },
    { path: '*', element: <App Component={NoMatch} /> },
    {
      path: 'fileSync',
      children: [
        { path: 'list', element: <App Component={List} /> },
        { path: 'create', element: <App Component={Create} /> },
        { path: 'files/:id', element: <App Component={Files} /> },
        { path: 'edit/:id', element: <App Component={Edit} /> },
      ],
    },
    {
      path: 'event',
      children: [
        { path: 'list', element: <App Component={EventsList} /> },
        { path: 'detail/:id', element: <App Component={EventDetail} /> },
      ],
    },
    {
      path: 'sample',
      children: [
        {
          path: 'list',
          children: [
            { path: 'wafer', element: <App Component={WaferList} /> },
            { path: 'sample', element: <App Component={SampleList} /> },
            { path: 'dye', element: <App Component={DyeList} /> },
            { path: 'device', element: <App Component={DeviceList} /> },
          ],
        },
        { path: 'detail/:kind/:id', element: <App Component={SampleDetail} /> },
        {
          path: 'create',
          children: [
            { path: 'wafer', element: <App Component={WaferCreate} /> },
            { path: 'sample/:id', element: <App Component={SampleCreate} /> },
          ],
        },
        {
          path: 'multiCreate',
          children: [
            { path: 'sample', element: <App Component={MultiCreate} /> },
          ],
        },
        { path: 'update/:kind/:id', element: <App Component={SampleUpdate} /> },
      ],
    },
    {
      path: 'measurement',
      children: [
        { path: 'list', element: <App Component={MeasurementsList} /> },
        {
          path: 'detail/:type/:id',
          element: <App Component={MeasurementDetail} />,
        },
        { path: 'create/:id', element: <App Component={MeasurementCreate} /> },
      ],
    },
    {
      path: 'notebook',
      children: [
        { path: 'list', element: <App Component={NotebookList} /> },
        { path: 'detail/:id', element: <App Component={NotebookDetail} /> },
        { path: 'create', element: <App Component={NotebookCreate} /> },
      ],
    },
  ]);
  return routes;
}

render(
  <React.StrictMode>
    <Router>
      <AppRoutes />
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
