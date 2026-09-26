// spec: specs/expense-tracker-dashboard-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and Access Control', () => {
  test('Sign-up form navigation, controls, and required inputs', async ({ page }) => {
    // 1. From sign-in, open Sign up and inspect the form.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Confirm Password' })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: 'Monthly Income (Optional)' })).toBeVisible();
    await expect(page.getByText('At least 6 characters with uppercase, lowercase, and number/special character')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();

    // 2. Submit an empty form and verify the route remains on `/signup`.
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
  });
});
