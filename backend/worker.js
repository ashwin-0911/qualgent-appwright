const { Worker } = require('bullmq');
const { spawn } = require('child_process');
require("dotenv").config();

const worker = new Worker('job-queue', async job => {
  const { os, test_path, app_version_id } = job.data;

  const platform = os;
  const app = platform === "ios" ? process.env.IOS_APP_ID : process.env.ANDROID_APP_ID;
  const testFile = test_path || "tests/testrunner.ts";

  const args = [
    "ts-node",
    testFile,
    "--platform=" + platform,
    "--app=" + app,
    "--app-version-id=" + app_version_id,
  ];

  return new Promise((resolve, reject) => {
    const proc = spawn("npx", args, {
      cwd: process.cwd(),
      env: { ...process.env },
    });

    proc.stdout.on("data", data => console.log(`[${job.id}] ${data}`));
    proc.stderr.on("data", data => console.error(`[${job.id}] ERROR: ${data}`));

    proc.on("close", code => {
      if (code === 0) resolve("passed");
      else reject(new Error("Job failed"));
    });
  });
}, {
  connection: {
    host: 'redis',
    port: 6379
  }
});

console.log("Worker started and listening to job queue...");
