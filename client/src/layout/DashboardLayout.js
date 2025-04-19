import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FaUserTie,
  FaUsers,
  FaCalendarCheck,
  FaPlaneDeparture,
  FaSignOutAlt,
  FaSearch,
  FaBars
} from 'react-icons/fa';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleNavClick();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="dashboard-container">
      {!isSidebarOpen && (
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
      )}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo">🟪 LOGO</div>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>

        <div className="nav-section">
          <p className="section-title">Recruitment</p>
          <NavLink to="/dashboard/candidates" onClick={handleNavClick}>
            <FaUserTie /> Candidates
          </NavLink>
        </div>

        <div className="nav-section">
          <p className="section-title">Organization</p>
          <NavLink to="/dashboard/employees" onClick={handleNavClick}>
            <FaUsers /> Employees
          </NavLink>
          <NavLink to="/dashboard/attendance" onClick={handleNavClick}>
            <FaCalendarCheck /> Attendance
          </NavLink>
          <NavLink to="/dashboard/leaves" onClick={handleNavClick}>
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
