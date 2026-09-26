# Categories Page Test Plan

## Application Overview

Test plan for /categories. Anonymous access redirects to /signin. Authenticated category controls were not inspectable, so management scenarios are conditional on actual UI capabilities and need a dedicated staging account. Existing project tests confirm categories are selectable from the expense form.

## Test Scenarios

### 1. Categories page test cases

**Seed:** `seed.spec.ts`

#### 1.1. Anonymous route protection

**File:** `tests/categories/access.spec.ts`

**Steps:**
  1. Navigate directly to /categories in a fresh browser context without a session.
    - expect: Redirect to /signin and do not expose category data.

#### 1.2. Authenticated list and empty state

**File:** `tests/categories/list.spec.ts`

**Steps:**
  1. Sign in with a dedicated staging account and inspect Categories with no categories and with seeded categories.
    - expect: The page loads successfully; empty and populated states accurately reflect the account's data.
    - expect: Record actual list fields and controls before fixing selectors.

#### 1.3. Category create, validation, edit, and delete (conditional)

**File:** `tests/categories/management.spec.ts`

**Steps:**
  1. If category creation exists, create a unique category and verify it persists after reload and is available in the expense form selector if applicable.
    - expect: One category is created and its availability matches product behavior.
  2. Test blank, whitespace-only, duplicate, over-limit, and special-character category names for fields the page actually provides.
    - expect: Invalid values are rejected and valid text is safely displayed.
  3. If edit/delete exist, edit a test category, cancel a deletion, then confirm deletion; include a category referenced by an expense if supported.
    - expect: Only the targeted category changes; cancellation preserves it; deletion and reference handling follow documented rules.
