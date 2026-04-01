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
// BATCH TRIGGER (ALL APPROVED)
// ----------------------
const triggerApprovedUrls = async () => {
  try {
    // 🔥 Trigger ALL approved URLs at once every 9 mins
    const toTrigger = await Submission.find({ status: 'approved' });

    if (!toTrigger.length) return;

    console.log(`[CRON] ⚡ Triggering ${toTrigger.length} URLs (9-min cycle)`);

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
  } catch (err) {
    console.log(`[KEEP-ALIVE] ❌ Failed: ${err.message}`);
  }
};

// ----------------------
// START SYSTEM
// ----------------------
const startTriggerJob = () => {
  // 🔥 Run strictly every 9 minutes
  cron.schedule('*/9 * * * *', triggerApprovedUrls);

  // Keep Render alive
  cron.schedule('*/5 * * * *', selfPing);

  console.log('[CRON] 🚀 Trigger System Active (9-min interval)');
};

module.exports = { startTriggerJob, triggerApprovedUrls, triggerSingleSubmission };