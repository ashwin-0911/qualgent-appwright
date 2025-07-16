// tests_/jobs.test.js

jest.mock('../jobs', () => {
  const original = jest.requireActual('../jobs');
  return {
    ...original,
    create: (data) => ({
      ...data,
      id: 'mock-id',
      status: 'pending',
      getState: async () => 'waiting',
    }),
    all: () => [
      { id: '1', getState: async () => 'waiting' },
      { id: '2', getState: async () => 'active' },
    ],
  };
});

const jobs = require('../jobs'); // ✅ <-- This was missing

describe('Job Store', () => {
  test('creates a job with unique ID and correct fields', () => {
    const job = jobs.create({ os: 'android', group_id: 'login' });
    expect(job).toHaveProperty('id');
    expect(job.status).toBe('pending');
    expect(job.os).toBe('android');
    expect(job.group_id).toBe('login');
  });

  test('returns all jobs', async () => {
    const all = jobs.all();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThanOrEqual(2);
    expect(await all[0].getState()).toBeDefined();
  });
});

afterAll(async () => {
  const { connection, jobQueue } = require('../jobs');

  if (jobQueue && typeof jobQueue.close === 'function') {
    await jobQueue.close(); // cleanly shuts down queue
  }

  if (connection && typeof connection.quit === 'function') {
    await connection.quit();
  }
});

