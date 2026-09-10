# Expense Tracker Automation – Playwright

End-to-end UI test automation suite for the [Nest.js Expense Tracker](https://nest-js-expense-tracker.vercel.app/) web application, built with [Playwright](https://playwright.dev/) and TypeScript.

## 📋 Overview

This project automates key user flows of the Expense Tracker app, including authentication and expense management (create/delete), to verify the application behaves as expected from an end user's perspective.

## 🛠️ Tech Stack

- **[Playwright](https://playwright.dev/)** – End-to-end testing framework
- **TypeScript** – Test scripting language
- **Node.js** – Runtime environment

## 📁 Project Structure

```
Expense-Tracker-Automation-Playwright-
├── tests/
│   ├── Signin.spec.ts                       # Sign-in flow test
│   ├── Signin_Expenses.spec.ts              # Sign-in + navigate to Expenses page
│   ├── Addexpense_deleteexpense_test.spec.ts # Create and delete an expense
│   ├── 01_Test.spec.ts                      # (empty / placeholder)
│   └── example.spec.ts                      # Default Playwright sample test
├── playwright.config.ts                     # Playwright configuration
├── package.json                             # Project dependencies
├── package-lock.json
└── .gitignore
```

## ✅ Test Coverage

| Test File | Description |
|---|---|
| `Signin.spec.ts` | Logs into the Expense Tracker application with valid credentials |
| `Signin_Expenses.spec.ts` | Signs in and navigates to the Expenses page |
| `Addexpense_deleteexpense_test.spec.ts` | Signs in, adds a new expense with amount, description, and category, then deletes it from the list |
| `example.spec.ts` | Default Playwright starter test (validates playwright.dev title and navigation) |

## ⚙️ Configuration Highlights

Defined in `playwright.config.ts`:

- **Test directory:** `./tests`
- **Browser:** Chromium (Desktop Chrome)
- **Headless mode:** Disabled (tests run with a visible browser)
- **Trace:** Enabled on every run
- **Screenshots:** Enabled (full page) on every run
- **Video:** Enabled on every run
- **Slow motion:** 1000ms delay between actions (for easier visual debugging)
- **Timeout:** 60 seconds per test
- **Reporter:** HTML report

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/vamsimappetti2001/Expense-Tracker-Automation-Playwright-.git
   cd Expense-Tracker-Automation-Playwright-
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Install Playwright browsers
   ```bash
   npx playwright install
   ```

### Running Tests

Run all tests:
```bash
npx playwright test
```

Run a specific test file:
```bash
npx playwright test tests/Signin.spec.ts
```

Run tests in headed mode with the Playwright UI:
```bash
npx playwright test --ui
```

View the HTML report after a run:
```bash
npx playwright show-report
```

## 🔐 Security Note

The current test files contain hardcoded login credentials directly in the test scripts. Before sharing or continuing to use this repository publicly, consider:

- Moving credentials to environment variables (e.g., a `.env` file, which is already excluded via `.gitignore`) and loading them with `dotenv` (already scaffolded, commented out, in `playwright.config.ts`)
- Rotating the exposed password on the target account
- Rewriting the repository's git history if the credentials should never have been public

## 📌 Notes

- `01_Test.spec.ts` is currently empty and can be removed or filled in with additional test cases.
- `example.spec.ts` is the default test Playwright scaffolds on setup and can be removed once custom tests are in place.

## 👤 Author

**Vamsi Mappetti**
GitHub: [@vamsimappetti2001](https://github.com/vamsimappetti2001)
