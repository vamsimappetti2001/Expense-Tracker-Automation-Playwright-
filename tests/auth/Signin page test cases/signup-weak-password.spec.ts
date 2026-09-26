// spec: specs/expense-tracker-dashboard-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and Access Control', () => {
  test('Sign-up rejects password that violates the displayed policy', async ({ page }) => {
    // 1. Open signup and enter a reserved example.invalid email, unique username, and matching weak passwords.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signup');
    await page.locator('input[placeholder="Enter your email"]').fill('planner-weak-pass@example.invalid');
    await page.locator('input[placeholder="Choose a username"]').fill('planner-weak-pass-user');
    await page.locator('input[placeholder="Create a password"]').fill('weak');
    await page.locator('input[placeholder="Confirm your password"]').fill('weak');

    // 2. Submit and verify the user remains on signup with the policy guidance visible.
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
    await expect(page.getByText('At least 6 characters with uppercase, lowercase, and number/special character')).toBeVisible();
  });
});
