import { expect } from "@playwright/test";

export const gameUrl="/?testMode=1&testCoins=5000";

export async function openGame(page){
  const issues=[];
  page.on("pageerror",error=>issues.push(`pageerror: ${error.message}`));
  page.on("console",message=>{if(message.type()==="error")issues.push(`console: ${message.text()}`);});
  page.on("response",response=>{if(response.status()>=400&&new URL(response.url()).origin===new URL(page.url()||"http://127.0.0.1:4173").origin)issues.push(`HTTP ${response.status()}: ${response.url()}`);});
  await page.addInitScript(()=>localStorage.setItem("tuntun-language","zh"));
  await page.goto(gameUrl);
  const frame=page.locator("#gameFrame").contentFrame();
  await expect(frame.getByRole("button",{name:"开始游戏 ◆"})).toBeVisible();
  return {frame,issues};
}

export async function startRun(frame){
  await frame.getByRole("button",{name:"开始游戏 ◆"}).click();
  await frame.getByRole("button",{name:"选择出战"}).click();
  await expect(frame.locator("#hud")).toBeVisible();
}

export async function testSnapshot(frame){
  return frame.locator("body").evaluate(()=>window.__tuntunTest.snapshot());
}

export function expectNoRuntimeIssues(issues){expect(issues,"runtime errors or failed same-origin resources").toEqual([]);}
