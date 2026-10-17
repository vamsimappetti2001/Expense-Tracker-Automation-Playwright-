import { test, expect } from '@playwright/test';

test.describe('Categories page', () => {
  test('Header close control dismisses Add Category', async ({ page }) => {
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

    // 2. Open Add Category.
    await page.getByRole('button', { name: 'Add Category' }).click();
    await expect(page.getByRole('heading', { name: 'New Category' })).toBeVisible({ timeout: 10_000 });

    // 3. Close the form with the observed unlabeled header button.
    await page.getByRole('button').nth(2).click();
    await expect(page.getByRole('heading', { name: 'New Category' })).toHaveCount(0, { timeout: 10_000 });
    await expect(page.getByRole('heading', { name: 'Categories', exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('12 categories (12 default, 0 custom)', { exact: true })).toBeVisible({ timeout: 10_000 });
  });
});
