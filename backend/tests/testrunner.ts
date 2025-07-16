// tests/testRunner.ts

import { remote } from "webdriverio";

// Read CLI args
const args = process.argv.slice(2);
const getArgValue = (key: string) =>
  args.find(arg => arg.startsWith(`--${key}=`))?.split("=")[1];

const platform = getArgValue("platform");
const app = getArgValue("app");
const appVersionId = getArgValue("app-version-id");

if (!platform || !app) {
  console.error("Usage: ts-node testRunner.ts --platform=ios|android --app=apidemo|ipo [--app-version-id=bs://...]");
  process.exit(1);
}

const fallbackAppId =
  app === "apidemo" ? process.env.BROWSERSTACK_APP_ID : process.env.BROWSERSTACK_APP_ID_IPO;

const appId = appVersionId || fallbackAppId;

if (!appId) {
  console.error(`Missing app ID for "${app}". Provide --app-version-id or set in .env`);
  process.exit(1);
}

console.log("Launching", { platform, app, appId });

const caps = {
  platformName: platform,
  "appium:autoGrantPermissions": true,
  "appium:app": appId,
  "appium:automationName": platform === "android" ? "UiAutomator2" : "XCUITest",
  "bstack:options": {
    projectName: "Qualgent Appwright",
    buildName: "Dynamic Docker Build",
    sessionName: `${platform}-${app} test`,
    userName: "ashwinsr_Bi397l",
    accessKey: "Dttavt923sNuRRcjhrRG",
    deviceName: platform === "android" ? "Google Pixel 7" : "iPhone 14",
    osVersion: platform === "android" ? "13.0" : "16",
  },
};

async function runTest() {
  const driver = await remote({
    protocol: "https",
    hostname: "hub-cloud.browserstack.com",
    port: 443,
    path: "/wd/hub",
    capabilities: caps,
  });

  try {
    if (platform === "android") {
      const continueBtn = await driver.$('android=new UiSelector().text("Continue")');
      await continueBtn.click();

      try {
        const okBtn = await driver.$('android=new UiSelector().text("OK")');
        await okBtn.waitForExist({ timeout: 5000 });
        await okBtn.click();
      } catch {
        console.warn("OK button not found. Possibly already dismissed.");
      }

      const accessibility = await driver.$('android=new UiSelector().text("Accessibility")');
      await accessibility.waitForExist({ timeout: 5000 });
      await accessibility.click();
    } else {
      await driver.pause(5000);
      console.log("iOS app launched (placeholder - no test steps)");
    }

    await driver.deleteSession();
  } catch (err) {
    console.error("Test failed:", err);
    await driver.deleteSession();
    process.exit(1);
  }
}

runTest();
