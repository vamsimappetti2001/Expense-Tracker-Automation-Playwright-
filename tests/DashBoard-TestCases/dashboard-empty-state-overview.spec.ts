import { test, expect } from '@playwright/test';

test.describe('Authenticated dashboard overview', () => {
  test('Dashboard displays all overview metrics and panels for a fresh account', async ({ page }) => {
    // 1. Navigate to the dashboard in the authenticated browser session.
    await page.goto('https://nest-js-expense-tracker.vercel.app/dashboard');
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Total Spent', { exact: true })).toBeVisible({ timeout: 10_000 });

    // 2. Verify all four summary metrics match the observed fresh-account state.
    await expect(page.getByText('Total Spent', { exact: true }).locator('..')).toContainText('₹0.00', { timeout: 10_000 });
    await expect(page.getByText('Total Budget', { exact: true }).locator('..')).toContainText('₹0.00', { timeout: 10_000 });
    await expect(page.getByText('Expense Count', { exact: true }).locator('..')).toContainText('0', { timeout: 10_000 });
    await expect(page.getByText('Avg. Expense', { exact: true }).locator('..')).toContainText('₹0.00', { timeout: 10_000 });

    // 3. Verify all dashboard panels are present, including the below-the-fold content.
    await expect(page.getByText('Budget Utilization', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Spent: ₹0.00', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('0.0%', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Budget: ₹0.00', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Spending Trends (6 months)', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('May 2026', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Jun 2026', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Jul 2026', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Aug 2026', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Sep 2026', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Oct 2026', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Category Breakdown', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Top Expenses', { exact: true })).toBeVisible({ timeout: 10_000 });
  });
});
