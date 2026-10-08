// spec: specs/expenses-page-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Expenses page workflows', () => {
  test('Authenticated expenses list states', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL ?? 'vamsimappetti@gmail.com';
    const password = process.env.EXPENSE_TRACKER_PASSWORD ?? 'Arunadeena@1822';
    test.setTimeout(90_000);

    // 1. Sign in to the application with the dedicated test account.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).not.toHaveURL(/\/signin$/, { timeout: 60_000 });

    // 2. Navigate to the Expenses page with the seeded dataset and verify the default list state.
    await page.goto('https://nest-js-expense-tracker.vercel.app/expenses');
    await expect(page).toHaveURL(/\/expenses$/);
    await expect(page.getByRole('heading', { name: 'Expenses' })).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(5);
    await expect(page.locator('tbody tr').first()).toContainText('Shopping');
    await expect(page.locator('tbody tr').first()).toContainText('₹');

    // 3. Search for a unique expense and confirm the list narrows correctly, then clear the query.
    const searchInput = page.getByPlaceholder('Search expenses...');
    await searchInput.fill('e2e expense');
    await searchInput.press('Enter');
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('tbody tr').first()).toContainText('e2e expense');
    await expect(page.locator('tbody tr').first()).not.toContainText('delete confirmation e2e');

    await searchInput.fill('');
    await searchInput.press('Enter');
    await expect(page.locator('tbody tr')).toHaveCount(5);
  });
});
