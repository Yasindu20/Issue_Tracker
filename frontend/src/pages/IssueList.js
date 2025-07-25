import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import CustomDropdown from '../components/CustomDropdown';
import api from '../services/api';

const IssueList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    testing: 0,
    resolved: 0,
    closed: 0,
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  });
  
  const { addToast } = useToast();
  const limit = 10;

  // Status options with icons and counts
  const statusOptions = [
    { value: '', label: 'All Statuses', icon: '📊', count: stats.total },
    { value: 'Open', label: 'Open', icon: '🔴', count: stats.open },
    { value: 'In Progress', label: 'In Progress', icon: '⚡', count: stats.inProgress },
    { value: 'Testing', label: 'Testing', icon: '🧪', count: stats.testing },
    { value: 'Resolved', label: 'Resolved', icon: '✅', count: stats.resolved },
    { value: 'Closed', label: 'Closed', icon: '🏁', count: stats.closed }
  ];

  // Priority options with icons and counts
  const priorityOptions = [
    { value: '', label: 'All Priorities', icon: '🎯', count: stats.total },
    { value: 'Critical', label: 'Critical', icon: '🚨', count: stats.critical },
    { value: 'High', label: 'High', icon: '🔥', count: stats.high },
    { value: 'Medium', label: 'Medium', icon: '⚡', count: stats.medium },
    { value: 'Low', label: 'Low', icon: '💧', count: stats.low }
  ];

  // Sort options with icons
  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest First', icon: '📅' },
    { value: 'createdAt-asc', label: 'Oldest First', icon: '📆' },
    { value: 'title-asc', label: 'Title A-Z', icon: '🔤' },
    { value: 'title-desc', label: 'Title Z-A', icon: '🔽' },
    { value: 'priority-desc', label: 'Priority High-Low', icon: '⬆️' },
    { value: 'priority-asc', label: 'Priority Low-High', icon: '⬇️' },
    { value: 'updatedAt-desc', label: 'Recently Updated', icon: '⏰' }
  ];

  useEffect(() => {
    fetchIssues();
    fetchStats();
  }, [filters, pagination.current]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/issues?limit=1000');
      const allIssues = response.data.issues;
      
      const newStats = {
        total: allIssues.length,
        open: allIssues.filter(issue => issue.status === 'Open').length,
        inProgress: allIssues.filter(issue => issue.status === 'In Progress').length,
        testing: allIssues.filter(issue => issue.status === 'Testing').length,
        resolved: allIssues.filter(issue => issue.status === 'Resolved').length,
        closed: allIssues.filter(issue => issue.status === 'Closed').length,
        critical: allIssues.filter(issue => issue.priority === 'Critical').length,
        high: allIssues.filter(issue => issue.priority === 'High').length,
        medium: allIssues.filter(issue => issue.priority === 'Medium').length,
        low: allIssues.filter(issue => issue.priority === 'Low').length
      };
      
      setStats(newStats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current,
        limit,
        ...filters
      });

      const response = await api.get(`/issues?${params}`);
      setIssues(response.data.issues);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      addToast('Failed to fetch issues', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSortChange = (value) => {
    const [sortBy, sortOrder] = value.split('-');
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#ef4444';
      case 'In Progress': return '#06b6d4';
      case 'Testing': return '#8b5cf6';
      case 'Resolved': return '#10b981';
      case 'Closed': return '#6b7280';
      default: return '#9ca3af';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#ca8a04';
      case 'Low': return '#059669';
      default: return '#6b7280';
    }
  };

  return (
    <div className="issue-list-page">
      <div className="page-header">
        <div className="header-content">
          <h1>🐛 All Issues</h1>
          <p className="header-subtitle">
            {pagination.total} {pagination.total === 1 ? 'issue' : 'issues'} found
          </p>
        </div>
        <Link to="/issues/new" className="btn btn-primary">
          ➕ Create New Issue
        </Link>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path 
                d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="🔍 Search issues by title, description, or tags..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="enhanced-search-input"
            />
            {filters.search && (
              <button 
                className="clear-search"
                onClick={() => handleFilterChange('search', '')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        <div className="filters-row">
          <CustomDropdown
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            options={statusOptions}
            placeholder="All Statuses"
            icon="📊"
            className="status-dropdown"
          />
          
          <CustomDropdown
            value={filters.priority}
            onChange={(value) => handleFilterChange('priority', value)}
            options={priorityOptions}
            placeholder="All Priorities"
            icon="🎯"
            className="priority-dropdown"
          />
          
          <CustomDropdown
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={handleSortChange}
            options={sortOptions}
            placeholder="Sort by..."
            icon="🔄"
            className="sort-dropdown"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading issues...</p>
        </div>
      ) : (
        <>
          <div className="issues-grid">
            {issues.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No issues found</h3>
                <p>Try adjusting your filters or <Link to="/issues/new">create a new issue</Link></p>
              </div>
            ) : (
              issues.map((issue) => (
                <Link to={`/issues/${issue._id}`} key={issue._id} className="issue-card">
                  <div className="issue-header">
                    <h3>{issue.title}</h3>
                    <div className="issue-badges">
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
                    {issue.description.length > 120 
                      ? `${issue.description.substring(0, 120)}...` 
                      : issue.description
                    }
                  </p>
                  
                  <div className="issue-meta">
                    <div className="issue-author">
                      <span>👤 {issue.createdBy.username}</span>
                      <span>📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                    {issue.tags && issue.tags.length > 0 && (
                      <div className="issue-tags">
                        {issue.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">#{tag}</span>
                        ))}
                        {issue.tags.length > 3 && <span className="tag">+{issue.tags.length - 3}</span>}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              
              <div className="pagination-info">
                Page {pagination.current} of {pagination.pages} 
                ({pagination.total} total issues)
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IssueList;