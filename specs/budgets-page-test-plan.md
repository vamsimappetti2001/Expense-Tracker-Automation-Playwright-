# Budgets Page Test Plan

## Application Overview

Tests for the protected Expense Tracker budgets page. Anonymous access redirects to sign-in; authenticated inspection showed an empty state and a New Budget form with category, amount, month, and year controls.

## Test Scenarios

### 1. Budgets page

**Seed:** `seed.spec.ts`

#### 1.1. Budgets route and form

**File:** `tests/budgets/budgets.spec.ts`

**Steps:**
  1. Open /budgets without a session, then sign in to a dedicated test account and open Add Budget.
    - expect: Anonymous user is redirected to /signin.
    - expect: Authenticated page shows budget state and the form provides Category, Budget Limit, Month, Year, Cancel, and Create.
  2. Cancel the form, then with isolated test data validate required fields and create a valid budget.
    - expect: Cancel creates no data; invalid values are rejected; valid budget appears once with the selected values.
