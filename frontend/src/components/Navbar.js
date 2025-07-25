import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span>🐛</span>
            <span>Issue Tracker</span>
          </Link>
          <div className="nav-menu">
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className={`nav-link ${isActive('/register') ? 'active' : ''}`}
            >
              Register
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          <span>🐛</span>
          <span>Issue Tracker</span>
        </Link>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            📊 Dashboard
          </Link>
          <Link 
            to="/issues" 
            className={`nav-link ${isActive('/issues') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            📋 Issues
          </Link>
          <Link 
            to="/issues/new" 
            className={`nav-link ${isActive('/issues/new') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            ➕ New Issue
          </Link>
          
          <div className="nav-user">
            <span className="user-greeting">Hello, {user?.username}! 👋</span>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>

        <div 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;