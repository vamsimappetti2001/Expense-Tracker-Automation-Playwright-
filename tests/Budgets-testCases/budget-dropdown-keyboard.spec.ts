import { test, expect } from '@playwright/test';

test.describe('Budget form controls and selectors', () => {
  test('Budget selectors support keyboard selection and Escape dismissal', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;
    test.skip(!email || !password, 'Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD in .env');

    // 1. Sign in and open the New Budget form.
    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill(email!);
    await page.getByRole('textbox', { name: 'Password' }).fill(password!);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
    await page.getByRole('link', { name: 'Budgets' }).click();
    await expect(page).toHaveURL(/\/budgets$/, { timeout: 15_000 });
    await page.getByRole('button', { name: 'Add Budget' }).click();
    await expect(page.getByRole('heading', { name: 'New Budget' })).toBeVisible({ timeout: 10_000 });

    // 2. Open Category with the keyboard and attempt to select the focused option.
    const categorySelector = page.getByRole('button', { name: 'Select a category' });
    await categorySelector.focus();
    await page.keyboard.press('Space');
    const categoryListbox = page.getByRole('listbox');
    await expect(categoryListbox).toBeVisible({ timeout: 10_000 });
    await expect(categoryListbox.getByRole('option')).toHaveCount(12, { timeout: 10_000 });
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect.soft(categorySelector).not.toHaveText('Select a category', { timeout: 10_000 });

    // 3. Escape dismisses Month and Year lists without changing their values.
    const monthSelector = page.getByRole('button', { name: /^(January|February|March|April|May|June|July|August|September|October|November|December)$/ });
    const selectedMonth = await monthSelector.textContent();
    await monthSelector.focus();
    await page.keyboard.press('Space');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press('Escape');
    await expect(monthSelector).toContainText(selectedMonth!, { timeout: 10_000 });

    const yearSelector = page.getByRole('button', { name: /^20\d{2}$/ });
    const selectedYear = await yearSelector.textContent();
    await yearSelector.focus();
    await page.keyboard.press('Space');
    await expect(page.getByRole('listbox')).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press('Escape');
    await expect(yearSelector).toContainText(selectedYear!, { timeout: 10_000 });

    // 4. Cancel without creating a budget.
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'New Budget' })).toHaveCount(0, { timeout: 10_000 });
    await expect(page.getByText('No budgets yet')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/0 active budgets$/)).toBeVisible({ timeout: 10_000 });
  });
});
