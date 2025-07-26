import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    myIssues: 0
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch recent issues
      const issuesResponse = await api.get('/issues?limit=5&sortBy=createdAt&sortOrder=desc');
      setRecentIssues(issuesResponse.data.issues);

      // Calculate stats from the issues
      const allIssuesResponse = await api.get('/issues?limit=1000');
      const allIssues = allIssuesResponse.data.issues;
      
      const newStats = {
        total: allIssues.length,
        open: allIssues.filter(issue => issue.status === 'Open').length,
        inProgress: allIssues.filter(issue => issue.status === 'In Progress').length,
        resolved: allIssues.filter(issue => issue.status === 'Resolved' || issue.status === 'Closed').length,
        myIssues: allIssues.filter(issue => issue.createdBy._id === user.id).length
      };
      
      setStats(newStats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#ff6b6b';
      case 'In Progress': return '#4ecdc4';
      case 'Testing': return '#45b7d1';
      case 'Resolved': return '#96ceb4';
      case 'Closed': return '#6c5ce7';
      default: return '#a0a0a0';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#ff3838';
      case 'High': return '#ff6b6b';
      case 'Medium': return '#feca57';
      case 'Low': return '#48dbfb';
      default: return '#a0a0a0';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}! 👋</h1>
        <p>Here's an overview of your issue tracker</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Issues</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <h3>{stats.open}</h3>
            <p>Open Issues</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <h3>{stats.myIssues}</h3>
            <p>My Issues</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/issues/new" className="action-btn primary">
          🐛 Create New Issue
        </Link>
        <Link to="/issues" className="action-btn secondary">
          📋 View All Issues
        </Link>
      </div>

      <div className="recent-issues">
        <h2>Recent Issues</h2>
        {recentIssues.length === 0 ? (
          <div className="empty-state">
            <p>No issues yet. <Link to="/issues/new">Create your first issue!</Link></p>
          </div>
        ) : (
          <div className="issues-list">
            {recentIssues.map((issue) => (
              <Link to={`/issues/${issue._id}`} key={issue._id} className="issue-card">
                <div className="issue-header">
                  <h3>{issue.title}</h3>
                  <div className="issue-meta">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(issue.status) }}
                    >
                      {issue.status}
                    </span>
                    <span 
                      className="priority-badge"
                      style={{ color: getPriorityColor(issue.priority) }}
                    >
                      {issue.priority}
                    </span>
                  </div>
                </div>
                <p className="issue-description">
                  {issue.description.length > 100 
                    ? `${issue.description.substring(0, 100)}...` 
                    : issue.description
                  }
                </p>
                <div className="issue-footer">
                  <span>By {issue.createdBy.username}</span>
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;