import { test, expect } from '@playwright/test';

test.describe('Budgets access, navigation, and list states', () => {
  test('Authenticated user sees the current Budgets state', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;
    test.skip(!email || !password, 'Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD in .env');

    // 1. Sign in and wait for the dashboard before continuing.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill(email!);
    await page.getByRole('textbox', { name: 'Password' }).fill(password!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });

    // 2. Open Budgets and verify the account's empty state.
    await page.getByRole('link', { name: 'Budgets' }).click();
    await expect(page).toHaveURL(/\/budgets$/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Budgets', exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/\d{4} · 0 active budgets$/)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('No budgets yet')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Create your first budget to start tracking your spending')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: 'Add Budget' })).toBeVisible({ timeout: 10_000 });

    // 3. Reload and verify the empty state remains account-scoped and stable.
    await page.keyboard.press('Control+r');
    await expect(page).toHaveURL(/\/budgets$/, { timeout: 15_000 });
    await expect(page.getByText('No budgets yet')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/\d{4} · 0 active budgets$/)).toBeVisible({ timeout: 10_000 });
  });
});
