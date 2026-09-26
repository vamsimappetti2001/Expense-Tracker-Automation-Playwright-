# Expense Tracker Dashboard Automation and Manual Test Plan

## Application Overview

# Expense Tracker Dashboard Test Plan

Target: https://nest-js-expense-tracker.vercel.app/dashboard

## Observed entry state and scope
- Opening `/dashboard` without a session redirects to `/signin` (page title: `ExpenseTracker`). The protected dashboard was not inspectable without an authorized test account.
- The sign-in page exposes required Email and Password fields, a Remember me checkbox, a Sign In button, and a Sign up link. Empty submission stays on the sign-in page.
- The sign-up page exposes Email, Username, Password, Confirm Password, optional Monthly Income, Create Account, and a Sign in link. Its visible password guidance says at least 6 characters with uppercase, lowercase, and number/special character. Empty submission stays on the form.
- Existing project tests confirm an authenticated Expenses link and an Add Expense flow with Amount, Description, category selection (Shopping is an existing example), Create, and Delete actions. Confirm exact labels and app behavior against the current build when a test account is available.

## Test data and execution assumptions
- Use a dedicated staging/test environment and a dedicated seeded test account. Do not use real customer accounts or production financial data.
- Keep credentials in CI secrets/environment variables; never commit credentials or print them in logs. Existing local test material contains credential-like values, so rotate any exposed credentials and remove them from version control/history as appropriate.
- Reset or isolate test data per test. Use unique descriptions, deterministic fixtures, and cleanup in `finally`/API fixture teardown. Avoid tests that depend on another test's ordering.
- Tests that create accounts need a disposable email inbox or controlled test mail sink. Do not send registration messages to real users.
- Validate expected amounts, categories, summary calculations, and persistence against product requirements/API contracts; do not infer financial calculations from sample data.
- Every test starts in a fresh browser context unless it explicitly verifies session persistence. Use accessible roles/labels and web-first assertions rather than fixed sleeps.

## Automation versus manual testing
**Prioritize automation** for stable, deterministic workflows: sign-in/sign-out, route access control, form-required and format validation, create/read/delete expenses, category selection, confirmation/cancellation, persistence after reload, summary calculations with seeded data, API error handling, and Chromium/Firefox/WebKit smoke coverage. Run these in CI against a seeded staging environment; tag destructive or environment-dependent tests separately.

**Keep human-led manual testing** for exploratory use of an unfamiliar dashboard, visual polish and chart interpretation, keyboard/screen-reader usability, real-device touch behavior, confusing or ambiguous financial copy, unusual locale/currency expectations, and judging whether error messages are understandable. Automate accessibility scans and responsive viewport checks as useful guardrails, but do not treat them as replacements for assistive-technology review or device testing.

**Before expanding dashboard-specific automation**, sign in with the dedicated test account and inventory the actual dashboard widgets, navigation links, filters, date controls, profile actions, budget/report features, and empty/loading/error states. The plan below marks behavior not confirmed anonymously as requiring confirmation against the authenticated UI/product requirements.

## Test Scenarios

### 1. Authentication and Access Control (Automate)

**Seed:** `seed.spec.ts`

#### 1.1. Unauthenticated dashboard access redirects to sign-in

**File:** `tests/auth/unauthenticated-dashboard.spec.ts`

**Steps:**
  1. Start with a fresh browser context with no cookies or storage and navigate directly to `/dashboard`.
    - expect: The user is redirected to `/signin` or the documented sign-in route.
    - expect: No dashboard financial data is rendered before authentication.
  2. Reload the page and use browser Back/Forward around the redirect.
    - expect: Protected content remains inaccessible without a session.
    - expect: Navigation does not expose cached/private dashboard content.

#### 1.2. Sign-in screen controls and required-field validation

**File:** `tests/auth/signin-validation.spec.ts`

**Steps:**
  1. Open `/signin` in a fresh context and inspect the form.
    - expect: Email and Password controls, Remember me, Sign In, and Sign up are present and labeled.
    - expect: Email and Password are required.
  2. Submit the form with both fields empty, then with only Email and only Password populated.
    - expect: Submission is blocked or a clear validation message appears for each missing required value.
    - expect: The route remains on sign-in and no authenticated session is created.

#### 1.3. Sign-in rejects malformed email and invalid credentials

**File:** `tests/auth/signin-invalid.spec.ts`

**Steps:**
  1. Enter a malformed email and a non-empty password, then submit.
    - expect: The malformed email is rejected client-side or by the server with a useful validation message.
    - expect: No session is created.
  2. Enter a syntactically valid but unknown test email and incorrect password, then submit.
    - expect: A clear failure state is shown without exposing whether an account exists or leaking server details.
    - expect: The user stays unauthenticated and can correct the form.

