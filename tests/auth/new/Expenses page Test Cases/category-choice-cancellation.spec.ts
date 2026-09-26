// spec: specs/expenses-page-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';
import { getMaxListeners } from 'events';

test.describe('Expenses page workflows', () => {
  test('Category choice and form cancellation', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;
    //test.skip(!email || !password, 'Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD for a dedicated test account.');
    test.setTimeout(90_000);

    const description = `cancelled e2e expense ${Date.now()}`;

    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill('vamsimappetti@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Arunadeena@1822');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).not.toHaveURL(/\/signin$/, { timeout: 60_000 });
    await page.getByRole('link', { name: 'Expenses' }).click();
    await expect(page).toHaveURL(/\/expenses$/);

    await page.getByRole('button', { name: 'Add Expense' }).click();
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('17.25');
    await page.getByRole('textbox', { name: 'Description' }).fill(description);

    const categorySelector = page.getByRole('button', { name: 'Select a category' });
    await categorySelector.click();
    await page.locator('#categoryId').getByText('Shopping', { exact: true }).click();

    const cancelButton = page.getByRole('button', { name: 'Cancel' });
    await expect(cancelButton).toBeVisible();
    await cancelButton.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText(description, { exact: true })).toHaveCount(0);
  });
});
