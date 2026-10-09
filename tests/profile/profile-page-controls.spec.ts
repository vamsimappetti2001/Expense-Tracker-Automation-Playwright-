import { test, expect } from '@playwright/test';

test.describe('Profile page workflows', () => {
  test('Authenticated profile controls and validation', async ({ page }) => {
    const email = process.env.EXPENSE_TRACKER_EMAIL;
    const password = process.env.EXPENSE_TRACKER_PASSWORD;

    if (!email || !password) {
      throw new Error('Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD in the project-root .env file.');
    }

    await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).not.toHaveURL(/\/signin(?:\/)?$/i);

    await page.goto('https://nest-js-expense-tracker.vercel.app/profile');
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    await expect(page.getByText('Manage your account settings')).toBeVisible();

    const usernameField = page.getByRole('textbox', { name: 'Username' });
    const incomeField = page.getByRole('spinbutton', { name: 'Monthly Income' });
    const emailField = page.getByRole('textbox', { name: 'Email' });
    const notifications = page.locator('input[name="emailNotifications"]');
    const notificationToggle = page.locator('label.toggle-switch');
    const saveChanges = page.getByRole('button', { name: 'Save Changes' });
    const originalUsername = await usernameField.inputValue();
    const originalIncome = await incomeField.inputValue();
    const notificationsInitiallyChecked = await notifications.isChecked();

    await expect(page.getByRole('heading', { name: originalUsername })).toBeVisible();
    await expect(page.getByText(email)).toBeVisible();
    await expect(emailField).toBeDisabled();
    await expect(emailField).toHaveValue(email);
    await expect(usernameField).toBeEnabled();
    await expect(incomeField).toBeEnabled();
    await expect(incomeField).toHaveAttribute('min', '0');
    await expect(incomeField).toHaveAttribute('step', '0.01');
    await expect(page.getByRole('heading', { name: 'Email Notifications' })).toBeVisible();
    await expect(page.getByText('Receive budget alerts and reports')).toBeVisible();
    await expect(notificationToggle).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Account Information' })).toBeVisible();
    await expect(page.getByText('Member since')).toBeVisible();
    await expect(page.getByText('Last updated')).toBeVisible();
    await expect(saveChanges).toBeDisabled();

    await usernameField.fill(`${originalUsername}-test`);
    await expect(saveChanges).toBeEnabled();
    await usernameField.fill(originalUsername);
    await expect(saveChanges).toBeDisabled();

    await notificationToggle.click();
    await expect(notifications).toHaveJSProperty('checked', !notificationsInitiallyChecked);
    await expect(saveChanges).toBeEnabled();
    await notificationToggle.click();
    await expect(notifications).toHaveJSProperty('checked', notificationsInitiallyChecked);
    await expect(saveChanges).toBeDisabled();

    await incomeField.fill('-1');
    await expect(incomeField).toHaveValue('-1');
    await expect(incomeField.evaluate(input => (input as HTMLInputElement).validity.rangeUnderflow)).resolves.toBe(true);
    await incomeField.fill(originalIncome);
    await expect(incomeField).toHaveValue(originalIncome);
    await expect(saveChanges).toBeDisabled();

    const accountMenu = page.getByRole('button', { name: /vandy/i });
    await accountMenu.click();
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Help & Support' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
    await accountMenu.click();

    for (const route of [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Expenses', path: '/expenses' },
      { name: 'Categories', path: '/categories' },
      { name: 'Budgets', path: '/budgets' },
      { name: 'Profile', path: '/profile' },
    ]) {
      await page.getByRole('link', { name: route.name }).click();
      await expect(page).toHaveURL(new RegExp(`${route.path}$`));
      if (route.path !== '/profile') {
        await page.goto('https://nest-js-expense-tracker.vercel.app/profile');
      }
    }

    await expect(usernameField).toHaveValue(originalUsername);
    await expect(incomeField).toHaveValue(originalIncome);
    await expect(notifications).toHaveJSProperty('checked', notificationsInitiallyChecked);
    await expect(saveChanges).toBeDisabled();
    await expect(page.getByText(/error/i)).toHaveCount(0);
  });
});