#### 1.4. Successful sign-in reaches the protected app

**File:** `tests/auth/signin-success.spec.ts`

**Steps:**
  1. Load credentials for the dedicated test account from CI secrets and submit valid email/password.
    - expect: A successful sign-in reaches the documented post-login route (expected dashboard unless product requirements specify otherwise).
    - expect: A recognizable authenticated navigation state appears and no error remains.
  2. Navigate directly to `/dashboard` in the same context.
    - expect: The dashboard is available to the authenticated account.

#### 1.5. Remember me session behavior

**File:** `tests/auth/remember-me.spec.ts`

**Steps:**
  1. Sign in with Remember me unchecked, close/recreate the browser context, and revisit `/dashboard`.
    - expect: Session lifetime matches the documented unchecked behavior; expired/cleared sessions return to sign-in.
  2. Sign in with Remember me checked and recreate the browser context according to supported persistence behavior.
    - expect: Session persistence matches the documented checked behavior and does not exceed the intended security policy.

#### 1.6. Logout clears session and protects private routes

**File:** `tests/auth/logout.spec.ts`

**Steps:**
  1. Sign in and use the visible logout/sign-out control (confirm its location during authenticated discovery).
    - expect: The user returns to sign-in or the documented public route.
    - expect: Session cookies/tokens are cleared or invalidated.
  2. Use Back, reload, and navigate directly to `/dashboard` after logout.
    - expect: Protected content is not available from history/cache and the user is redirected to sign-in.

#### 1.7. Sign-up form navigation, controls, and required inputs

**File:** `tests/auth/signup-validation.spec.ts`

**Steps:**
  1. From sign-in, open Sign up and inspect the form.
    - expect: Email, Username, Password, Confirm Password, optional Monthly Income, and Create Account are present and labeled.
    - expect: Password requirement guidance is visible; Monthly Income is optional.
  2. Submit an empty form, then submit with each required field omitted in turn.
    - expect: Missing required fields are identified and submission is prevented.
    - expect: The form stays available with entered values handled consistently and no account is created.

#### 1.8. Sign-up email and username boundary validation

**File:** `tests/auth/signup-identifiers.spec.ts`

**Steps:**
  1. Try malformed email values (missing local part, missing domain, spaces, and overlong input) and a valid-format disposable test email.
    - expect: Malformed values are rejected with actionable feedback.
    - expect: A valid-format email proceeds to the next validation step without bypassing server-side checks.
  2. Try blank, whitespace-only, boundary-length, overlong, and already-registered usernames.
    - expect: Username normalization and limits match documented rules.
    - expect: Duplicate/reserved values are rejected clearly and safely.

#### 1.9. Sign-up password policy and confirmation

**File:** `tests/auth/signup-password.spec.ts`

**Steps:**
  1. Test passwords below 6 characters, exactly 6 characters, missing uppercase, missing lowercase, missing number/special character, and a compliant password.
    - expect: Password values that violate the visible policy are rejected.
    - expect: A compliant password is accepted by validation; requirements are consistent between UI and server.
  2. Enter mismatched confirmation, then matching confirmation; use the password visibility buttons if available.
    - expect: Mismatch is identified before account creation.
    - expect: Matching values proceed; visibility controls reveal/mask only the associated field and do not alter its value.

#### 1.10. Sign-up optional monthly income validation

**File:** `tests/auth/signup-income.spec.ts`

**Steps:**
  1. Submit otherwise valid registration details with Monthly Income blank.
    - expect: Blank optional income does not block registration.
  2. Test zero, a positive decimal, negative value, alphabetic text, very large value, and precision beyond supported currency scale.
    - expect: Accepted values match documented business rules and currency precision.
    - expect: Invalid or out-of-range values are rejected without creating malformed financial data.

#### 1.11. Sign-up success and duplicate account handling

**File:** `tests/auth/signup-success.spec.ts`

**Steps:**
  1. With a disposable test email and unique username, complete registration using a compliant password and matching confirmation.
    - expect: A single account is created and the user reaches the documented next step (dashboard or sign-in).
    - expect: No password or sensitive registration values are shown in the page or logs.
  2. Repeat registration with the same email and separately with the same username.
    - expect: Duplicate identity is rejected with a safe, clear message and no duplicate account is created.

### 2. Authenticated Dashboard (Automate after account access; confirm actual widgets)

**Seed:** `seed.spec.ts`

