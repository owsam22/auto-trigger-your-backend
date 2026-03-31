const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  lastTriggered: {
    type: Date,
    default: null,
  },
  lastStatus: {
    type: String,
    enum: ['success', 'fail', null],
    default: null,
  },
  failCount: {
    type: Number,
    default: 0,
  },
  isUnstable: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
