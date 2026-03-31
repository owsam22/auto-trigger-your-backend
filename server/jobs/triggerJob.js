const cron = require('node-cron');
const axios = require('axios');
const pLimit = require('p-limit');
const Submission = require('../models/Submission');

const limit = pLimit(5); // 🔥 max 5 parallel requests

// ----------------------
// SINGLE TRIGGER
// ----------------------
const triggerSingleSubmission = async (submission) => {
  if (!submission || submission.status !== 'approved') return;

  console.log(`[TRIGGER] Ping: ${submission.url}`);

  try {
    await axios.get(submission.url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'TriggerPulse/1.0'
      },
      validateStatus: () => true // treat ALL HTTP responses as success
    });

    await Submission.findByIdAndUpdate(submission._id, {
      lastTriggered: new Date(),
      lastStatus: 'success',
      failCount: 0,
      isUnstable: false
    }, { returnDocument: 'after' });

    console.log(`[TRIGGER] ✅ Alive: ${submission.url}`);

  } catch (err) {
    // If it's a timeout, it still triggered the server! Treat as success.
    if (err.code === 'ECONNABORTED' || err.message.toLowerCase().includes('timeout')) {
      await Submission.findByIdAndUpdate(submission._id, {
        lastTriggered: new Date(),
        lastStatus: 'success',
        failCount: 0,
        isUnstable: false
      }, { returnDocument: 'after' });
      console.log(`[TRIGGER] ⚡ Waking up: ${submission.url} (Timeout)`);
      return;
    }

    // Only real network / connection failures increment failCount
    const newFailCount = (submission.failCount || 0) + 1;
    await Submission.findByIdAndUpdate(submission._id, {
      lastTriggered: new Date(),
      lastStatus: 'fail',
      failCount: newFailCount,
      isUnstable: newFailCount > 3
    }, { returnDocument: 'after' });

    console.log(`[TRIGGER] ❌ Down: ${submission.url} - ${err.message}`);
  }
};

// ----------------------
// BATCH TRIGGER (SMART QUERY)
// ----------------------
const triggerApprovedUrls = async () => {
  const now = new Date();
  const threshold = new Date(now.getTime() - 10 * 60 * 1000);

  // Skip noise
  try {
    const toTrigger = await Submission.find({
      status: 'approved',
      $or: [
        { lastTriggered: { $exists: false } },
        { lastTriggered: { $lte: threshold } }
      ]
    }).limit(100);

    if (!toTrigger.length) return;

    console.log(`[CRON] ⚡ Triggering ${toTrigger.length} URLs (Batch Process)`);

    await Promise.allSettled(
      toTrigger.map(sub => limit(() => triggerSingleSubmission(sub)))
    );

  } catch (err) {
    console.error('[CRON] Error:', err.message);
  }
};

// ----------------------
// KEEP BACKEND ALIVE
// ----------------------
const selfPing = async () => {
  const url = process.env.SELF_URL || `http://localhost:${process.env.PORT || 5000}`;
  if (!url) return;

  try {
    await axios.get(url, { timeout: 5000, validateStatus: () => true });
    // Success is quiet to keep logs clean
  } catch (err) {
    console.log(`[KEEP-ALIVE] ❌ Failed: ${err.message}`);
  }
};

// ----------------------
// START SYSTEM
// ----------------------
const startTriggerJob = () => {
  // Check every minute for anything due (10-min interval)
  cron.schedule('* * * * *', triggerApprovedUrls);

  // Keep Render alive
  cron.schedule('*/5 * * * *', selfPing);

  console.log('[CRON] 🚀 Optimized Trigger System Active (10-min staggered interval)');
};

module.exports = { startTriggerJob, triggerApprovedUrls, triggerSingleSubmission };