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
  test('Default category cards remain on the Categories page when clicked', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;
    test.skip(!email || !password, 'Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD in .env');

    // 1. Sign in, open Categories, and verify the default list is visible.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill(email!);
    await page.getByRole('textbox', { name: 'Password' }).fill(password!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
    await page.getByRole('link', { name: 'Categories' }).click();
    await expect(page).toHaveURL(/\/categories$/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Default Categories' })).toBeVisible({ timeout: 10_000 });

    // 2. Click each default category and verify the list remains unchanged.
    for (const category of defaultCategories) {
      await test.step(`Click ${category}`, async () => {
        await page.getByText(category, { exact: true }).click();
        await expect(page).toHaveURL(/\/categories$/, { timeout: 10_000 });
        await expect(page.getByText('12 categories (12 default, 0 custom)', { exact: true })).toBeVisible({ timeout: 10_000 });
        await expect(page.getByRole('heading', { name: 'New Category' })).toHaveCount(0);
      });
    }
  });
});
