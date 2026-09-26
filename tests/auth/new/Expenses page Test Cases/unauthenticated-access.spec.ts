// spec: specs/expenses-page-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Expenses page workflows', () => {
  test('Unauthenticated access is protected', async ({ page }) => {
    // 1. Navigate to /expenses in a fresh browser context without a session, reload, and use browser Back.
    await page.goto('https://nest-js-expense-tracker.vercel.app/expenses');
    await expect(page).toHaveURL(/\/signin$/);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

    await page.keyboard.press('Control+R');
    await expect(page).toHaveURL(/\/signin$/);

    await page.keyboard.press('Alt+ArrowLeft');
    await expect(page).toHaveURL(/\/signin$/);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByRole('row')).toHaveCount(0);
  });
});
