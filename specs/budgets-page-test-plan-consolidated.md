# Budgets Page Test Plan (Consolidated)

## Application Overview

Target: https://nest-js-expense-tracker.vercel.app/budgets. Anonymous visits redirect to /signin. The authenticated test account currently has 0 active budgets. The live page shows the current month/year, a No budgets yet empty state, and Add Budget. The navigation includes Dashboard, Expenses, Categories, Budgets, and Profile; the account menu exposes Settings, Help & Support, and Sign Out.

Add Budget opens New Budget with Category, Budget Limit (₹ spinbutton), Month, Year, Cancel, Create, and an unlabeled header close button. Category exposes 12 options. Month exposes January through December. Year exposes 2026 through 2030. Blank Create leaves the form open, focuses Budget Limit, and shows no visible validation message. Cancel and the header close return to the unchanged empty state. Keyboard exploration found that Space opens Category, but ArrowDown followed by Enter closes the list without selecting a value; the control remains at Select a category. The keyboard spec below deliberately asserts expected selection and currently exposes this accessibility defect.

Authenticated tests use EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD. The Playwright config loads `.env`. Never hard-code credentials in tests. Mutating tests require a disposable account and a verified cleanup path. No budget data was changed during exploration.

## Existing Spec Review

- `tests/Budgets-testCases/budget-category-selection.spec.ts`: verifies all 12 categories can be selected.
- `tests/Budgets-testCases/budget-period-selection.spec.ts`: verifies all 12 months and years 2026-2030.
- `tests/Budgets-testCases/budget-form-controls-and-dismissal.spec.ts`: verifies form controls plus Cancel and header-close behavior.
- `budget-form-options-and-cancel.spec.ts` was removed after review because its partial selector and dismissal coverage duplicated the retained tests above; no unique scenario was lost.

## Test Scenarios

### 1. Access, navigation, and list states

**Seed:** `seed.spec.ts`

#### 1.1. Unauthenticated access to Budgets is protected
**File:** `tests/Budgets-testCases/unauthenticated-budget-access.spec.ts`
**Status:** Generated.

1. Navigate directly to /budgets in a fresh unauthenticated context.
   - Verify redirect to /signin; Sign In is visible and budget content is absent.
2. Refresh.
   - Verify the visitor remains on /signin.

#### 1.2. Authenticated user sees the current Budgets state
**File:** `tests/Budgets-testCases/authenticated-budget-page.spec.ts`
**Status:** Generated.

1. Sign in and wait for /dashboard, then open Budgets and wait for /budgets.
   - Verify the Budgets heading, month/year summary, zero count, empty state, explanation, and Add Budget button.
2. Reload.
   - Verify the empty state and zero count persist for the authenticated account.

#### 1.3. Budgets navigation and account menu work
**File:** `tests/Budgets-testCases/budgets-navigation-and-account-menu.spec.ts`
**Status:** Generated.

1. Verify Dashboard, Expenses, Categories, Budgets, and Profile links; navigate to Budgets.
2. Open and close the account menu.
   - Verify Settings, Help & Support, and Sign Out are shown while open.
   - Verify closing leaves the user on /budgets; do not click Sign Out.

#### 1.4. Populated budget list and persistence
**File:** `tests/Budgets-testCases/budget-list-states.spec.ts`
**Status:** Not generated; requires creating a budget and a safe cleanup path.

1. In a disposable account, create a budget and reload.
   - Verify it appears once with the saved category, amount, month, and year.
2. Remove only the test record through a verified supported flow.

### 2. Form controls and selectors

**Seed:** `seed.spec.ts`

#### 2.1. New Budget controls and safe dismissal
**File:** `tests/Budgets-testCases/budget-form-controls-and-dismissal.spec.ts`
**Status:** Generated.

1. Open Add Budget.
   - Verify New Budget, Category, Budget Limit, Month, Year, Cancel, Create, and header close control.
2. Dismiss with Cancel, then reopen and dismiss with the header close control.
   - Verify each closes the modal and preserves zero active budgets.
   - The header close is unlabeled in the live UI; track this accessibility issue.

#### 2.2. All budget categories can be selected
**File:** `tests/Budgets-testCases/budget-category-selection.spec.ts`
**Status:** Existing spec reviewed; all 12 choices were live-verified.

1. Select Bills & Utilities, Education, Entertainment, Food & Dining, Healthcare, Insurance, Other, Personal Care, Savings, Shopping, Transportation, and Travel.
   - Verify each becomes the selected Category value.
2. Cancel and verify no budget was created.

#### 2.3. All months and years can be selected
**File:** `tests/Budgets-testCases/budget-period-selection.spec.ts`
**Status:** Existing spec reviewed; all 12 months and five years were live-verified.

1. Select January through December.
   - Verify the Month control displays each selected value.
2. Select 2026 through 2030.
   - Verify the Year control displays each selected value.
3. Cancel without submitting.

#### 2.4. Dropdown keyboard selection and dismissal
**File:** `tests/Budgets-testCases/budget-dropdown-keyboard.spec.ts`
**Status:** Generated. Expected to expose a live keyboard-selection defect.

1. Open Category with Space, move with ArrowDown, and press Enter.
   - Expected: the focused option becomes the selected category.
   - Observed: list closes and the selector remains unset; track as an accessibility defect.
2. Open Month and Year with keyboard and press Escape.
   - Verify menus close without changing their current values.
3. Cancel and verify the empty state remains.

### 3. Validation and data lifecycle

**Seed:** `seed.spec.ts`

#### 3.1. Blank budget submission does not create a budget
**File:** `tests/Budgets-testCases/budget-form-validation.spec.ts`
**Status:** Generated for the live-observed blank-submit behavior. Boundary-value coverage remains pending documented product constraints.

1. Click Create with Category and Budget Limit empty.
   - Verify the form stays open, Budget Limit receives focus, and the empty-state count remains zero.
   - Live UI shows no visible validation message; confirm required feedback expectations with product.
2. Cancel and verify no budget was created.

#### 3.2. A valid budget can be created and persists
**File:** `tests/Budgets-testCases/create-budget.spec.ts`
**Status:** Not generated; requires a disposable account and verified cleanup.

1. Create a uniquely identifiable budget with valid category, positive amount, month, and year.
   - Verify displayed values and persistence after reload.
2. Clean up only the test record.

#### 3.3. Repeated submission does not create duplicates
**File:** `tests/Budgets-testCases/prevent-duplicate-budget-submission.spec.ts`
**Status:** Not generated; requires disposable test data.

1. Submit the same valid budget rapidly while the first request is pending.
   - Verify only one matching budget is persisted.

#### 3.4. Existing budgets can be edited and deleted safely
**File:** `tests/Budgets-testCases/edit-delete-budget.spec.ts`
**Status:** Not generated; no populated budget row or safe cleanup flow was available to inspect.

1. In a disposable account, inspect a populated row for edit/delete controls; do not assume controls from the empty state.
2. If supported, verify edit persistence, delete cancellation, and confirmed removal of only the test budget.

#### 3.5. Budget spend/progress reflects categorized expenses
**File:** `tests/Budgets-testCases/budget-spend-progress.spec.ts`
**Status:** Not generated; requires budget and expense data.

1. Add categorized expenses below, at, and above an isolated budget limit.
   - Verify displayed totals/status and confirm reload does not double-count.
