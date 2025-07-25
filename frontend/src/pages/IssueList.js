import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
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
  
  const { addToast } = useToast();
  const limit = 10;

  useEffect(() => {
    fetchIssues();
  }, [filters, pagination.current]);

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

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

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

  return (
    <div className="issue-list-page">
      <div className="page-header">
        <h1>All Issues</h1>
        <Link to="/issues/new" className="btn btn-primary">
          Create New Issue
        </Link>
      </div>

      <div className="filters-section">
        <div className="filters-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search issues..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Testing">Testing</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleFilterChange('sortBy', sortBy);
              handleFilterChange('sortOrder', sortOrder);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="priority-desc">Priority High-Low</option>
            <option value="priority-asc">Priority Low-High</option>
          </select>
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
                      <span>Created by {issue.createdBy.username}</span>
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                    {issue.tags && issue.tags.length > 0 && (
                      <div className="issue-tags">
                        {issue.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
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
                Previous
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
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IssueList;