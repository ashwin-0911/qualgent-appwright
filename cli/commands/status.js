const axios = require('axios');

module.exports = async function status(options) {
  try {
    const res = await axios.get(`http://backend:8080/jobs/${options.jobId}`);
    console.log('Job status:', res.data.status);
  } catch (err) {
    console.error('Failed to fetch status:', err.response?.data || err.message);
  }
};
