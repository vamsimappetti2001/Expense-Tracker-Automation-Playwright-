// spec: specs/expense-tracker-dashboard-test-plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Authentication and Access Control', () => {
  test('Sign-in screen controls and required-field validation', async ({ page }) => {
    // 1. Open `/signin` in a fresh browser context and inspect the form.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    const emailField = page.getByRole('textbox', { name: 'Email' });
    const passwordField = page.getByRole('textbox', { name: 'Password' });
    const rememberMe = page.getByRole('checkbox', { name: 'Remember me' });
    const signInButton = page.getByRole('button', { name: 'Sign In' });
    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
    await expect(rememberMe).toBeVisible();
    await expect(rememberMe).not.toBeChecked();
    await expect(signInButton).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();

    // 2. Submit the form with both fields empty, then with only Email and only Password populated.
    await signInButton.click();
    await expect(page).toHaveURL(/\/signin$/);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

    await emailField.fill('planner-test@example.invalid');
    await signInButton.click();
    await expect(page).toHaveURL(/\/signin$/);
    await expect(passwordField).toBeVisible();

    await emailField.clear();
    await passwordField.fill('NotARealPassword9');
    await signInButton.click();
    await expect(page).toHaveURL(/\/signin$/);
    await expect(emailField).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });
});
