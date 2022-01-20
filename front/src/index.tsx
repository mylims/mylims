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
import MeasurementDetail from '@/pages/measurements/transfer/detail';
import MeasurementsList from '@/pages/measurements/transfer/list';
import DeviceDetail from '@/pages/samples/detail/Device';
import DyeDetail from '@/pages/samples/detail/Dye';
import SampleDetail from '@/pages/samples/detail/Sample';
import WaferDetail from '@/pages/samples/detail/Wafer';
import WaferCreate from '@/pages/samples/form/Wafer';
import DeviceList from '@/pages/samples/list/Device';
import DyeList from '@/pages/samples/list/Dye';
import SampleList from '@/pages/samples/list/Sample';
import WaferList from '@/pages/samples/list/Wafer';
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
      path: 'measurement',
      children: [
        { path: 'list', element: <App Component={MeasurementsList} /> },
        {
          path: 'detail/:type/:id',
          element: <App Component={MeasurementDetail} />,
        },
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
        {
          path: 'detail',
          children: [
            { path: 'wafer/:id', element: <App Component={WaferDetail} /> },
            { path: 'sample/:id', element: <App Component={SampleDetail} /> },
            { path: 'dye/:id', element: <App Component={DyeDetail} /> },
            { path: 'device/:id', element: <App Component={DeviceDetail} /> },
          ],
        },
        {
          path: 'form',
          children: [
            { path: 'wafer', element: <App Component={WaferCreate} /> },
          ],
        },
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
