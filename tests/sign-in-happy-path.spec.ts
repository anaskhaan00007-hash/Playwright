// spec: specs/sign-in.test.plan.md
// seed: tests/seed.spec.ts

import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';

const LOGIN_URL = 'https://freelance-learn-automation.vercel.app/login';
const SIGNUP_URL = 'https://freelance-learn-automation.vercel.app/signup';

// Read credentials from logindata.json
const loginDataPath = path.resolve(__dirname, '../logindata.json');
let testEmail = process.env.TEST_EMAIL;
let testPassword = process.env.TEST_PASSWORD;
try {
  const raw = fs.readFileSync(loginDataPath, 'utf8');
  const loginData = JSON.parse(raw);
  if (Array.isArray(loginData) && loginData.length > 0) {
    testEmail = testEmail || loginData[0].username;
    testPassword = testPassword || loginData[0].password;
  }
} catch (e) {
  // ignore and fallback to env vars
}

if (!testEmail || !testPassword) {
  throw new Error('No test credentials found. Set TEST_EMAIL/TEST_PASSWORD or add entries to logindata.json');
}

function waitForEither<T>(promises: Array<Promise<T>>, timeout = 5000) {
  return Promise.race([
    ...promises,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout)),
  ]);
}

test.describe('Sign In Page', () => {
  test('Happy path — valid credentials', async ({ page }) => {
    // Ensure the test user exists by attempting to register first.
    // If the user already exists the app typically shows an "already exist" message — that's fine.
    try {
      await page.goto(SIGNUP_URL);
      // Try common input locators for signup form
      const nameInput = page.getByPlaceholder(/name|full name/i).first();
      if (await nameInput.count() > 0) {
        await nameInput.fill('Test User');
      }

      const signupEmail = page.getByPlaceholder(/email/i).first();
      if (await signupEmail.count() > 0) {
        await signupEmail.fill(testEmail);
      } else {
        const altEmail = page.locator('input[type="email"]').first();
        if (await altEmail.count() > 0) await altEmail.fill(testEmail);
      }

      const signupPassword = page.getByPlaceholder(/password/i).first();
      if (await signupPassword.count() > 0) {
        await signupPassword.fill(testPassword);
      } else {
        const altPass = page.locator('input[type="password"]').first();
        if (await altPass.count() > 0) await altPass.fill(testPassword);
      }

      const signupButton = page.getByRole('button', { name: /sign\s*up|register/i }).first();
      if (await signupButton.count() > 0) {
        await signupButton.click();
        // wait briefly for a success or exist message to appear
        await page.waitForTimeout(1000).catch(() => {});
      }
    } catch (e) {
      // ignore — signup may not be available or may fail; we'll try sign-in next
    }

    // Navigate to login and perform sign-in
    await page.goto(LOGIN_URL);
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Enter Email' }).fill(testEmail);
    await page.getByRole('textbox', { name: 'Enter Password' }).fill(testPassword);

    // Prepare error selectors
    const errorSelectors = [
      '[role="alert"]',
      'text=Email and Password Doesn\'t match',
      'text=USER Email Doesn\'t Exist',
      'text=Invalid credentials',
      'heading:has-text("error")',
      'text=Incorrect password',
    ];
    const errorWaiters = errorSelectors.map(sel => page.locator(sel).waitFor({ state: 'visible', timeout: 5000 }).then(() => sel).catch(() => null));

    // Click sign in and wait concurrently for redirect or error
    await page.getByRole('button', { name: 'Sign in' }).click();

    const redirectPromise = page.waitForURL(url => !url.includes('/login'), { timeout: 5000 }).then(() => 'redirect').catch(() => null);

    let result: string | null = null;
    try {
      result = await waitForEither([redirectPromise, ...errorWaiters], 5000);
    } catch (e) {
      result = null;
    }

    if (result === 'redirect') {
      await expect(page.getByRole('heading', { name: 'Sign In' })).toHaveCount(0);
      return;
    }

    // If any error selector matched, collect visible texts
    for (const sel of errorSelectors) {
      const loc = page.locator(sel).first();
      if (await loc.count() > 0 && await loc.isVisible().catch(() => false)) {
        const text = (await loc.innerText().catch(() => '')).trim();
        throw new Error(`Login failed: matched selector ${sel}. Text: ${text}`);
      }
    }

    // No redirect and no known error element -> capture body and screenshot for diagnosis
    const bodyText = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
    const screenshotPath = `test-failure-login-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
    const snippet = bodyText.slice(0, 1000);
    throw new Error(`Login did not redirect and no known error element appeared. Page body (first 1000 chars): ${snippet}. Screenshot: ${screenshotPath}`);
  });
});
