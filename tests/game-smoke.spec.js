import { test, expect } from "@playwright/test";
import { expectNoRuntimeIssues, openGame } from "./helpers.js";

test("game opens without runtime or asset errors",async({page})=>{
  const {frame,issues}=await openGame(page);
  await expect(page).toHaveTitle(/豚豚生存者|Tuntun Survivors/);
  await expect(frame.locator("#game")).toBeVisible();
  await page.waitForTimeout(600);
  expectNoRuntimeIssues(issues);
});

test("layout stays inside common viewport",async({page})=>{
  const {frame}=await openGame(page);
  const overflow=await frame.locator("body").evaluate(()=>({x:document.documentElement.scrollWidth-document.documentElement.clientWidth,y:document.documentElement.scrollHeight-document.documentElement.clientHeight}));
  expect(overflow.x).toBeLessThanOrEqual(1);
  expect(overflow.y).toBeLessThanOrEqual(1);
});
