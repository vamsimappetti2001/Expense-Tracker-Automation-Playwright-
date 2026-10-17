import { test, expect } from '@playwright/test';

const categoryIcons = [
  '🍔', '🚗', '🛒', '🏠', '💡', '📚', '🎬', '❤️', '✈️', '✨', '💰',
  '🛡️', '🎁', '🎵', '📷', '🐾', '☕', '🎮', '🏋️', '💳', '🎯', '📦',
];

test.describe('Categories page', () => {
  test('Add Category form exposes all controls and icons', async ({ page }) => {
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

    // 2. Open Add Category and verify all form controls.
    await page.getByRole('button', { name: 'Add Category' }).click();
    await expect(page.getByRole('heading', { name: 'New Category' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('textbox', { name: 'Category Name' })).toHaveAttribute('placeholder', 'e.g. Groceries');
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create', exact: true })).toBeVisible();
    await expect(page.getByRole('button').nth(2)).toBeVisible();

    // 3. Verify every observed Icon choice is available.
    for (const icon of categoryIcons) {
      await expect(page.getByRole('button', { name: icon, exact: true })).toBeVisible({ timeout: 10_000 });
    }

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'New Category' })).toHaveCount(0, { timeout: 10_000 });
  });
});
