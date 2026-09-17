import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load home page with hero section", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should navigate to recipes page", async ({ page }) => {
    await page.click('a[href="/recipes"]');
    await expect(page).toHaveURL(/\/recipes/);
    await expect(page.locator('input[type="search"]')).toBeVisible();
  });

  test("should navigate to saved recipes page", async ({ page }) => {
    await page.click('a[href="/saved"]');
    await expect(page).toHaveURL(/\/saved/);
  });
});

test.describe("Recipes Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/recipes");
  });

  test("should display search bar", async ({ page }) => {
    await expect(page.locator('input[type="search"]')).toBeVisible();
  });

  test("should filter by meal type", async ({ page }) => {
    await page.click('button:has-text("Filters")');
    await page.click('label:has-text("Breakfast")');
    await page.click('button:has-text("Apply Filters")');
    await expect(page).toHaveURL(/mealType=Breakfast/);
  });

  test("should search recipes", async ({ page }) => {
    await page.fill('input[type="search"]', "pasta");
    await page.press('input[type="search"]', "Enter");
    await expect(page).toHaveURL(/q=pasta/);
  });
});

test.describe("Recipe Detail Page", () => {
  test("should display recipe details", async ({ page }) => {
    await page.goto("/recipes");
    const firstRecipe = page.locator('[data-testid="recipe-card"]').first();
    if (await firstRecipe.isVisible()) {
      await firstRecipe.click();
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("text=Ingredients")).toBeVisible();
    }
  });
});

test.describe("Theme Toggle", () => {
  test("should toggle theme", async ({ page }) => {
    await page.goto("/");
    const themeButton = page.locator('button[aria-label*="theme" i]');
    await themeButton.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await themeButton.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});

test.describe("Mobile Navigation", () => {
  test("should show mobile nav on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.locator("nav[aria-label='Mobile navigation']")).toBeVisible();
  });
});