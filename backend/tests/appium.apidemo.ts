const wdio = require("webdriverio");
require("dotenv").config();

const caps = {
  platformName: 'android',
  'appium:automationName': 'UiAutomator2',
  'appium:autoGrantPermissions': true,
  'appium:app': process.env.BROWSERSTACK_APP_ID,
  'bstack:options': {
    deviceName: 'Google Pixel 7',
    osVersion: '13.0',
    userName: process.env.BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    projectName: 'Qualgent Appwright',
    buildName: 'Local Docker Build',
    sessionName: 'Appium Android test'
  }
};

async function runTest() {
  const driver = await wdio.remote({
    protocol: "https",
    hostname: "hub-cloud.browserstack.com",
    port: 443,
    path: "/wd/hub",
    capabilities: caps,
  });

  // Step 1: Click 'Continue'
  const continueBtn = await driver.$('android=new UiSelector().text("Continue")');
  await continueBtn.click();

  // Step 2: Handle "OK" on alert
  try {
    const okBtn = await driver.$('android=new UiSelector().text("OK")');
    await okBtn.waitForExist({ timeout: 5000 });
    await okBtn.click();
  } catch (err) {
    console.warn('OK button not found. Possibly already dismissed.');
  }

  // Step 3: Click 'Accessibility'
  const accessibility = await driver.$('android=new UiSelector().text("Accessibility")');
  await accessibility.waitForExist({ timeout: 5000 });
  await accessibility.click();

  await driver.deleteSession();
}

runTest();
