import { test, expect } from '@playwright/test';

test('Sign in Expense tracker website', async ({ page }) => {
  await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('vamsimappetti@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Arunadeena@1822');
  await page.getByRole('button', { name: 'Sign In' }).click();
});