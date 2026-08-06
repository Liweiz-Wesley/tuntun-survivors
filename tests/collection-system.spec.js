import { test, expect } from "@playwright/test";
import { openGame, startRun } from "./helpers.js";

test("collection hides undiscovered entries and exposes the expanded arsenal",async({page})=>{
  const {frame}=await openGame(page);
  await frame.locator("#codexBtn").click();
  await expect(frame.locator(".codex-scroll h3").filter({hasText:"52"})).toHaveCount(2);
  await expect(frame.locator(".codex-scroll h3").filter({hasText:"16"})).toHaveCount(1);
  await expect(frame.locator(".codex-scroll h3").filter({hasText:"18"})).toHaveCount(1);
  await expect(frame.locator(".collection-card")).toHaveCount(160);
  await expect(frame.locator(".collection-card.locked").first()).toContainText("???");
  await expect(frame.locator('.collection-card img[src*="assets/generated/food-vivid/"]').first()).toBeVisible();
});

test("pause screen exposes every weapon evolution and the current loadout",async({page})=>{
  const {frame}=await openGame(page);
  await startRun(frame);
  await page.keyboard.press("Escape");
  await expect(frame.locator("#pauseScreen")).toBeVisible();
  await expect(frame.locator(".pause-recipe-card")).toHaveCount(52);
  await expect(frame.locator(".pause-owned-chip")).not.toHaveCount(0);
  await expect(frame.locator('.pause-recipe-card img[src*="assets/generated/food-vivid/"]').first()).toBeVisible();
});
