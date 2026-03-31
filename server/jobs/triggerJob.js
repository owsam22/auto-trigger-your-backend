const cron = require('node-cron');
const axios = require('axios');
const Submission = require('../models/Submission');

const triggerSingleSubmission = async (submissionId) => {
  try {
    const submission = await Submission.findById(submissionId);
    if (!submission || submission.status !== 'approved') return;

    console.log(`[TRIGGER] Ping: ${submission.url}`);
    
    try {
      await axios.get(submission.url, { 
        timeout: 8000,
        headers: {
          'User-Agent': 'TriggerPulse/1.0 (Monitoring; uptime check)',
          'Accept': '*/*'
        }
      });
      
      await Submission.findByIdAndUpdate(submission._id, {
        lastTriggered: new Date(),
        lastStatus: 'success',
        failCount: 0,
        isUnstable: false,
      });
      console.log(`[TRIGGER] ✅ Success: ${submission.url}`);
    } catch (err) {
      const newFailCount = (submission.failCount || 0) + 1;
      await Submission.findByIdAndUpdate(submission._id, {
        lastTriggered: new Date(),
        lastStatus: 'fail',
        failCount: newFailCount,
        isUnstable: newFailCount > 3,
      });
      console.log(`[TRIGGER] ❌ Failed: ${submission.url} - ${err.message}`);
    }
  } catch (err) {
    console.error(`[TRIGGER] Error monitoring ${submissionId}:`, err.message);
  }
};

const triggerApprovedUrls = async () => {
  const now = new Date();
  console.log(`[CRON] Minute check started at ${now.toISOString()}`);
  try {
    const approvedSubmissions = await Submission.find({ status: 'approved' });
    
    // Filter for submissions that need triggering:
    // Either they haven't been triggered yet (lastTriggered is null)
    // OR it's been at least 10 minutes (600,000 ms) since the last trigger
    const toTrigger = approvedSubmissions.filter(sub => {
      const lastActionTime = sub.lastTriggered || sub.createdAt;
      const diffMs = now - new Date(lastActionTime);
      return diffMs >= 10 * 60 * 1000; // 10 minutes in ms
    });

    if (toTrigger.length > 0) {
      console.log(`[CRON] Found ${toTrigger.length} URL(s) ready for their 10-min pulse`);
      const promises = toTrigger.map(sub => triggerSingleSubmission(sub._id));
      await Promise.allSettled(promises);
    }
  } catch (err) {
    console.error('[CRON] Job error:', err.message);
  }
};

const selfPing = async () => {
  const url = process.env.SELF_URL || `http://localhost:${process.env.PORT || 5000}`;
  try {
    await axios.get(url, { timeout: 5000 });
    console.log(`[KEEP-ALIVE] Self-ping successful: ${url}`);
  } catch (err) {
    console.log(`[KEEP-ALIVE] Self-ping failed (expected if local): ${err.message}`);
  }
};

const startTriggerJob = () => {
  // Run staggered check immediately and then every 10 minute
  triggerApprovedUrls();
  cron.schedule('*/10 * * * *', triggerApprovedUrls);
  
  // Run self-ping every 10 minutes to keep deployment alive
  selfPing();
  cron.schedule('*/5 * * * *', selfPing);

  console.log('[CRON] Staggered trigger job (1min check) and Keep-alive (10min) started');
};

module.exports = { startTriggerJob, triggerApprovedUrls, triggerSingleSubmission };
