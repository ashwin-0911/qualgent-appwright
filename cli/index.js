#!/usr/bin/env node
const { Command } = require('commander');
const submit = require('./commands/submit');
const status = require('./commands/status');

const program = new Command();
program.name('qgjob').description('Qualgent CLI for BrowserStack AppWright jobs');

program
  .command('submit')
  .description('Submit a test job to BrowserStack')
  .requiredOption('--org-id <orgId>', 'Organization ID')
  .requiredOption('--app-version-id <appVersionId>', 'App ID from BrowserStack (apk/ipa upload result)')
  .requiredOption('--test <testPath>', 'Test runner path, e.g. testrunner.ts')
  .requiredOption('--target <target>', 'Infrastructure target: browserstack')
  .requiredOption('--os <os>', 'Mobile OS: android or ios')
  .option('--priority <priority>', 'Job priority (1 = high, 5 = low)', parseInt)
  .option('--group-id <groupId>', 'Logical group for jobs')
  .action(submit);


program
  .command('status')
  .description('Get job status')
  .requiredOption('--job-id <jobId>', 'Job ID')
  .action(status);

program.parse();
