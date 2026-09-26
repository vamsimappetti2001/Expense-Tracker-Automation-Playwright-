// spec: specs/expense-tracker-dashboard-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and Access Control', () => {
  test('Sign-up rejects malformed email before creating an account', async ({ page }) => {
    // 1. Open the sign-up form.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signup');

    // 2. Fill all required fields with a malformed fake email and compliant matching password; leave optional income blank.
    await page.getByRole('textbox', { name: 'Email' }).fill('planner-invalid-email');
    await page.getByRole('textbox', { name: 'Username' }).fill('planner-test-user');
    await page.locator('input[placeholder="Create a password"]').fill('ValidPass1');
    await page.locator('input[placeholder="Confirm your password"]').fill('ValidPass1');

    // 3. Submit Create Account and verify the malformed email is rejected.
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
  });
});