#### 2.1. Dashboard initial loading, headings, and stable ready state

**File:** `tests/dashboard/dashboard-load.spec.ts`

**Steps:**
  1. Sign in with the seeded account and open `/dashboard` directly.
    - expect: The dashboard reaches a stable ready state without an uncaught error or endless loading indicator.
    - expect: Page title and primary heading identify the expense tracker/dashboard.
    - expect: Only widgets actually present in the authenticated UI are asserted; inventory them before fixing selectors.
  2. Repeat with a deliberately slow response and a simulated failed dashboard request in a controlled test environment.
    - expect: Loading state is understandable and does not shift controls unpredictably.
    - expect: Failure state is recoverable and does not display stale data as current.

#### 2.2. Dashboard summary values match seeded transactions

**File:** `tests/dashboard/dashboard-summary.spec.ts`

**Steps:**
  1. Seed a known set of transactions and navigate to the dashboard.
    - expect: Displayed totals/counts match the documented calculation and seeded data for the selected period.
    - expect: Currency symbol, decimal precision, and negative/zero formatting follow requirements.
  2. Change period/date filters if the UI provides them, then restore the default period.
    - expect: Each displayed summary updates to the selected period and returns correctly to the default.
    - expect: Boundary dates, timezone, and month/year transitions are handled consistently.

#### 2.3. Dashboard navigation links and active state

**File:** `tests/dashboard/dashboard-navigation.spec.ts`

**Steps:**
  1. Record all authenticated navigation links during UI discovery; visit each link once and return to dashboard.
    - expect: Each link opens the correct route/view and the active navigation state matches the current route.
    - expect: No link leads to a 404, unauthorized screen, or unexpected external site.
  2. Use browser Back/Forward and refresh on the dashboard and each discovered view.
    - expect: Route and visible state remain coherent after history navigation and refresh.

#### 2.4. Dashboard empty state and populated state

**File:** `tests/dashboard/dashboard-empty-state.spec.ts`

**Steps:**
  1. Sign in using an account with no expenses and open the dashboard.
    - expect: Empty-state copy/actions are clear and no misleading nonzero totals appear.
  2. Seed one and multiple expenses, reload the dashboard, and compare the rendered state.
    - expect: Empty-state UI is replaced by correct populated summaries/charts/lists where those components exist.

#### 2.5. Profile/account controls and session expiry

**File:** `tests/dashboard/account-controls.spec.ts`

**Steps:**
  1. Inspect any avatar, profile, settings, or account menu exposed in the authenticated dashboard and activate each menu item.
    - expect: Menus open and close accessibly; each item reaches its documented view/action.
    - expect: Dismissal by Escape/outside click behaves consistently when applicable.
  2. Expire or invalidate the test session while a dashboard request is in flight.
    - expect: The app returns to sign-in without exposing private response data or trapping the user in a broken view.

### 3. Expense Management (Automate; CRUD confirmed by existing suite)

**Seed:** `seed.spec.ts`

#### 3.1. Expenses view navigation and list rendering

**File:** `tests/expenses/expenses-list.spec.ts`

**Steps:**
  1. Sign in, select Expenses, and wait for the list to finish loading.
    - expect: The Expenses view is selected and the list/table has an understandable heading and column labels.
    - expect: Seeded expense rows show the expected description, amount, category, and date fields that the product supports.
  2. Open the view with no expenses and with a large seeded list.
    - expect: Empty state is shown when appropriate; populated list remains usable without overlapping or losing rows.

#### 3.2. Create expense with valid values

**File:** `tests/expenses/expense-create.spec.ts`

**Steps:**
  1. Open Add Expense and inspect all visible fields, defaults, required markers, and available category choices.
    - expect: The amount, description, category controls confirmed in the current app are present and associated with labels.
    - expect: Category options are selectable; test data does not rely on option ordering.
  2. Create a uniquely described expense with a valid positive amount and a valid category such as Shopping if still available.
    - expect: Exactly one new expense appears with the submitted amount, description, category, and expected date.
    - expect: Success feedback is shown once and the form closes/resets according to product behavior.
  3. Reload the list and revisit the dashboard.
    - expect: The new expense persists and any dependent summary reflects the expected updated value.

#### 3.3. Expense creation required-field validation

**File:** `tests/expenses/expense-required-fields.spec.ts`

**Steps:**
  1. Open Add Expense and submit with all fields blank, then omit each required field individually.
    - expect: Invalid submission is blocked and each required field is identified.
    - expect: No expense is created and the list remains unchanged.
  2. Enter whitespace-only description and leave category unselected, then submit.
    - expect: Whitespace is not silently accepted as meaningful description; missing category is rejected if required by the product.

