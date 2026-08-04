import { test, expect } from "@playwright/test";
import { openGame, startRun, testSnapshot } from "./helpers.js";

test("keyboard movement, forced upgrade, end, and restart work",async({page})=>{
  const {frame}=await openGame(page);await startRun(frame);
  const before=await testSnapshot(frame);
  await page.keyboard.down("KeyD");await page.waitForTimeout(250);await page.keyboard.up("KeyD");
  const after=await testSnapshot(frame);expect(after.player.x).toBeGreaterThan(before.player.x);
  await frame.locator("body").evaluate(()=>window.__tuntunTest.forceLevelUp());
  await expect(frame.locator("#levelScreen")).toBeVisible();
  await frame.locator(".choice").first().click();
  await frame.locator("body").evaluate(()=>window.__tuntunTest.forceEnd(false));
  await expect(frame.locator("#endScreen")).toBeVisible();
  await frame.locator("#restartBtn").click();
  await expect(frame.locator("#hud")).toBeVisible();
});

test("window blur clears held movement",async({page})=>{
  test.fixme(true,"Input focus-loss reset is a known audit finding scheduled for the unified input phase.");
  const {frame}=await openGame(page);await startRun(frame);
  await page.keyboard.down("KeyD");await page.waitForTimeout(120);
  await frame.locator("body").evaluate(()=>window.dispatchEvent(new Event("blur")));
  await page.keyboard.up("KeyD");const stopped=await testSnapshot(frame);await page.waitForTimeout(250);const later=await testSnapshot(frame);
  expect(Math.abs(later.player.x-stopped.player.x)).toBeLessThan(3);
});
