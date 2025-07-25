import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import api from '../services/api';

const CreateIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    severity: 'Minor',
    tags: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const issueData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (!issueData.dueDate) {
        delete issueData.dueDate;
      }

      const response = await api.post('/issues', issueData);
      
      addToast('Issue created successfully!', 'success');
      navigate(`/issues/${response.data.issue._id}`);
    } catch (error) {
      console.error('Failed to create issue:', error);
      addToast(
        error.response?.data?.message || 'Failed to create issue', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-issue-page">
      <div className="page-header">
        <h1>Create New Issue 🐛</h1>
        <p>Report a bug or request a feature</p>
      </div>

      <form onSubmit={handleSubmit} className="issue-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={200}
            placeholder="Brief description of the issue"
          />
          <small>{formData.title.length}/200 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            maxLength={2000}
            rows={6}
            placeholder="Detailed description of the issue, including steps to reproduce, expected behavior, etc."
          />
          <small>{formData.description.length}/2000 characters</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="severity">Severity</label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
            >
              <option value="Minor">Minor</option>
              <option value="Major">Major</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (optional)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="bug, frontend, urgent (separate with commas)"
          />
          <small>Separate multiple tags with commas</small>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date (optional)</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/issues')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Creating...' : 'Create Issue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateIssue;