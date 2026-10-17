# Authenticated Dashboard Page Test Plan

## Application Overview

Test the entire authenticated ExpenseTracker dashboard using live-discovered UI details. The inspected account was "vandy" and had a fresh/empty data state: ₹0.00 total spent, ₹0.00 budget, 0 expenses, and ₹0.00 average expense. The page also showed budget utilization, a six-month spending trend (May–October 2026), category breakdown, and top expenses. An authenticated browser session must be established by the test setup; do not embed or depend on credentials in test code. Verify only the observed empty-state expectations unless a test explicitly seeds data.

## Test Scenarios

### 1. Authenticated dashboard overview

**Seed:** `seed.spec.ts`

#### 1.1. Dashboard displays all overview metrics and panels for a fresh account

**File:** `tests/DashBoard-TestCases/dashboard-empty-state-overview.spec.ts`

**Steps:**
  1. Start in a fresh, authenticated browser context for an account with no expenses or budgets, then open the Dashboard using the navigation link or navigate to /dashboard.
    - expect: The page URL is /dashboard and the Dashboard navigation link is present.
    - expect: The main dashboard content is visible without a sign-in redirect.
  2. Inspect the four summary metrics by their visible labels: Total Spent, Total Budget, Expense Count, and Avg. Expense.
    - expect: Total Spent is ₹0.00.
    - expect: Total Budget is ₹0.00.
    - expect: Expense Count is 0.
    - expect: Avg. Expense is ₹0.00.
    - expect: All four labels and values are visible together.
  3. Scroll through the complete page and inspect Budget Utilization, Spending Trends (6 months), Category Breakdown, and Top Expenses.
    - expect: All four dashboard sections are visible on the page, including below-the-fold content.
    - expect: The page has no unexpected error or sign-in state.

#### 1.2. Budget utilization is zero when spending and budget are empty

**File:** `tests/DashBoard-TestCases/dashboard-zero-budget-utilization.spec.ts`

**Steps:**
  1. Start with a fresh authenticated account with no expenses and no budgets, then open /dashboard.
    - expect: The Budget Utilization section is visible.
  2. Read the displayed spent amount, utilization percentage, and budget amount in the Budget Utilization section.
    - expect: The section displays Spent: ₹0.00.
    - expect: The utilization is 0.0%.
    - expect: The budget amount is ₹0.00.
    - expect: The section does not show a nonzero utilization or amount for the empty account.

#### 1.3. Spending trend chart displays the six observed month labels

**File:** `tests/DashBoard-TestCases/dashboard-spending-trend-range.spec.ts`

**Steps:**
  1. Start with a fresh authenticated account, open /dashboard, and scroll the Spending Trends (6 months) chart into view.
    - expect: The chart panel is visible and titled Spending Trends (6 months).
  2. Inspect the month labels and currency scale shown on the chart.
    - expect: The month labels shown are May 2026, Jun 2026, Jul 2026, Aug 2026, Sep 2026, and Oct 2026.
    - expect: The chart's visible currency scale is labeled in rupees.
    - expect: The chart is rendered without a page error.

#### 1.4. Empty account renders category breakdown and top expenses panels

**File:** `tests/DashBoard-TestCases/dashboard-empty-category-and-top-expenses.spec.ts`

**Steps:**
  1. Start with a fresh authenticated account that has no expenses, then open /dashboard and scroll to the chart and Top Expenses area.
    - expect: The Category Breakdown panel is visible.
    - expect: The Top Expenses panel is visible.
  2. Inspect the Category Breakdown and Top Expenses panels for expense/category entries.
    - expect: No expense or category entries are shown for the empty account.
    - expect: The empty data state does not show fabricated nonzero expense amounts or categories.
    - expect: Both panels remain present and the page remains usable.

#### 1.5. Dashboard account menu exposes settings and routes to profile

**File:** `tests/DashBoard-TestCases/dashboard-account-menu-settings.spec.ts`

**Steps:**
  1. Start with a fresh authenticated session on /dashboard and activate the account button labeled with the signed-in user's initials and username (observed as "V vandy").
    - expect: The account menu opens.
    - expect: The menu exposes Settings, Help & Support, and Sign Out options.
  2. Select Settings from the account menu.
    - expect: The browser navigates to /profile.
    - expect: The profile page is shown while the authenticated session remains active.
