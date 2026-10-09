# Profile Page Test Plan

## Application Overview

Test the authenticated Expense Tracker Profile page at /profile, including account identity, editable profile settings, validation, save behavior, account-information display, header navigation, account-menu actions, and unauthenticated protection. Use EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD from the ignored project-root .env file. Tests should use a fresh browser context and avoid leaving profile settings changed; any test that saves a change must restore its starting values in a finally block.

## Test Scenarios

### 1. Profile page and account settings

**Seed:** `seed.spec.ts`

#### 1.1. Authenticated profile overview and account identity

**File:** `tests\profile\profile-page.spec.ts`

**Steps:**
  1. Start in a fresh browser context and sign in using EXPENSE_TRACKER_EMAIL and EXPENSE_TRACKER_PASSWORD, then open /profile.
    - expect: Authentication succeeds and the page remains on /profile.
  2. Inspect the primary content header and identity card.
    - expect: The Profile heading and Manage your account settings description are visible.
    - expect: The identity card shows an avatar/initial, the current username, and the account email.
  3. Inspect the Email, Username, Monthly Income, Email Notifications, and Account Information controls/sections.
    - expect: Email matches the configured account and cannot be edited.
    - expect: Username is editable.
    - expect: Monthly Income is an editable numeric field with a minimum of zero and 0.01 step.
    - expect: Email Notifications checkbox and its explanatory text are visible.
    - expect: Account Information shows Member since and Last updated labels.
  4. Inspect the initial Save Changes state without editing any value.
    - expect: Save Changes is disabled while the form matches persisted settings.

#### 1.2. Profile edits, checkbox state, and reset behavior

**File:** `tests\profile\profile-page.spec.ts`

**Steps:**
  1. Sign in and open /profile; record the original username and monthly income and the current Email Notifications checkbox state.
    - expect: The profile form displays the original values and Save Changes is initially disabled.
  2. Edit the username, then restore its original value without saving.
    - expect: Save Changes becomes enabled after a change and returns to disabled after restoring the original value.
  3. Change Monthly Income to a different valid non-negative decimal, then restore its original value without saving.
    - expect: The numeric input accepts a valid decimal value.
    - expect: Save Changes reflects dirty state and returns to disabled after restoration.
  4. Toggle Email Notifications and then toggle it back to its initial state without saving.
    - expect: The checkbox state changes when toggled.
    - expect: Save Changes becomes enabled after toggling and returns to disabled after restoring the initial state.

#### 1.3. Profile form rejects invalid values

**File:** `tests\profile\profile-page.spec.ts`

**Steps:**
  1. Sign in and open /profile; clear the Username field and attempt form submission only if the interface allows a submission attempt without saving unrelated data.
    - expect: The profile form should prevent an empty username from being saved and should expose a clear validation message.
  2. Restore the original username, enter a negative Monthly Income, and attempt submission only if safe to do so.
    - expect: Negative income should be rejected, with clear validation and no persisted profile change.
  3. Restore the original values and verify Save Changes returns to disabled.
    - expect: The account settings are unchanged after validation checks.

#### 1.4. Save profile changes and verify persistence safely

**File:** `tests\profile\profile-page.spec.ts`

**Steps:**
  1. Sign in and open /profile; capture the current username and Monthly Income before editing.
    - expect: The current persisted profile values are available for restoration.
  2. Update one editable field with a reversible test value and select Save Changes.
    - expect: The save completes successfully and the updated value is reflected by the profile UI.
  3. Reload /profile and verify the saved value persists.
    - expect: The saved test value remains after reload.
  4. Restore the original value in a finally-protected cleanup and save the restoration.
    - expect: The original profile value is restored even if an assertion fails.

#### 1.5. Header navigation and account menu controls

**File:** `tests\profile\profile-page.spec.ts`

**Steps:**
  1. Sign in, open /profile, and activate the account-menu button displaying the current initial and username.
    - expect: The account menu opens and exposes Settings, Help & Support, and Sign Out.
  2. Select Settings.
    - expect: The app navigates to or remains on /profile.
  3. Reopen the account menu and select Help & Support.
    - expect: The current app behavior for the Help & Support link is verified without an uncaught error.
  4. Use each primary navigation link: Dashboard, Expenses, Categories, Budgets, and Profile; return to /profile between checks as necessary.
    - expect: Each navigation link opens its corresponding route and renders the destination page.

#### 1.6. Sign out and protect the Profile route

**File:** `tests\profile\profile-page.spec.ts`

**Steps:**
  1. Sign in, open /profile, and open the account menu.
    - expect: The Sign Out control is available in the account menu.
  2. Select Sign Out.
    - expect: The app signs out and redirects to /signin.
  3. Navigate directly to /profile after signing out.
    - expect: The protected Profile route redirects the unauthenticated visitor to /signin.
