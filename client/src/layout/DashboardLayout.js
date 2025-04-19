import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaUserTie, FaUsers, FaCalendarCheck, FaPlaneDeparture, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">🟪 LOGO</div>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>

        <div className="nav-section">
          <p className="section-title">Recruitment</p>
          <NavLink to="/dashboard/candidates">
            <FaUserTie /> Candidates
          </NavLink>
        </div>

        <div className="nav-section">
          <p className="section-title">Organization</p>
          <NavLink to="/dashboard/employees">
            <FaUsers /> Employees
          </NavLink>
          <NavLink to="/dashboard/attendance">
            <FaCalendarCheck /> Attendance
          </NavLink>
          <NavLink to="/dashboard/leaves">
            <FaPlaneDeparture /> Leaves
          </NavLink>
        </div>

        <div className="nav-section">
          <p className="section-title">Others</p>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
