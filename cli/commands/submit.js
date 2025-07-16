const axios = require('axios');
require('dotenv').config();

module.exports = async function submit(options) {
  try {
    const jobPayload = {
      org_id: options.orgId,
      app_version_id: options.appVersionId,
      test_path: options.test,
      target: options.target,
      os: options.os,
      priority: options.priority || 1,
      group_id: options.groupId || null
    };

    const res = await axios.post('http://backend:8080/jobs', jobPayload);
    console.log('Job submitted successfully. Job ID:', res.data.job_id || res.data.id);
  } catch (err) {
    console.error('Failed to submit job:', err.response?.data || err.message);
  }
};
