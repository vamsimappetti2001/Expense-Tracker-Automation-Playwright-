import { test, expect } from '@playwright/test';

test.describe('Budgets access, navigation, and list states', () => {
  test('Unauthenticated access to Budgets is protected', async ({ page }) => {
    // 1. Navigate directly to the protected route without authentication.
    await page.goto('https://nest-js-expense-tracker.vercel.app/budgets');
    await expect(page).toHaveURL(/\/signin$/, { timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('heading', { name: 'Budgets', exact: true })).toHaveCount(0);
    await expect(page.getByText('No budgets yet')).toHaveCount(0);

    // 2. Refresh the redirected page.
    await page.keyboard.press('Control+r');
    await expect(page).toHaveURL(/\/signin$/, { timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible({ timeout: 10_000 });
  });
});
