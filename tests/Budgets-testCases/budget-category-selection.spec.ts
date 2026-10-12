import { test, expect } from '@playwright/test';

const budgetCategories = [
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

test.describe('Budgets access and page behavior', () => {
  test('Each budget category can be selected', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;
    test.skip(!email || !password, 'Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD in .env');

    // 1. Sign in, open /budgets, and open Add Budget.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill(email!);
    await page.getByRole('textbox', { name: 'Password' }).fill(password!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
    await page.getByRole('link', { name: 'Budgets' }).click();
    await expect(page).toHaveURL(/\/budgets$/, { timeout: 15_000 });
    await page.getByRole('button', { name: 'Add Budget' }).click();
    await expect(page.getByRole('heading', { name: 'New Budget' })).toBeVisible({ timeout: 10_000 });

    // 2. Select every observed category and verify it becomes the active Category value.
    const categorySelector = page.getByRole('button', {
      name: /Select a category|Bills & Utilities|Education|Entertainment|Food & Dining|Healthcare|Insurance|Other|Personal Care|Savings|Shopping|Transportation|Travel/,
    });

    for (const category of budgetCategories) {
      await test.step(`Select ${category}`, async () => {
        await categorySelector.click();
        await page.getByRole('option', { name: new RegExp(category) }).click();
        await expect(categorySelector).toContainText(category, { timeout: 10_000 });
      });
    }

    // 3. Cancel without creating a budget.
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'New Budget' })).toHaveCount(0, { timeout: 10_000 });
    await expect(page.getByText('No budgets yet')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/0 active budgets$/)).toBeVisible({ timeout: 10_000 });
  });
});
