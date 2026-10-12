import { test, expect } from '@playwright/test';

test.describe('Budgets access and page behavior', () => {
  test('Budget form exposes category and period options and can be canceled', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;
    test.skip(!email || !password, 'Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD in .env');

    // 1. Sign in, open /budgets, and open Add Budget.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill(email!);
    await page.getByRole('textbox', { name: 'Password' }).fill(password!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
    await page.getByRole('link', { name: 'Budgets' }).click();
    await expect(page).toHaveURL(/\/budgets$/, { timeout: 15_000 });
    await page.getByRole('button', { name: 'Add Budget' }).click();
    await expect(page.getByRole('heading', { name: 'New Budget' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: 'Select a category' })).toBeVisible();
    await expect(page.getByRole('spinbutton', { name: 'Budget Limit' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^(January|February|March|April|May|June|July|August|September|October|November|December)$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^20\d{2}$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();

    // 2. Open the category selector.
    await page.getByRole('button', { name: 'Select a category' }).click();
    const categoryOptions = page.getByRole('listbox').getByRole('option');
    await expect(categoryOptions).toHaveCount(12, { timeout: 10_000 });
    await expect(page.getByRole('option', { name: /Food & Dining/ })).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press('Escape');

    // 3. Open Month and Year selectors.
    const monthSelector = page.getByRole('button', { name: /^(January|February|March|April|May|June|July|August|September|October|November|December)$/ });
    await monthSelector.click();
    const monthOptions = page.getByRole('listbox').getByRole('option');
    await expect(monthOptions).toHaveCount(12, { timeout: 10_000 });
    await expect(page.getByRole('option', { name: 'January', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'December', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');

    const yearSelector = page.getByRole('button', { name: /^20\d{2}$/ });
    await yearSelector.click();
    const yearOptions = page.getByRole('listbox').getByRole('option');
    await expect(yearOptions).toHaveCount(5, { timeout: 10_000 });
    await expect(page.getByRole('option', { name: '2026', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: '2030', exact: true })).toBeVisible();

    // 4. Cancel the form without submitting.
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'New Budget' })).toHaveCount(0, { timeout: 10_000 });
    await expect(page.getByText('No budgets yet')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/0 active budgets$/)).toBeVisible({ timeout: 10_000 });
  });
});
