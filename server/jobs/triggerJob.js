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
  console.log(`[CRON] Batch job started at ${new Date().toISOString()}`);
  try {
    const approvedSubmissions = await Submission.find({ status: 'approved' });
    console.log(`[CRON] Found ${approvedSubmissions.length} URL(s) to check`);

    const promises = approvedSubmissions.map(sub => triggerSingleSubmission(sub._id));
    await Promise.allSettled(promises);
    
    console.log(`[CRON] Batch job completed.`);
  } catch (err) {
    console.error('[CRON] Job error:', err.message);
  }
};

const startTriggerJob = () => {
  // Run immediately on start
  triggerApprovedUrls();
  
  // Run every 2 minutes
  cron.schedule('*/10 * * * *', triggerApprovedUrls);
  console.log('[CRON] Trigger job scheduled (every 10 minutes)');
};

module.exports = { startTriggerJob, triggerApprovedUrls, triggerSingleSubmission };
