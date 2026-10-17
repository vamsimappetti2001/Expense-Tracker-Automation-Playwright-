import { test, expect } from '@playwright/test';

test.describe('Categories page', () => {
  test('Unauthenticated users are redirected away from Categories', async ({ page }) => {
    // 1. Start with a fresh browser context without authentication and navigate directly to Categories.
    await page.goto('https://nest-js-expense-tracker.vercel.app/categories');
    await expect(page).toHaveURL(/\/signin$/, { timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('heading', { name: 'Categories', exact: true })).toHaveCount(0);

    // 2. Refresh the redirected page.
    await page.keyboard.press('Control+r');
    await expect(page).toHaveURL(/\/signin$/, { timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible({ timeout: 10_000 });
  });
});
