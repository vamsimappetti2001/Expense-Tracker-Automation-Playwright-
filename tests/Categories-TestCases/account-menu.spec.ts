import { test, expect } from '@playwright/test';

test.describe('Categories page', () => {
  test('Account menu exposes its navigation actions', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;
    test.skip(!email || !password, 'Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD in .env');

    // 1. Sign in and open Categories.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill(email!);
    await page.getByRole('textbox', { name: 'Password' }).fill(password!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
    await page.getByRole('link', { name: 'Categories' }).click();
    await expect(page).toHaveURL(/\/categories$/, { timeout: 15_000 });

    // 2. Open the account menu and verify its actions.
    const accountMenuButton = page.getByRole('button', { name: 'V vandy' });
    await accountMenuButton.click();
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('link', { name: 'Help & Support' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible({ timeout: 10_000 });

    // 3. Close the account menu without activating any menu item.
    await accountMenuButton.click();
    await expect(page.getByRole('link', { name: 'Settings' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Sign Out' })).toHaveCount(0);
    await expect(page).toHaveURL(/\/categories$/, { timeout: 10_000 });
  });
});
