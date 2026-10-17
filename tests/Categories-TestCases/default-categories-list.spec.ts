import { test, expect } from '@playwright/test';

const defaultCategories = [
  'Bills & Utilities',
  'Education',
  'Entertainment',
  'Food & Dining',
  'Healthcare',
  'Insurance',
  'Other',
  'Personal Care',
  'Savings',
  'Shopping',
  'Transportation',
  'Travel',
];

test.describe('Categories page', () => {
  test('Authenticated Categories page displays the complete default list', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;
    test.skip(!email || !password, 'Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD in .env');

    // 1. Sign in and wait for the dashboard before opening Categories.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill(email!);
    await page.getByRole('textbox', { name: 'Password' }).fill(password!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
    await page.getByRole('link', { name: 'Categories' }).click();
    await expect(page).toHaveURL(/\/categories$/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Categories', exact: true })).toBeVisible({ timeout: 10_000 });

    // 2. Verify the count and every default category entry.
    await expect(page.getByText('12 categories (12 default, 0 custom)', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('heading', { name: 'Default Categories' })).toBeVisible({ timeout: 10_000 });
    for (const category of defaultCategories) {
      await expect(page.getByText(category, { exact: true })).toBeVisible({ timeout: 10_000 });
    }
    await expect(page.getByText('Default', { exact: true })).toHaveCount(12, { timeout: 10_000 });
  });
});
