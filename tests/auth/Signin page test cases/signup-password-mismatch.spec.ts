// spec: specs/expense-tracker-dashboard-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and Access Control', () => {
  test('Sign-up rejects mismatched password confirmation', async ({ page }) => {
    // 1. Open the sign-up form.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signup');

    // 2. Enter a valid-format fake address, unique username, compliant password, and different confirmation password.
    await page.locator('input[placeholder="Enter your email"]').fill('planner-mismatch@example.invalid');
    await page.locator('input[placeholder="Choose a username"]').fill('planner-mismatch-user');
    await page.locator('input[placeholder="Create a password"]').fill('ValidPass1');
    await page.locator('input[placeholder="Confirm your password"]').fill('DifferentPass2');

    // 3. Submit and verify account creation is blocked.
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByText('Passwords do not match')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
  });
});
