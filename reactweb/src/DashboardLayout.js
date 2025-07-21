import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">📝My Dashboard</h2>
        <nav className="nav">
         <nav className="nav">
  <Link to="/" className="nav-link">Dashboard</Link>
  <Link to="/add" className="nav-link">Add Todo</Link>
  <Link to="/list" className="nav-link">Saved Todos</Link>
</nav>

        </nav>
      </aside>

      <main className="main-content">
        <div className="content">
          <Outlet />  
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
