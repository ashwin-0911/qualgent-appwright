# QualGent Backend Challenge: CLI-Driven Test Queue System

This backend system powers a CLI tool to queue, prioritize, and execute AppWright test jobs across local simulators/emulators, real devices, and BrowserStack. It is built for reliability, scalability, and detailed job tracking.

---

## Features

- **Job Queueing** — Accepts test jobs via `/submit` API with `org_id`, `app_version_id`, `test_path`, `priority`, and `target`.
- **Priority Scheduling** — Jobs are sorted in Redis based on descending priority.
- **Batch Processing** — Groups jobs by app version & platform for efficient device usage.
- **Horizontal Scalability** — Docker-compose workers allow scale-out architecture.
- **Platform Support** — Compatible with **both Android and iOS**, locally or via BrowserStack.
- **Retry & Resilience** — Auto-retry of flaky jobs via BullMQ.
- **Clear Status Tracking** — Real-time status available via `/jobs`.

---

## Architecture

[ CLI ]
|
| POST /submit
v
[ Node.js Backend ]
|
+--> Redis: BullMQ queue
|
+--> Appwright Runner (via Docker Workers)
|
+--> Runs test on emulator / real device / BrowserStack

yaml
Copy
Edit

---

## Usage

### 1. Upload app to BrowserStack

```bash
curl -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
  -X POST 'https://api-cloud.browserstack.com/app-automate/upload' \
  -F 'file=@path/to/app.apk'
Response:

json
Copy
Edit
{ "app_url": "bs://<app_version_id>" }
2. Submit Job to Queue
bash
Copy
Edit
curl -X POST http://localhost:3000/submit \
  -H "Content-Type: application/json" \
  -d '{
        "org_id": "acme-qa",
        "app_version_id": "bs://abc123def456",
        "test_path": "tests/android/demo.test.ts",
        "priority": 8,
        "target": "browserstack-android"
      }'
3. Monitor Jobs
bash
Copy
Edit
curl http://localhost:3000/jobs
Code Summary
jobs.js – Adds, fetches, and queries jobs from BullMQ with Redis.

server.js – Express routes /submit, /jobs.

worker.js – Worker logic to poll, batch, and run tests via AppWright.

playwright.config.ts – Base config for test execution environments.

cli/ – CLI wrappers to submit jobs from terminal and automate workflows.

tests_unit/ – Unit test coverage using Jest.

.github/workflows/test.yml – CI pipeline using GitHub Actions.

Scenarios Covered
Prioritized job execution (low vs high priority)

Retry logic and fault tolerance

Device pool reuse through batching

Execution on BrowserStack vs local emulator

CLI-integrated flows for app submission + test dispatch

Local .apk or .ipa app testing with dynamic version tracking

Design Decisions
Redis + BullMQ used for scalability, job persistence, retries, and concurrency control.

Stateless workers make horizontal scaling simple via Docker Compose.

Unified CLI interface for QA engineers to use the tool without manually hitting APIs.

Minimal backend surface area — API is small and focused for clarity and maintainability.

Testing & CI/CD
Unit tests: run with npm run test:unit

E2E tests: run with npm run test:e2e (requires emulator or BrowserStack)

GitHub Actions:

yaml
Copy
Edit
# .github/workflows/test.yml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
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
To run E2E tests in CI (BrowserStack), ensure:

Set secrets: BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY

Setup BS tunnel or mock emulator if needed.

License
MIT
