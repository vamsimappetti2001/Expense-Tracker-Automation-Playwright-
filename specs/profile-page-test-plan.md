# Profile Page Test Plan

## Application Overview

Profile route /profile redirects anonymous visitors to /signin. The authenticated page was not inspected. Use a dedicated staging account and verify actual fields before automating account changes.

## Test Scenarios

### 1. Profile page

**Seed:** `seed.spec.ts`

#### 1.1. Profile access and settings

**File:** `tests/profile/profile.spec.ts`

**Steps:**
  1. Open /profile in a fresh context without a session.
    - expect: Redirect to /signin; private profile information is not exposed.
  2. Sign in with a dedicated staging account and visit /profile; inventory displayed fields and actions.
    - expect: Profile page loads and shows only the signed-in test account's expected information.
  3. If profile editing exists, change a non-sensitive test value, cancel once, then save a valid change and reload.
    - expect: Cancel leaves data unchanged; saved value persists and unrelated fields are unchanged.
  4. If password/security controls exist, validate missing/incorrect current password, policy failures, confirmation mismatch, successful staging-only change, and logout/session handling.
    - expect: Invalid attempts do not change credentials; successful changes follow documented security/session behavior.
