// spec: specs/expenses-page-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Expenses page workflows', () => {
  test('Delete expense confirmation', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_DELETE_EMAIL;
    const password = process.env.EXPENSE_TRACKER_DELETE_PASSWORD;
    test.skip(!email || !password, 'Set EXPENSE_TRACKER_DELETE_EMAIL and EXPENSE_TRACKER_DELETE_PASSWORD in .env.');
    test.setTimeout(90_000);

    const description = `delete confirmation e2e ${Date.now()}`;

    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill('vamsimappetti@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Arunadeena@1822');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).not.toHaveURL(/\/signin$/, { timeout: 60_000 });
    await page.getByRole('link', { name: 'Expenses' }).click();
    await expect(page).toHaveURL(/\/expenses$/);

    await page.getByRole('button', { name: 'Add Expense' }).click();
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('19.75');
    await page.getByRole('textbox', { name: 'Description' }).fill(description);
    await page.getByRole('button', { name: 'Select a category' }).click();
    await page.locator('#categoryId').getByText('Shopping', { exact: true }).click();
    await page.getByRole('button', { name: 'Create' }).click();

    const expense = page.getByText(description, { exact: true });
    await expect(expense).toHaveCount(1);

    const expenseRow = page.getByRole('row').filter({ hasText: description });
    await expect(expenseRow).toHaveCount(1);
    const deleteButton = expenseRow.getByRole('button', { name: 'Delete' });
    const confirmationText = page.getByText(`Are you sure you want to delete "${description}"?`, { exact: true });
    const confirmation = confirmationText.locator('..');

    // Cancel first and verify the uniquely created record remains.
    await deleteButton.click();
    await expect(confirmationText).toBeVisible();
    await confirmation.getByRole('button', { name: 'Cancel' }).click();
    await expect(expense).toHaveCount(1);

    // Confirm deletion and verify only the selected record is removed.
    await deleteButton.click();
    await expect(confirmationText).toBeVisible();
    await confirmation.getByRole('button', { name: 'Delete' }).click();
    await expect(expense).toHaveCount(0);
  });
});
