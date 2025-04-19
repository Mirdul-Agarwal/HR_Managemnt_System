

// AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './layout/DashboardLayout';
import Candidates from './pages/Candidates';
import Employees from './pages/Employee';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="candidates" />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leaves" element={<Leaves />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
