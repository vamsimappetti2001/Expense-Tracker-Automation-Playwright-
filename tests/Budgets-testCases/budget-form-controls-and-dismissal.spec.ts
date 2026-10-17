import { test, expect } from '@playwright/test';

test.describe('Budget form controls and selectors', () => {
  test('New Budget controls are visible and both dismiss actions preserve the empty state', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;
    test.skip(!email || !password, 'Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD in .env');

    // 1. Sign in and open the New Budget form.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill(email!);
    await page.getByRole('textbox', { name: 'Password' }).fill(password!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
    await page.getByRole('link', { name: 'Budgets' }).click();
    await expect(page).toHaveURL(/\/budgets$/, { timeout: 15_000 });
    await page.getByRole('button', { name: 'Add Budget' }).click();

    await expect(page.getByRole('heading', { name: 'New Budget' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: 'Select a category' })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: 'Budget Limit' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^(January|February|March|April|May|June|July|August|September|October|November|December)$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^20\d{2}$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();

    // 2. Cancel without entering values and verify the empty state remains.
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'New Budget' })).toHaveCount(0, { timeout: 10_000 });
    await expect(page.getByText('No budgets yet')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/0 active budgets$/)).toBeVisible({ timeout: 10_000 });

    // 3. Reopen and dismiss with the observed unlabeled header close button.
    await page.getByRole('button', { name: 'Add Budget' }).click();
    await expect(page.getByRole('heading', { name: 'New Budget' })).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button').nth(2).click();
    await expect(page.getByRole('heading', { name: 'New Budget' })).toHaveCount(0, { timeout: 10_000 });
    await expect(page.getByText('No budgets yet')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/0 active budgets$/)).toBeVisible({ timeout: 10_000 });
  });
});
