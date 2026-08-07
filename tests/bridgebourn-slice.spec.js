import { test, expect } from "@playwright/test";

test.describe("Bridgebourn-inspired combat slice", () => {
  test("desktop loads all combat layers and the melee mantis", async ({ page }) => {
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/prototypes/bridgebourn-slice.html");
    await expect(page.locator("#title")).toContainText("2.5D LAB");
    await page.keyboard.press("b");
    await expect(page.locator("#bossText")).toContainText("巨型螳螂");
    await page.waitForTimeout(1200);
    await expect(page.locator("#stats")).toContainText("FPS");
    expect(errors).toEqual([]);
  });

  test("landscape phone layout exposes joystick and scream", async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto("/prototypes/bridgebourn-slice.html");
    await expect(page.locator("#stick")).toBeVisible();
    await expect(page.locator("#action")).toBeVisible();
    await expect(page.locator("canvas")).toBeVisible();
  });
});