#### 3.4. Expense amount boundaries and numeric formatting

**File:** `tests/expenses/expense-amount-boundaries.spec.ts`

**Steps:**
  1. Try zero, negative, a small positive decimal, the smallest supported currency unit, excessive decimal places, alphabetic input, and a value above the documented maximum.
    - expect: Only values allowed by product rules are accepted; invalid amounts show field-level feedback.
    - expect: Accepted values are stored and displayed with stable currency rounding and no precision drift.
  2. Create an amount at the configured maximum and inspect the list and dashboard total.
    - expect: Maximum accepted value renders without overflow and totals use the correct arithmetic.

#### 3.5. Expense description limits and special characters

**File:** `tests/expenses/expense-description.spec.ts`

**Steps:**
  1. Create descriptions with leading/trailing whitespace, punctuation, Unicode text, a long string at the supported limit, and one character beyond the limit.
    - expect: Text is trimmed/normalized per requirements; supported characters render safely.
    - expect: Over-limit input is prevented or reported clearly and does not break the list layout.
  2. Try HTML/script-like text as a description in an isolated test environment.
    - expect: Input is rendered as text and never executes markup or script.

#### 3.6. Expense category selection and category edge cases

**File:** `tests/expenses/expense-category.spec.ts`

**Steps:**
  1. Open the category selector, inspect all choices, navigate by keyboard, and choose each supported category across independent test data.
    - expect: Options are readable, selectable, and saved correctly on the created row.
    - expect: The selected category remains selected until changed or the form is reset.
  2. Test the default/no-selection state and any category added, removed, or unavailable through supported product operations.
    - expect: Required/optional category behavior matches requirements; stale category references fail safely.

#### 3.7. Expense create cancellation and duplicate-submit protection

**File:** `tests/expenses/expense-create-cancel.spec.ts`

**Steps:**
  1. Open Add Expense, enter values, and cancel/close the form.
    - expect: No expense is created; unsaved changes are discarded or a discard prompt appears according to product behavior.
  2. Submit a valid expense and rapidly activate Create twice while the request is pending.
    - expect: The UI prevents accidental duplicate creation or deduplicates the request; exactly one record exists.

#### 3.8. Delete expense confirmation and cancellation

**File:** `tests/expenses/expense-delete.spec.ts`

**Steps:**
  1. Create a uniquely identifiable test expense, activate its Delete action, and inspect the confirmation prompt.
    - expect: The prompt identifies the destructive action and targets the correct row.
    - expect: Cancel/close leaves the expense unchanged.
  2. Confirm deletion and inspect the list and dashboard.
    - expect: The selected expense is removed once, success feedback is clear, and dependent totals update.
    - expect: Other expense rows remain unchanged.

#### 3.9. Expense list persistence, ordering, and concurrent updates

**File:** `tests/expenses/expense-persistence.spec.ts`

**Steps:**
  1. Create an expense, navigate away, return, and reload the page.
    - expect: The record persists exactly once and appears in the documented sort order.
  2. Update/delete the same seeded record from a second session if concurrent use is supported.
    - expect: The UI reconciles stale data and reports conflicts without silently overwriting unrelated records.

### 4. Budgets, Reports, and Other Dashboard Features (Confirm availability before automating)

**Seed:** `seed.spec.ts`

#### 4.1. Inventory dashboard features against requirements

**File:** `tests/dashboard/dashboard-feature-inventory.spec.ts`

**Steps:**
  1. With an authorized test account, document every widget, navigation destination, action, filter, and empty/loading/error state visible on the current release.
    - expect: The inventory is reviewed with the product owner and mapped to requirements before assertions are added.
    - expect: Do not assume budgets, charts, reports, editing, or export controls exist merely from marketing copy.

#### 4.2. Budget creation and boundary behavior (conditional)

**File:** `tests/dashboard/budget.spec.ts`

**Steps:**
  1. If budget management is present, create a budget with valid period/category/amount values and verify it appears.
    - expect: Budget fields, period boundaries, category scope, and calculations match approved requirements.
  2. Try zero, negative, excessive precision, and over-limit budget amounts; edit and delete a test budget if supported.
    - expect: Invalid values are rejected; edits/deletions affect only the selected budget and summaries update correctly.

#### 4.3. Reports and date/filter behavior (conditional)

**File:** `tests/dashboard/reports.spec.ts`

