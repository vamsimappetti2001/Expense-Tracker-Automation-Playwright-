# Categories Page Test Plan

## Application Overview

Target: https://nest-js-expense-tracker.vercel.app/categories. Anonymous access redirects to /signin. The authenticated test account shows 12 default categories and 0 custom categories. Add Category opens a form with a Category Name textbox, 22 icon buttons, Cancel, Create, and an unlabeled header close button. Live exploration confirmed each default card remains on /categories, all icon buttons can be clicked, blank Create leaves the form open with Category Name focused, and Cancel/header close do not change the category count. No accessible validation message appeared for a blank submission.

Authenticated specs use EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD. The Playwright config loads a local .env file. Tests do not contain credentials. Do not run data-mutating scenarios against shared or production data; use a dedicated disposable account and verified cleanup before enabling those scenarios.

## Test Scenarios

### 1. Categories page

**Seed:** `seed.spec.ts`

#### 1.1. Unauthenticated users are redirected away from Categories
**File:** `tests/Categories-TestCases/categories-auth-guard.spec.ts`
**Status:** Generated.

**Steps:**
1. In a fresh unauthenticated context, navigate directly to /categories.
   - Verify redirect to /signin and verify the Categories heading is absent.
2. Refresh.
   - Verify the visitor remains on /signin.

#### 1.2. Authenticated Categories page displays the complete default list
**File:** `tests/Categories-TestCases/default-categories-list.spec.ts`
**Status:** Generated.

**Steps:**
1. Sign in and wait for /dashboard, then open Categories from the navigation.
2. Verify the page URL and heading, the `12 categories (12 default, 0 custom)` count, the Default Categories heading, all 12 names, and 12 Default labels.

#### 1.3. Default category cards remain on the Categories page when clicked
**File:** `tests/Categories-TestCases/default-category-card-interaction.spec.ts`
**Status:** Generated; all 12 cards were clicked live.

**Steps:**
1. Click each default category label/card once.
   - Verify the URL and count remain unchanged and no detail/edit form appears.

#### 1.4. Account menu exposes its navigation actions
**File:** `tests/Categories-TestCases/account-menu.spec.ts`
**Status:** Generated.

**Steps:**
1. Open the account menu.
   - Verify Settings, Help & Support, and Sign Out are visible.
2. Close the menu by clicking the account button again.
   - Verify it closes without navigating or signing out.

#### 1.5. Add Category form exposes all controls and icons
**File:** `tests/Categories-TestCases/add-category-form-controls.spec.ts`
**Status:** Generated.

**Steps:**
1. Open Add Category.
   - Verify New Category, Category Name with placeholder `e.g. Groceries`, Cancel, Create, and the header close control.
2. Verify all 22 observed icon buttons: 🍔, 🚗, 🛒, 🏠, 💡, 📚, 🎬, ❤️, ✈️, ✨, 💰, 🛡️, 🎁, 🎵, 📷, 🐾, ☕, 🎮, 🏋️, 💳, 🎯, 📦.

#### 1.6. Every icon can be clicked and the form can be canceled without saving
**File:** `tests/Categories-TestCases/category-icon-selection.spec.ts`
**Status:** Generated; all 22 icon buttons were clicked live.

**Steps:**
1. Click each icon in turn.
   - Verify the form stays open and the count remains unchanged.
2. Cancel.
   - Verify the form closes and the custom count remains zero.

#### 1.7. Header close control dismisses Add Category
**File:** `tests/Categories-TestCases/category-form-close.spec.ts`
**Status:** Generated.

**Steps:**
1. Open Add Category and click the unlabeled header close control.
   - Verify the modal closes and the default list/count remain visible.

#### 1.8. Blank category submission leaves form open and adds nothing
**File:** `tests/Categories-TestCases/category-required-field-validation.spec.ts`
**Status:** Generated for observed non-persistence and focus behavior. Live exploration showed no accessible validation message; confirm required feedback expectation with product before asserting specific error copy.

**Steps:**
1. Open Add Category and submit Create with an empty Category Name.
   - Verify the form remains open, Category Name remains focused, and the count stays at 12 defaults / 0 custom.

#### 1.9. Valid custom category can be created and persists
**File:** `tests/Categories-TestCases/create-custom-category.spec.ts`
**Status:** Not generated; requires an isolated account and confirmed cleanup path.

**Steps:**
1. Create a category with a unique name and selected icon.
   - Verify the modal closes, the entry appears with its icon, and the custom count persists after reload.

#### 1.10. Duplicate and invalid custom category names are rejected
**File:** `tests/Categories-TestCases/custom-category-validation.spec.ts`
**Status:** Not generated; requires custom-category data and product-approved name constraints.

**Steps:**
1. Try a default-name duplicate, custom-name duplicate, whitespace-only input, and documented length boundaries.
   - Verify accessible feedback and no duplicate/invalid record.

#### 1.11. Custom category edit and delete behavior
**File:** `tests/Categories-TestCases/custom-category-edit-delete.spec.ts`
**Status:** Not generated; no custom category exists in the inspected account, and no safe cleanup path was verified.

**Steps:**
1. In a disposable account, inspect a newly created custom entry for edit/delete actions.
2. If supported, verify edit persistence, delete cancellation, and confirmed deletion of only the test entry. Do not infer these actions from default cards.
