# Sign In Page Test Plan

## Application Overview

End-to-end and exploratory test plan for the Sign In page at https://freelance-learn-automation.vercel.app/login. Tests cover happy path, validations, error handling, accessibility, keyboard navigation, responsive layout, and edge cases. Assumes a fresh browser state before each test and at least one valid test account available for happy-path tests.

## Test Scenarios

### 1. Sign In Page

**Seed:** `tests/seed.spec.ts`

#### 1.1. Happy path — valid credentials

**File:** `specs/sign-in/happy-path.spec.ts`

**Steps:**
  1. Open the browser and navigate to https://freelance-learn-automation.vercel.app/login
  2. Verify the Sign In heading is visible
  3. Enter a valid email in the Email field (use a test account)
  4. Enter the corresponding valid password in the Password field
  5. Click the 'Sign in' button
  6. Wait for navigation/response and confirm user is redirected to the authenticated landing page or dashboard

**Expected Results:**
  - User is authenticated and redirected to the expected landing page (e.g., / or /dashboard)
  - A visible UI element that indicates a signed-in state is present (username, logout button, or dashboard header)
  - No error message shown
  - HTTP response for login request is successful (2xx)

#### 1.2. Validation — both fields empty

**File:** `specs/sign-in/validation-empty-fields.spec.ts`

**Steps:**
  1. Open the login page
  2. Leave Email and Password fields empty
  3. Click 'Sign in'

**Expected Results:**
  - Inline validation messages appear for required fields (e.g., 'Email is required', 'Password is required')
  - Form is not submitted and no navigation occurs
  - Focus moves to the first invalid field as per accessibility best practice

#### 1.3. Validation — invalid email format

**File:** `specs/sign-in/validation-invalid-email.spec.ts`

**Steps:**
  1. Open the login page
  2. Enter 'invalid-email' into Email field
  3. Enter a valid-looking password into Password field
  4. Click 'Sign in'

**Expected Results:**
  - An inline error specific to email format is shown (e.g., 'Please enter a valid email')
  - Form is not submitted and no navigation occurs
  - Email field remains focused or gets appropriate aria-invalid attribute

#### 1.4. Authentication — incorrect password

**File:** `specs/sign-in/auth-wrong-password.spec.ts`

**Steps:**
  1. Open the login page
  2. Enter a valid registered email
  3. Enter an incorrect password
  4. Click 'Sign in'

**Expected Results:**
  - A clear authentication error appears (e.g., 'Invalid credentials' or 'Incorrect password')
  - Email field keeps its value, password field is cleared or masked per product behavior
  - No redirect to protected pages occurs

#### 1.5. UI — password masking and toggle (if present)

**File:** `specs/sign-in/ui-password-mask.spec.ts`

**Steps:**
  1. Open the login page
  2. Inspect the Password field type attribute
  3. If a 'show password' toggle exists, click it and observe behavior

**Expected Results:**
  - Password input has type 'password' by default
  - If 'show password' exists, toggling reveals plain text and toggling again masks it
  - No credentials are leaked to logs or console

#### 1.6. Accessibility — input attributes and aria

**File:** `specs/sign-in/accessibility-attributes.spec.ts`

**Steps:**
  1. Open the login page
  2. Inspect Email and Password inputs for `aria-*` attributes, `label` association, and `autocomplete` attributes
  3. Verify Sign in button has discernible text and is reachable by assistive tech

**Expected Results:**
  - Email and Password fields have associated labels or aria-labels
  - `autocomplete` attributes are provided (`email` for email, `current-password` for password)
  - Buttons and links have accessible names and semantics for screen readers

#### 1.7. Navigation — 'New user? Signup' link

**File:** `specs/sign-in/navigation-signup.spec.ts`

**Steps:**
  1. Open the login page
  2. Click the 'New user? Signup' link

**Expected Results:**
  - The page navigates to /signup or the expected registration page
  - Signup page shows registration form elements
  - Back navigation returns to login page

#### 1.8. External links — social icons open correctly

**File:** `specs/sign-in/external-links.spec.ts`

**Steps:**
  1. Open the login page
  2. Click each social link (YouTube, Twitter, LinkedIn, Facebook, Reddit)

**Expected Results:**
  - Each link opens the correct external URL
  - Links open in a new tab/window or navigate as expected
  - No unexpected popups or prompts appear

#### 1.9. Keyboard — tab order and keyboard-only sign in

**File:** `specs/sign-in/keyboard-navigation.spec.ts`

**Steps:**
  1. Open the login page
  2. Using Tab key, move through focusable elements from top to bottom
  3. Enter credentials using keyboard, and press Enter while focused on Password or Sign in button

**Expected Results:**
  - Focus order is logical (Email -> Password -> Sign in -> Signup link)
  - Enter key triggers form submission when focused on password or sign-in button
  - All interactive controls are reachable and usable with keyboard only

#### 1.10. Responsive — mobile and tablet layout

**File:** `specs/sign-in/responsive.spec.ts`

**Steps:**
  1. Open the login page
  2. Resize viewport to mobile dimensions (e.g., 375x812) and tablet (e.g., 768x1024)
  3. Verify critical elements are visible and usable

**Expected Results:**
  - Form remains visible and usable at mobile and tablet sizes
  - No overflow or layout break; buttons remain tappable
  - Images scale appropriately and text remains legible

#### 1.11. Security/Edge — repeated failed attempts

**File:** `specs/sign-in/rate-limit.spec.ts`

**Steps:**
  1. Open the login page
  2. Attempt signing in with a valid email and wrong password repeatedly (e.g., 5-10 times)

**Expected Results:**
  - The application shows throttling or account lock message after repeated failures, or introduces CAPTCHA/rate-limit behavior
  - No sensitive info is exposed in error messages
  - Timing and error messages do not reveal user existence beyond intended behavior

#### 1.12. State — error message clears on input change

**File:** `specs/sign-in/error-clear-on-input.spec.ts`

**Steps:**
  1. Open the login page
  2. Attempt sign-in with incorrect credentials to trigger an error message
  3. Change the Email or Password input value

**Expected Results:**
  - Displayed error message clears or updates appropriately when user modifies input
  - Form remains interactive and user can re-submit without page reload
