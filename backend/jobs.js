const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const { v4: uuidv4 } = require('uuid');

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

const jobQueue = new Queue('job-queue', { connection });

async function create(data) {
  const jobId = uuidv4();
  const job = await jobQueue.add(
    'test-job',
    {
      ...data,
      job_id: jobId,
      status: 'pending',
      created_at: new Date().toISOString(),
    },
    {
      priority: data.priority || 1,
      attempts: 3,
      removeOnComplete: false,
      removeOnFail: false,
      jobId,
    }
  );
  return job.data;
}

async function find(id) {
  const job = await jobQueue.getJob(id);
  if (!job) return null;
  const state = await job.getState();
  return { ...job.data, status: state };
}

async function all() {
  const jobs = await jobQueue.getJobs(['waiting', 'active', 'completed', 'failed', 'delayed']);
  return Promise.all(
    jobs.map(async (job) => {
      const state = await job.getState();
      return { ...job.data, status: state };
    })
  );
}

module.exports = {
  create,
  find,
  all,
  jobQueue,
  connection, // <-- exported for teardown in tests
};
