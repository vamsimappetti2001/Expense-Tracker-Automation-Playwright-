//import playwright modules
import { test, expect } from '@playwright/test';

//write a test case
test('Create new expense in expences and delete the expenses in list ', async ({ page }) => {
  await page.goto('https://nest-js-expense-tracker.vercel.app/signin');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('vamsimappetti@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Arunadeena@1822');
  await page.getByRole('button', { name: 'Sign In' }).click();
  //click expense link in website
  await page.getByRole('link', { name: 'Expenses' }).click();
  //adding new expense in list
  await page.getByRole('button', {name:'Add Expense'}).click();
  await page.getByRole('spinbutton', { name: 'Amount' }).fill('100');
  await page.getByRole('textbox', { name: 'Description' }).fill('merchant payment');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('grocery');
  await page.getByRole('button', { name: 'Select a category' }).click();
  await page.locator('#categoryId').getByText('Shopping').click();
  await page.getByRole('button', { name: 'Create' }).click();
//selecting the created expense and click to delete that one
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByText('Delete', {exact: true}).click();  
});