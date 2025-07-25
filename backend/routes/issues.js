const express = require('express');
const Issue = require('../models/Issue');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all issues with filtering and search
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      priority, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get issues with population
    const issues = await Issue.find(filter)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email')
      .sort(sort)
      .limit(limit * 1)
      .skip(skip);

    // Get total count for pagination
    const total = await Issue.countDocuments(filter);

    res.json({
      issues,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({ message: 'Server error while fetching issues' });
  }
});

// Get single issue
router.get('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({ message: 'Server error while fetching issue' });
  }
});

// Create new issue
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      priority = 'Medium',
      severity = 'Minor',
      tags = [],
      dueDate
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ message: 'Title must be less than 200 characters' });
    }

    if (description.length > 2000) {
      return res.status(400).json({ message: 'Description must be less than 2000 characters' });
    }

    // Create issue
    const issueData = {
      title,
      description,
      priority,
      severity,
      tags,
      createdBy: req.user._id
    };

    if (dueDate) {
      issueData.dueDate = new Date(dueDate);
    }

    const issue = new Issue(issueData);
    await issue.save();

    // Populate the created issue
    await issue.populate('createdBy', 'username email');

    res.status(201).json({
      message: 'Issue created successfully',
      issue
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({ message: 'Server error while creating issue' });
  }
});

// Update issue
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      severity,
      assignedTo,
      tags,
      dueDate
    } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check permissions (only creator or admin can update)
    if (issue.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this issue' });
    }

    // Update fields
    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;
    if (priority !== undefined) issue.priority = priority;
    if (severity !== undefined) issue.severity = severity;
    if (assignedTo !== undefined) issue.assignedTo = assignedTo || null;
    if (tags !== undefined) issue.tags = tags;
    if (dueDate !== undefined) issue.dueDate = dueDate ? new Date(dueDate) : null;

    await issue.save();

    // Populate the updated issue
    await issue.populate('createdBy', 'username email');
    await issue.populate('assignedTo', 'username email');

    res.json({
      message: 'Issue updated successfully',
      issue
    });
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({ message: 'Server error while updating issue' });
  }
});

// Delete issue
router.delete('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check permissions (only creator or admin can delete)
    if (issue.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this issue' });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({ message: 'Server error while deleting issue' });
  }
});

module.exports = router;