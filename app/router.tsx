import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ClinicManagementPage from './clinic-management/page';
import LoginPage from './login/page';
import Home from './page';

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <Home />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/clinic-management',
    element: <ClinicManagementPage />
  },
]);

export default router;
