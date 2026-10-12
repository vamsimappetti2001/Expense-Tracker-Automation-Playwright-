import { test, expect } from '@playwright/test';

const budgetMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const budgetYears = ['2026', '2027', '2028', '2029', '2030'];

test.describe('Budgets access and page behavior', () => {
  test('Each month and year can be selected', async ({ page }) => {
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

    const monthSelector = page.getByRole('button', {
      name: /^(January|February|March|April|May|June|July|August|September|October|November|December)$/,
    });
    const yearSelector = page.getByRole('button', { name: /^20(26|27|28|29|30)$/ });

    // 2. Select every month and verify the Month control displays each choice.
    for (const month of budgetMonths) {
      await test.step(`Select ${month}`, async () => {
        await monthSelector.click();
        const monthListbox = page.getByRole('listbox');
        await expect(monthListbox).toBeVisible({ timeout: 10_000 });
        await expect(monthListbox.getByRole('option')).toHaveCount(12, { timeout: 10_000 });
        await monthListbox.getByRole('option', { name: month, exact: true }).click();
        await expect(monthSelector).toContainText(month, { timeout: 10_000 });
      });
    }

    // 3. Select every available year and verify the Year control displays each choice.
    for (const year of budgetYears) {
      await test.step(`Select ${year}`, async () => {
        await yearSelector.click();
        const yearListbox = page.getByRole('listbox');
        await expect(yearListbox).toBeVisible({ timeout: 10_000 });
        await expect(yearListbox.getByRole('option')).toHaveCount(5, { timeout: 10_000 });
        await yearListbox.getByRole('option', { name: year, exact: true }).click();
        await expect(yearSelector).toContainText(year, { timeout: 10_000 });
      });
    }

    // 4. Cancel without creating a budget.
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'New Budget' })).toHaveCount(0, { timeout: 10_000 });
    await expect(page.getByText('No budgets yet')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/0 active budgets$/)).toBeVisible({ timeout: 10_000 });
  });
});
