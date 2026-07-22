import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('vamsimappetti@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Arunadeena@1822');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Expenses' }).click();
  // await page.getByRole('spinbutton', { name: 'Amount' }).fill('2000');
  // await page.getByRole('textbox', { name: 'Description' }).fill('cloths');
});