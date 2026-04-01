const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const protect = require('../middleware/auth');

const isValidUrl = (str) => {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// POST /api/submissions/create
router.post('/create', protect, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'URL is required' });
  if (!isValidUrl(url)) return res.status(400).json({ message: 'Invalid URL format' });

  try {
    // ✋ Limit check for non-admin users
    if (!req.user.isAdmin) {
      const count = await Submission.countDocuments({ submittedBy: req.user._id });
      if (count >= 3) {
        return res.status(403).json({ 
          message: 'u can not add more than 3 at now on the free plan' 
        });
      }
    }

    const existing = await Submission.findOne({ url });
    if (existing) return res.status(409).json({ message: 'This URL has already been submitted' });

    const submission = await Submission.create({ url, submittedBy: req.user._id });
    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/submissions/mine
router.get('/mine', protect, async (req, res) => {
  try {
    console.log(`[SUBS] Fetching for user: ${req.user._id}`);
    const submissions = await Submission.find({ submittedBy: req.user._id }).sort({ createdAt: -1 });
    console.log(`[SUBS] Found: ${submissions.length} entries`);
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/submissions/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    // Check ownership
    if (submission.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this submission' });
    }

    await Submission.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
