import { mkdir } from "node:fs/promises";
import { test, expect } from "@playwright/test";
import { openGame, startRun } from "./helpers.js";

const dir="test-results/screenshots";
async function shot(page,name){await mkdir(dir,{recursive:true});await page.screenshot({path:`${dir}/${name}.png`,fullPage:true});}

test("capture stable review screens",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="desktop-chromium","desktop capture owns shared filenames");
  const {frame}=await openGame(page);await shot(page,"main-menu");
  await frame.getByRole("button",{name:"局外升级"}).click();await shot(page,"shop");await frame.locator("#closeShopBtn").click();
  await startRun(frame);await page.waitForTimeout(300);await shot(page,"gameplay");
  await frame.locator("body").evaluate(()=>window.__tuntunTest.forceLevelUp());await shot(page,"level-up");await frame.locator(".choice").first().click();
  await frame.locator("body").evaluate(()=>window.__tuntunTest.forceBoss());await page.waitForTimeout(250);await shot(page,"boss-battle");
  await page.keyboard.press("Escape");await shot(page,"pause");await frame.getByRole("button",{name:"继续游戏 ▶"}).click();
  await frame.locator("body").evaluate(()=>window.__tuntunTest.forceEnd(false));await expect(frame.locator("#endScreen")).toBeVisible();await shot(page,"results");
});

test("capture mobile menu and gameplay",async({page},testInfo)=>{
  test.skip(testInfo.project.name!=="mobile-chromium","mobile capture only");
  const {frame}=await openGame(page);await shot(page,"mobile-menu");await startRun(frame);await page.waitForTimeout(300);await shot(page,"mobile-gameplay");
});
