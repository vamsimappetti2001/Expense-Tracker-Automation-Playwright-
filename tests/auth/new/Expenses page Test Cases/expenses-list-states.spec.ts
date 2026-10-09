import { test, expect } from '@playwright/test';

test.describe('Expenses page workflows', () => {
  test('Authenticated expenses list states', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;

    if (!email || !password) {
      throw new Error('Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD to run this test.');
    }

    // 1. Open the Expense Tracker sign-in page.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');

    // 2. Sign in with the configured account credentials.
    await page.getByRole('textbox', { name: 'Email' }).fill("vamsimappetti@gmail.com");
    await page.getByRole('textbox', { name: 'Password' }).fill("Arunadeena@1822");
    await page.getByRole('button', { name: 'Sign In' }).click();

    // 3. Verify successful authentication by confirming the app leaves /signin.
    await expect(page).not.toHaveURL(/\/signin(?:\/)?$/i);

    // 4. Navigate to Expenses.
    await page.getByRole('link', { name: 'Expenses' }).click();

    // 5. Verify the expenses page and its list are visible.
    await expect(page.getByRole('heading', { name: 'Expenses' })).toBeVisible();

    // 6. Verify the empty expenses-list state and its guidance.
    await expect(page.getByText('No expenses found')).toBeVisible();
    await expect(page.getByText('Add your first expense to get')).toBeVisible();

    // 7. Check for visible page-level error messages.
    await expect(page.getByText(/error/i)).toHaveCount(0);
  });
});
