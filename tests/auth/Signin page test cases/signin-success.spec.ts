// spec: specs/expense-tracker-dashboard-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and Access Control', () => {
  test('Sign in with the demo account', async ({ page }) => {
    test.setTimeout(90_000);

    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;
    //test.skip(!email || !password, 'Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD to run this test.');

    // 1. Navigate to the sign-in page.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');

    // 2. Enter the account email and password from environment variables.
    await page.getByRole('textbox', { name: 'Email' }).fill('vamsimappetti@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('Arunadeena@1822');

    // 3. Submit the form and wait for successful login via a web-first URL assertion.
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).not.toHaveURL(/\/signin$/, { timeout: 60_000 });

    // Verify the authenticated navigation is visible.
    await expect(page.getByRole('link', { name: 'Expenses' })).toBeVisible({ timeout: 15_000 });
  });
});
