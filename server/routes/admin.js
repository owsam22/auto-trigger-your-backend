const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const protect = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// All admin routes require auth + isAdmin
router.use(protect, isAdmin);

// GET /api/admin/submissions
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('submittedBy', 'email')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const total = await Submission.countDocuments();
    const approved = await Submission.countDocuments({ status: 'approved' });
    const rejected = await Submission.countDocuments({ status: 'rejected' });
    const pending = await Submission.countDocuments({ status: 'pending' });
    const failed = await Submission.countDocuments({ lastStatus: 'fail' });
    const unstable = await Submission.countDocuments({ isUnstable: true });
    res.json({ total, approved, rejected, pending, failed, unstable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const { triggerSingleSubmission } = require('../jobs/triggerJob');

// PATCH /api/admin/approve/:id
router.patch('/approve/:id', async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { returnDocument: 'after' }
    ).populate('submittedBy', 'email');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    
    // Trigger specific URL immediately after approval
    triggerSingleSubmission(submission._id);
    
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/reject/:id
router.patch('/reject/:id', async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { returnDocument: 'after' }
    ).populate('submittedBy', 'email');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/delete/:id
router.delete('/delete/:id', async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
