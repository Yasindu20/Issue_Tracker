import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      const response = await api.get(`/issues/${id}`);
      setIssue(response.data);
      setEditData({
        title: response.data.title,
        description: response.data.description,
        status: response.data.status,
        priority: response.data.priority,
        severity: response.data.severity,
        tags: response.data.tags.join(', '),
        dueDate: response.data.dueDate ? 
          new Date(response.data.dueDate).toISOString().split('T')[0] : ''
      });
    } catch (error) {
      console.error('Failed to fetch issue:', error);
      addToast('Failed to fetch issue details', 'error');
      navigate('/issues');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData({
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      severity: issue.severity,
      tags: issue.tags.join(', '),
      dueDate: issue.dueDate ? 
        new Date(issue.dueDate).toISOString().split('T')[0] : ''
    });
  };

  const handleSave = async () => {
    try {
      const updateData = {
        ...editData,
        tags: editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (!updateData.dueDate) {
        updateData.dueDate = null;
      }

      const response = await api.put(`/issues/${id}`, updateData);
      setIssue(response.data.issue);
      setEditing(false);
      addToast('Issue updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update issue:', error);
      addToast(
        error.response?.data?.message || 'Failed to update issue', 
        'error'
      );
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/issues/${id}`);
      addToast('Issue deleted successfully!', 'success');
      navigate('/issues');
    } catch (error) {
      console.error('Failed to delete issue:', error);
      addToast(
        error.response?.data?.message || 'Failed to delete issue', 
        'error'
      );
    }
  };

  const canEdit = issue && (
    issue.createdBy._id === user.id || user.role === 'admin'
  );

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
        <p>Loading issue...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="error-container">
        <h2>Issue not found</h2>
        <Link to="/issues">Back to Issues</Link>
      </div>
    );
  }

  return (
    <div className="issue-detail-page">
      <div className="issue-header">
        <div className="issue-breadcrumb">
          <Link to="/issues">Issues</Link> / Issue #{issue._id.slice(-6)}
        </div>
        
        {canEdit && (
          <div className="issue-actions">
            {!editing ? (
              <>
                <button onClick={handleEdit} className="btn btn-secondary">
                  ✏️ Edit
                </button>
                <button onClick={handleDelete} className="btn btn-danger">
                  🗑️ Delete
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} className="btn btn-primary">
                  💾 Save
                </button>
                <button onClick={handleCancel} className="btn btn-secondary">
                  ❌ Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="issue-content">
        <div className="issue-main">
          {editing ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  maxLength={200}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  rows={8}
                  maxLength={2000}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({...editData, status: e.target.value})}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({...editData, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Severity</label>
                  <select
                    value={editData.severity}
                    onChange={(e) => setEditData({...editData, severity: e.target.value})}
                  >
                    <option value="Minor">Minor</option>
                    <option value="Major">Major</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <input
                  type="text"
                  value={editData.tags}
                  onChange={(e) => setEditData({...editData, tags: e.target.value})}
                  placeholder="Separate with commas"
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
                />
              </div>
            </div>
          ) : (
            <div className="issue-view">
              <h1>{issue.title}</h1>
              
              <div className="issue-badges">
                <span 
                  className="status-badge large"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {issue.status}
                </span>
                <span 
                  className="priority-badge large"
                  style={{ color: getPriorityColor(issue.priority) }}
                >
                  {issue.priority} Priority
                </span>
                <span className="severity-badge">
                  {issue.severity} Severity
                </span>
              </div>

              <div className="issue-description">
                <h3>Description</h3>
                <div className="description-content">
                  {issue.description.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>

              {issue.tags && issue.tags.length > 0 && (
                <div className="issue-tags">
                  <h3>Tags</h3>
                  <div className="tags-list">
                    {issue.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="issue-sidebar">
          <div className="issue-meta">
            <h3>Issue Details</h3>
            
            <div className="meta-item">
              <strong>Created by:</strong>
              <span>{issue.createdBy.username}</span>
            </div>
            
            <div className="meta-item">
              <strong>Created on:</strong>
              <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="meta-item">
              <strong>Last updated:</strong>
              <span>{new Date(issue.updatedAt).toLocaleDateString()}</span>
            </div>
            
            {issue.assignedTo && (
              <div className="meta-item">
                <strong>Assigned to:</strong>
                <span>{issue.assignedTo.username}</span>
              </div>
            )}
            
            {issue.dueDate && (
              <div className="meta-item">
                <strong>Due date:</strong>
                <span 
                  className={new Date(issue.dueDate) < new Date() ? 'overdue' : ''}
                >
                  {new Date(issue.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
            
            <div className="meta-item">
              <strong>Issue ID:</strong>
              <span className="issue-id">#{issue._id.slice(-8)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;