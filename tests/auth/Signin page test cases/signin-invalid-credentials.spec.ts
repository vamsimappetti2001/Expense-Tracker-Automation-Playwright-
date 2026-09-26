// spec: specs/expense-tracker-dashboard-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and Access Control', () => {
  test('Sign-in rejects invalid credentials', async ({ page }) => {
    // 1. Open `/signin`.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');

    // 2. Submit a reserved `.invalid` email and a dummy password.
    await page.getByRole('textbox', { name: 'Email' }).fill('invalid-user@example.invalid');
    await page.locator('input[placeholder="Enter your password"]').fill('invalid-password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Verify the user remains unauthenticated and receives a failure state.
    await expect(page).toHaveURL(/\/signin$/);
    await expect(page.getByText('Please check your login credentials')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });
});
