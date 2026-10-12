# Budgets Page Test Plan

## Application Overview

Target: https://nest-js-expense-tracker.vercel.app/budgets. Anonymous access redirects to /signin. Authenticated exploration reached /dashboard and then /budgets. The test account currently has no budgets; the page shows the current month and year, 0 active budgets, an Add Budget button, and the empty state. Add Budget opens a New Budget form with Category, Budget Limit (₹ numeric input), Month, Year, Cancel, and Create controls.

The Category selector contains 12 options, each verified by selecting it and observing the selected value: Bills & Utilities, Education, Entertainment, Food & Dining, Healthcare, Insurance, Other, Personal Care, Savings, Shopping, Transportation, and Travel. Month offers January through December, and Year offers 2026 through 2030. Each month and year was selected live and shown as the active value. The form was canceled without submitting, so no account data was changed.

Authenticated specs use EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD. The Playwright config loads a local .env file. Do not hard-code credentials in tests. Use a dedicated non-production account for future mutating tests.

## Test Scenarios

### 1. Budgets access and page behavior

**Seed:** `seed.spec.ts`

#### 1.1. Unauthenticated visitors are redirected to sign in
**File:** `tests/Budgets-testCases/unauthenticated-budget-access.spec.ts`
**Status:** Generated from live browser verification.

**Steps:**
1. Open /budgets in a fresh unauthenticated browser context.
   - Verify the route redirects to /signin.
   - Verify the sign-in button is visible and no Budgets heading is exposed.
2. Refresh the redirected page.
   - Verify the visitor remains on /signin.

#### 1.2. Authenticated user can open the budgets page
**File:** `tests/Budgets-testCases/authenticated-budget-page.spec.ts`
**Status:** Generated from live browser verification; requires credentials in local .env or environment variables.

**Steps:**
1. Sign in using EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD.
   - Verify login reaches /dashboard.
2. Open Budgets from the navigation.
   - Verify /budgets loads and the Budgets heading, active budget count, Add Budget action, and observed empty-state text are visible.

#### 1.3. Budget form exposes category and period options and can be canceled
**File:** `tests/Budgets-testCases/budget-form-options-and-cancel.spec.ts`
**Status:** Generated from live browser verification; requires credentials in local .env or environment variables.

**Steps:**
1. Sign in and open the New Budget form.
   - Verify Category, Budget Limit, Month, Year, Cancel, and Create controls are visible.
2. Open Category.
   - Verify 12 options are present, including Food & Dining.
3. Open Month and Year.
   - Verify all 12 months (January-December) and five years (2026-2030) are available.
4. Cancel without submitting.
   - Verify the form closes and the zero-budget empty state remains.

#### 1.4. Every budget category can be selected
**File:** `tests/Budgets-testCases/budget-category-selection.spec.ts`
**Status:** Generated after live selection verification for every category; requires credentials in local .env or environment variables.

**Steps:**
1. Sign in and open the New Budget form.
2. Select each category and verify it becomes the selected Category value: Bills & Utilities, Education, Entertainment, Food & Dining, Healthcare, Insurance, Other, Personal Care, Savings, Shopping, Transportation, and Travel.
3. Cancel without submitting.
   - Verify the form closes, No budgets yet remains visible, and the active budget count remains zero.

#### 1.5. Every budget month and year can be selected
**File:** `tests/Budgets-testCases/budget-period-selection.spec.ts`
**Status:** Generated after live selection verification for every month and year; requires credentials in local .env or environment variables.

**Steps:**
1. Sign in and open the New Budget form.
2. Select each month and verify it becomes the selected Month value: January, February, March, April, May, June, July, August, September, October, November, and December.
3. Select each year and verify it becomes the selected Year value: 2026, 2027, 2028, 2029, and 2030.
4. Cancel without submitting.
   - Verify the form closes, No budgets yet remains visible, and the active budget count remains zero.

#### 1.6. Populated budget list and persistence
**File:** `tests/Budgets-testCases/budget-list-states.spec.ts`
**Status:** Not generated; requires creating test data.

**Steps:**
1. In a dedicated isolated account, create a budget through the UI.
2. Reload the budgets page.
   - Verify the budget appears once with its saved category, month, year, and limit.

#### 1.7. Budget form validation
**File:** `tests/Budgets-testCases/budget-form-validation.spec.ts`
**Status:** Not generated; validation submission was not attempted to avoid unintended account mutation.

**Steps:**
1. Submit the form without required values in an isolated test account.
   - Verify required fields are identified and no budget is persisted.
2. Try zero, negative, non-numeric, and unsupported large limits where accepted by the control.
   - Verify invalid values are rejected and no invalid record is persisted.

#### 1.8. Create a valid budget
**File:** `tests/Budgets-testCases/create-budget.spec.ts`
**Status:** Not generated; requires explicit authorization to create and clean up test data.

**Steps:**
1. Create a budget with a valid category, positive limit, month, and year.
   - Verify successful creation and accurate values in the list after reload.

#### 1.9. Duplicate submission is prevented
**File:** `tests/Budgets-testCases/prevent-duplicate-budget-submission.spec.ts`
**Status:** Not generated; requires a disposable account and a valid budget submission.

**Steps:**
1. Submit the same valid budget twice rapidly.
   - Verify only one matching record is persisted.

#### 1.10. Existing budgets can be edited and deleted safely
**File:** `tests/Budgets-testCases/edit-delete-budget.spec.ts`
**Status:** Not generated; the explored account has no budgets to edit or delete.

**Steps:**
1. Create an isolated budget, edit its limit or category, and reload.
   - Verify the same record is updated.
2. Cancel a deletion confirmation, then confirm deletion in a separate action.
   - Verify cancellation retains the record and confirmation removes only the test record.

#### 1.11. Budget spend and progress reflect expenses
**File:** `tests/Budgets-testCases/budget-spend-progress.spec.ts`
**Status:** Not generated; requires budget and expense data. No spend/progress controls were visible in the empty state.

**Steps:**
1. Create a budget and a categorized expense below its limit.
   - Verify displayed spend and progress reflect the expense once.
2. Bring spending to and above the limit.
   - Verify totals and over-limit state remain correct after reload.