**Steps:**
  1. If reports/charts/filters exist, seed known transactions across category and date boundaries and exercise every filter and range.
    - expect: Displayed records and totals match the seeded dataset and documented inclusion rules.
    - expect: No-data, single-data-point, and large-data states remain legible.
  2. Export a report if supported and validate file type, filename, contents, date range, and sensitive-data handling.
    - expect: Export contains only the selected account's authorized data and matches on-screen totals.

### 5. Security, Reliability, Compatibility, and Accessibility (Automate guardrails)

**Seed:** `seed.spec.ts`

#### 5.1. Account data isolation between users

**File:** `tests/security/account-isolation.spec.ts`

**Steps:**
  1. Create or seed two isolated test accounts with distinct expenses and sign in as each account in separate contexts.
    - expect: Each account sees only its own data on dashboard, expenses, and any reports.
  2. Attempt to access another account's resource by changing a test record identifier in a controlled staging test.
    - expect: The server denies access and does not disclose record contents.

#### 5.2. Network/API failure and retry handling

**File:** `tests/reliability/dashboard-failures.spec.ts`

**Steps:**
  1. Simulate offline state, a timed-out request, and server errors for dashboard and expense list/create/delete requests.
    - expect: The UI shows actionable error/retry feedback and does not falsely report a failed mutation as successful.
    - expect: Retry does not create duplicates or lose user-entered values unexpectedly.

#### 5.3. Browser compatibility smoke suite

**File:** `tests/compatibility/auth-expense-smoke.spec.ts`

**Steps:**
  1. Run a short sign-in, dashboard load, create expense, and delete expense smoke flow in Chromium, Firefox, and WebKit where supported.
    - expect: Core controls, navigation, validation, and CRUD behavior pass in supported engines.

#### 5.4. Responsive layout and viewport guardrails

**File:** `tests/accessibility/responsive-layout.spec.ts`

**Steps:**
  1. Capture authenticated dashboard, sign-in, and expense form at supported narrow mobile, tablet, and desktop viewport sizes.
    - expect: No horizontal overflow, clipped controls, overlapping labels, or inaccessible off-screen actions occur.
    - expect: Primary workflows remain possible at all supported widths.

#### 5.5. Automated accessibility checks

**File:** `tests/accessibility/automated-a11y.spec.ts`

**Steps:**
  1. Run an accessibility scan on sign-in, sign-up, dashboard, and expense form states; inspect labels, headings, contrast, and keyboard focus order.
    - expect: No critical/serious automated accessibility violations remain; every form control has an accessible name and errors are announced.
  2. Operate navigation, dialogs, category selection, and forms using keyboard only.
    - expect: Focus is visible and logical; controls are operable; dialogs manage and restore focus correctly.

### 6. Manual and Exploratory Testing (Human-led; complement automation)

**Seed:** `seed.spec.ts`

#### 6.1. Manual exploratory dashboard tour

**File:** `specs/manual/dashboard-exploration.md`

**Steps:**
  1. Using a test account, explore dashboard widgets and navigation without a prescribed path; try common and unexpected interaction sequences.
    - expect: Record confusing labels, dead ends, inconsistent values, unexpected state changes, and missing feedback with steps and screenshots.

#### 6.2. Manual financial UX and calculation review

**File:** `specs/manual/financial-ux-review.md`

**Steps:**
  1. Review currency formatting, rounding, dates/timezones, monthly boundaries, negative/refund semantics, and explanations of summary calculations with product/finance stakeholders.
    - expect: Financial values are understandable and consistent with business rules; no assumption about rounding or date inclusion is left undocumented.

#### 6.3. Manual screen-reader and assistive-technology review

**File:** `specs/manual/screen-reader-review.md`

**Steps:**
  1. Use supported screen readers and keyboard-only navigation on sign-in, sign-up, dashboard, expense creation, and delete confirmation.
    - expect: Landmarks, labels, validation errors, chart descriptions, state changes, and destructive confirmations are announced and usable.

#### 6.4. Manual real-device touch and visual review

**File:** `specs/manual/device-visual-review.md`

**Steps:**
  1. Check real iOS/Android devices or representative devices for touch target size, virtual keyboard behavior, scrolling, zoom, portrait/landscape, and chart legibility.
    - expect: No critical workflow is blocked by touch, keyboard, orientation, or rendering differences; visual issues are documented by device/browser.

#### 6.5. Manual copy, localization, and privacy review

**File:** `specs/manual/content-privacy-review.md`

**Steps:**
  1. Review error wording, empty states, time/currency locale behavior, personal/financial data displayed in browser history or notifications, and logout on shared devices.
    - expect: Copy is clear, localized behavior is intentional, and sensitive information is not unnecessarily exposed.
