// spec: specs/expenses-page-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Expenses page workflows', () => {
  test('Expense request failures and duplicate submission', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_DELETE_EMAIL;
    const password = process.env.EXPENSE_TRACKER_DELETE_PASSWORD;
    test.skip(!email || !password, 'Set EXPENSE_TRACKER_DELETE_EMAIL and EXPENSE_TRACKER_DELETE_PASSWORD in .env.');
    test.setTimeout(90_000);

    const description = `reliability e2e ${Date.now()}`;

    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill('vamsimappetti@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Arunadeena@1822');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).not.toHaveURL(/\/signin$/, { timeout: 60_000 });
    await page.getByRole('link', { name: 'Expenses' }).click();
    await expect(page).toHaveURL(/\/expenses$/);

    await page.getByRole('button', { name: 'Add Expense' }).click();
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('12.50');
    await page.getByRole('textbox', { name: 'Description' }).fill(description);
    await page.getByRole('button', { name: 'Select a category' }).click();
    await page.locator('#categoryId').getByText('Shopping', { exact: true }).click();

    let createRequestCount = 0;
    let signalCreateRequest!: () => void;
    let releaseCreateRequests!: () => void;
    const createRequestStarted = new Promise<void>((resolve) => {
      signalCreateRequest = resolve;
    });
    const releaseRequests = new Promise<void>((resolve) => {
      releaseCreateRequests = resolve;
    });

    await page.route('**/*', async (route) => {
      if (route.request().method() === 'POST') {
        createRequestCount += 1;
        signalCreateRequest();
        await releaseRequests;
      }
      await route.continue();
    });

    const createButton = page.getByRole('button', { name: 'Create' });
    try {
      await createButton.click();
      await createRequestStarted;
      await createButton.click({ timeout: 1_000 }).catch(() => undefined);
    } finally {
      releaseCreateRequests();
    }

    const expense = page.getByText(description, { exact: true });
    await expect(expense).toHaveCount(1);
    expect(createRequestCount).toBe(1);

    const expenseRow = page.getByRole('row').filter({ hasText: description });
    await expenseRow.getByRole('button', { name: 'Delete' }).click();
    const confirmationText = page.getByText(`Are you sure you want to delete "${description}"?`, { exact: true });
    const confirmation = confirmationText.locator('..');
    await expect(confirmationText).toBeVisible();
    await confirmation.getByRole('button', { name: 'Delete' }).click();
    await expect(expense).toHaveCount(0);
  });
});
