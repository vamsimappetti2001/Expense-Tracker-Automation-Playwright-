# Expenses Page Test Plan

## Application Overview

Test plan for https://nest-js-expense-tracker.vercel.app/expenses. Anonymous access redirects to /signin. Existing project tests confirm authenticated Expenses navigation and an Add Expense workflow with Amount, Description, category selection, Create, and Delete. The authenticated page could not be inspected here; confirm actual list columns and optional controls with a dedicated staging account. Use isolated test data and environment secrets; never hardcode credentials.

## Test Scenarios

### 1. Expenses page workflows

**Seed:** `seed.spec.ts`

#### 1.1. Unauthenticated access is protected

**File:** `tests/expenses/access.spec.ts`

**Steps:**
  1. Navigate to /expenses in a fresh browser context without a session, reload, and use browser Back.
    - expect: The app redirects to /signin.
    - expect: Expense rows and private financial data remain unavailable.

#### 1.2. Authenticated expenses list states

**File:** `tests/expenses/list.spec.ts`

**Steps:**
  1. With a dedicated account, open Expenses when the account has no records, then with several seeded records.
    - expect: The empty state is accurate; seeded rows appear once with the available fields and correct values.
  2. If search, filters, sorting, or pagination exist, exercise each and clear it.
    - expect: Visible rows match the selected controls and return to the default list when cleared.

#### 1.3. Create a valid expense and verify persistence

**File:** `tests/expenses/create.spec.ts`

**Steps:**
  1. Open Add Expense and inspect Amount, Description, category controls, defaults, and labels.
    - expect: The known amount, description, and category controls are available and accessible.
  2. Create one uniquely described expense with a valid positive amount and available category.
    - expect: Exactly one record appears with the submitted values and success feedback.
  3. Reload Expenses and navigate away and back.
    - expect: The created record remains exactly once with correct values.

#### 1.4. Expense form required and boundary validation

**File:** `tests/expenses/validation.spec.ts`

**Steps:**
  1. Submit the form empty and omit each required field individually.
    - expect: Required fields are validated and invalid submissions do not add a record.
  2. Test zero, negative, positive decimal, excess decimal precision, nonnumeric, and over-limit amounts; test whitespace and long descriptions.
    - expect: Accepted values follow documented limits and currency precision; rejected values show clear feedback without changing the list.

#### 1.5. Category choice and form cancellation

**File:** `tests/expenses/category-cancel.spec.ts`

**Steps:**
  1. Open the category selector and choose each category confirmed in the authenticated UI using mouse and keyboard.
    - expect: The chosen category is saved accurately and options are accessible.
  2. Enter expense details and cancel or close the form.
    - expect: No expense is created; unsaved-change behavior follows product requirements.

#### 1.6. Delete expense confirmation

**File:** `tests/expenses/delete.spec.ts`

**Steps:**
  1. Create a uniquely identifiable test expense and activate its Delete action.
    - expect: A confirmation identifies the destructive action and selected record.
  2. Cancel deletion, then reopen and confirm deletion.
    - expect: Cancel preserves the expense; confirmation removes only that record once.

#### 1.7. Expense request failures and duplicate submission

**File:** `tests/expenses/reliability.spec.ts`

**Steps:**
  1. In controlled staging, simulate delayed or failed list/create/delete requests and retry.
    - expect: Loading/errors are clear; failed changes are not reported as successful and retries do not duplicate records.
  2. Submit a valid record and activate Create repeatedly while the request is pending.
    - expect: Only one record is created.

#### 1.8. Manual page discovery and accessibility review

**File:** `specs/manual/expenses-review.md`

**Steps:**
  1. With a dedicated account, inventory actual list columns, filters, sorting, pagination, edit actions, dates, and empty/loading/error states; inspect mobile layout and use keyboard/screen reader on form and delete dialog.
    - expect: Unconfirmed controls are documented before adding assertions; visual, touch, and assistive-technology issues are recorded with reproducible steps.
