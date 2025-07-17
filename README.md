QualGent Backend Challenge: CLI-Driven Test Queue System

This backend system powers a CLI tool to queue, prioritize, and execute AppWright test jobs across local simulators/emulators, real devices, and BrowserStack. Built for resilience, scalability, and clarity, it simplifies QA automation across platforms with an intuitive interface and minimal configuration.

Features

Job Queueing – Accepts test jobs via a RESTful /submit API. Payload includes:

org_id: Organization name

app_version_id: Uploaded app version identifier (e.g., bs://abc123)

test_path: Relative path to the AppWright test script

priority: Integer (higher means more urgent)

target: Platform target (android, ios, browserstack-android, browserstack-ios)

Priority Scheduling – Uses Redis sorted sets to ensure jobs are dequeued in priority order.

Batch Processing – Jobs are grouped by app_version_id and target to minimize emulator/device resets. Default batch size is 3.

Horizontal Scalability – Workers are stateless and fully dockerized. Scale with:

docker-compose up --build --scale qg-worker=3

Cross-Platform Execution – Supports:

Local Android/iOS emulators

Physical devices (via USB)

Remote devices via BrowserStack (both Android and iOS)

Retry & Timeout Handling – Jobs auto-retry up to 3 times on failure. Stuck jobs (over 30s) are requeued automatically.

Clear Job Tracking – Query job status anytime via /jobs or /status/<job_id>. Includes job state, timestamps, retries.

GitHub Actions Integration – Automate E2E test submissions in CI pipelines with CLI support.

CLI UX – Human-friendly CLI (qgjob) for local use:

qgjob submit --org-id=acme --app-version-id=bs://xyz123 --test=tests/demo.test.ts --target=browserstack-android

Architecture

[ CLI or GitHub Actions ]
        |
    HTTP POST
        |
[ Node.js Backend API ]
        |
        +-- Queue Job in Redis via BullMQ (priority & grouping)
        |
[ Worker(s) via Docker ] --+--> Launch AppWright
                           |--> Run on Emulator, Device, or BrowserStack
                           |--> Track Job Completion / Retry
                           |
[ Redis ] <--- Stores all job metadata, retries, batch state

Usage Guide

1. Upload App to BrowserStack

curl -u $BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY \
  -X POST 'https://api-cloud.browserstack.com/app-automate/upload' \
  -F 'file=@path/to/app.apk'

Returns:

{ "app_url": "bs://abc123def456" }

2. Submit Job to Backend

curl -X POST http://localhost:3000/submit \
  -H "Content-Type: application/json" \
  -d '{
        "org_id": "acme-qa",
        "app_version_id": "bs://abc123def456",
        "test_path": "tests/demo.test.ts",
        "priority": 8,
        "target": "browserstack-android"
      }'

3. Monitor All Jobs

curl http://localhost:3000/jobs

4. Check Specific Job Status

curl http://localhost:3000/status/<job_id>

Codebase Summary

jobs.js – Redis-backed BullMQ queueing logic

worker.js – Batches jobs and executes AppWright sessions

server.js – Express API routes (/submit, /jobs, /status/:id)

cli/ – CLI tool for submitting and checking jobs

playwright.config.ts – Execution configuration for AppWright

docker-compose.yml – Defines Redis, backend, and worker topology

tests_unit/ – Jest-based unit tests

Scenarios Handled

Prioritized execution (e.g., urgent bugs ahead of regression tests)

Batching tests per app version for device reuse

Stuck job detection and timeout-based requeueing

Platform-aware execution logic (iOS vs Android)

Full remote execution on BrowserStack

CI/CD Integration (GitHub Actions)

.github/workflows/test.yml

name: AppWright Test
on:
  push:
    branches: [main]

jobs:
  run-tests:
    runs-on: ubuntu-latest
    services:
      redis:
        image: redis
        ports: [6379:6379]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:unit

To run real E2E tests via CLI, set GitHub secrets for:

BROWSERSTACK_USERNAME

BROWSERSTACK_ACCESS_KEY

License

MIT License. See LICENSE file for terms.

