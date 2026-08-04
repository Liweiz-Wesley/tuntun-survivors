import { test, expect } from "@playwright/test";
import { openGame, startRun } from "./helpers.js";

test("shop, character select, pause, and resume are reachable",async({page})=>{
  const {frame}=await openGame(page);
  await frame.getByRole("button",{name:"局外升级"}).click();
  await expect(frame.getByRole("heading",{name:"豚豚升级商店"})).toBeVisible();
  await frame.locator("#closeShopBtn").click();
  await startRun(frame);
  await page.keyboard.press("Escape");
  await expect(frame.getByRole("heading",{name:"豚豚休息中"})).toBeVisible();
  await frame.getByRole("button",{name:"继续游戏 ▶"}).click();
  await expect(frame.locator("#pauseScreen")).toBeHidden();
});

test("language selector switches to English",async({page})=>{
  await openGame(page);
  await page.getByLabel("Language").selectOption("en");
  const frame=page.locator("#gameFrame").contentFrame();
  await expect(frame.getByRole("button",{name:"START GAME ◆"})).toBeVisible();
});
