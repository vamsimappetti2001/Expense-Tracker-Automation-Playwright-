# Expense Tracker Website Test Plan

## Application Overview

Test plan for the Expense Tracker website dashboard. Anonymous /dashboard currently redirects to /signin. Public sign-in and sign-up forms were inspected; existing project tests document authenticated Expenses and add/delete expense controls. Dashboard-only assertions require an authorized staging test account and confirmation of actual widgets. Use test-only accounts/data and environment secrets; never hardcode credentials.

## Test Scenarios

### 1. Authentication and public routes

**Seed:** `seed.spec.ts`

#### 1.1. Unauthenticated dashboard is protected

**File:** `tests/auth/unauthenticated-dashboard.spec.ts`

**Steps:**
  1. Open a fresh browser context and navigate directly to /dashboard.
    - expect: Redirect to /signin.
    - expect: Sign-in form is visible and protected dashboard data is absent.
  2. Reload and use browser history after redirect.
    - expect: Private dashboard data remains inaccessible.

#### 1.2. Sign-in form required fields

**File:** `tests/auth/signin-validation.spec.ts`

**Steps:**
  1. Open /signin and inspect form controls.
    - expect: Email, Password, Remember me, Sign In, and Sign up controls are visible and labeled.
  2. Submit with empty fields and with only one credential entered.
    - expect: Submission remains unauthenticated on /signin and required-field validation is enforced.

#### 1.3. Invalid sign-in credentials

**File:** `tests/auth/signin-invalid-credentials.spec.ts`

**Steps:**
  1. Submit malformed email and then a reserved test email with an incorrect dummy password.
    - expect: Validation or generic login failure is visible, no session is created, and no private content is shown.

#### 1.4. Sign in with valid test credentials

**File:** `tests/auth/signin-success.spec.ts`

**Steps:**
  1. Set EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD from local/CI secrets, fill the form, and submit.
    - expect: The app leaves /signin after successful authentication and authenticated Expenses navigation is visible.
    - expect: Credentials are not hardcoded or logged.

#### 1.5. Sign-up form validation

**File:** `tests/auth/signup-validation.spec.ts`

**Steps:**
  1. Open Sign up and inspect the fields and displayed password policy.
    - expect: Email, Username, Password, Confirm Password, optional Monthly Income, Create Account, and Sign in controls are available.
  2. Submit the empty form, malformed email, mismatched confirmation, and a weak password with reserved example.invalid data.
    - expect: Invalid submissions remain on /signup and do not create accounts.
    - expect: Password mismatch receives clear feedback.

### 2. Authenticated dashboard and expenses

**Seed:** `seed.spec.ts`

#### 2.1. Dashboard loads and shows accurate summaries

**File:** `tests/dashboard/dashboard-load-summary.spec.ts`

**Steps:**
  1. Sign in using seeded staging data and open /dashboard.
    - expect: Dashboard reaches a stable loaded state without errors; assert only widgets confirmed in authenticated UI.
  2. Compare dashboard totals against known seeded transactions and exercise available date filters.
    - expect: Totals, date ranges, currency precision, and empty states match approved requirements.

#### 2.2. Expenses list and create expense

**File:** `tests/expenses/expense-create.spec.ts`

**Steps:**
  1. Open Expenses, inspect list and Add Expense form, then add a unique valid amount, description, and available category.
    - expect: Exactly one matching expense appears with submitted values and expected date.
  2. Reload and revisit dashboard.
    - expect: Created record persists once and dependent summaries update correctly.

#### 2.3. Expense validation and cancel behavior

**File:** `tests/expenses/expense-validation.spec.ts`

**Steps:**
  1. Submit the expense form empty and test zero, negative, decimal precision, invalid amount, whitespace description, and no category.
    - expect: Invalid values are rejected according to documented field rules and no unwanted record is created.
  2. Enter data then cancel/close the form.
    - expect: No record is created and unsaved changes follow documented behavior.

#### 2.4. Delete confirmation and record integrity

**File:** `tests/expenses/expense-delete.spec.ts`

**Steps:**
  1. Create a unique test row, click its Delete action, and cancel the confirmation.
    - expect: The row remains unchanged.
  2. Repeat and confirm deletion.
    - expect: Only that row is removed once; other rows and totals remain correct.

### 3. Reliability, accessibility, and manual review

**Seed:** `seed.spec.ts`

#### 3.1. Responsive and accessibility checks

**File:** `tests/accessibility/responsive-a11y.spec.ts`

**Steps:**
  1. Check sign-in, sign-up, dashboard, and expense form at supported viewport sizes and run automated accessibility scans.
    - expect: No critical accessibility issues, clipped controls, or horizontal overflow; keyboard focus is visible and usable.

#### 3.2. Network failure and browser smoke

**File:** `tests/reliability/browser-smoke.spec.ts`

**Steps:**
  1. Simulate failed/slow requests for sign-in, list loading, and expense mutations, then run supported browser smoke coverage.
    - expect: Errors are recoverable; failed writes are not reported as successful; retries do not duplicate data.

#### 3.3. Manual exploratory and financial UX review

**File:** `specs/manual/dashboard-review.md`

**Steps:**
  1. Using a test account, explore actual dashboard widgets, charts, copy, financial calculations, screen-reader usage, and real-device touch behavior.
    - expect: Document confusing workflows, calculation ambiguity, accessibility gaps, visual defects, and device issues with reproducible steps.
