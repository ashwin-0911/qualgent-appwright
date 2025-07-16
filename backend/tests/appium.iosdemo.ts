const wdio = require("webdriverio");
require("dotenv").config();

const iosCaps = {
  platformName: 'ios',
  'appium:automationName': 'XCUITest',
  'appium:app': process.env.BROWSERSTACK_APP_ID_IOS,
  'bstack:options': {
    deviceName: 'iPhone 13',
    osVersion: '15',
    userName: process.env.BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    projectName: 'Qualgent Appwright',
    buildName: 'Local Docker Build',
    sessionName: 'Appium iOS test'
  }
};

async function runTest() {
  const driver = await wdio.remote({
    protocol: "https",
    hostname: "hub-cloud.browserstack.com",
    port: 443,
    path: "/wd/hub",
    capabilities: iosCaps,
  });

  // Example: wait for some element or just open app
  await driver.pause(5000);

  await driver.deleteSession();
}

runTest();
