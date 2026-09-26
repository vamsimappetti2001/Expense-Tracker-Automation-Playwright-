// spec: specs/expenses-page-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Expenses page workflows', () => {
  test('Create a valid expense and verify persistence', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;
    //test.skip(!email || !password, 'Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD for a dedicated test account.');
    test.setTimeout(90_000);

    const description = `e2e expense ${Date.now()}`;
    const amount = '23.45';

    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill('vamsimappetti@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Arunadeena@1822');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).not.toHaveURL(/\/signin$/, { timeout: 60_000 });
    await page.getByRole('link', { name: 'Expenses' }).click();
    await expect(page).toHaveURL(/\/expenses$/);

    // 1. Open Add Expense and inspect the Amount, Description, and category controls.
    await page.getByRole('button', { name: 'Add Expense' }).click();
    await expect(page.getByRole('spinbutton', { name: 'Amount' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Description' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Select a category' })).toBeVisible();

    // 2. Create one uniquely described expense with a valid positive amount and available category.
    await page.getByRole('spinbutton', { name: 'Amount' }).fill(amount);
    await page.getByRole('textbox', { name: 'Description' }).fill(description);
    await page.getByRole('button', { name: 'Select a category' }).click();
    await page.locator('#categoryId').getByText('Shopping', { exact: true }).click();
    await page.getByRole('button', { name: 'Create' }).click();
    const expense = page.getByText(description, { exact: true });
    await expect(expense).toHaveCount(1);

    // 3. Reload Expenses and navigate away and back.
    await page.reload();
    await expect(expense).toHaveCount(1);
    await page.goBack();
    await page.goForward();
    await expect(page).toHaveURL(/\/expenses$/);
    await expect(expense).toHaveCount(1);
  });
});
