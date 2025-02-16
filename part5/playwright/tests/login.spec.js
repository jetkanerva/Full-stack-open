const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Login tests', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })

        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.locator('role=heading', { name: 'Login' })).toBeVisible();

        await expect(page.locator('input[name="Username"]')).toBeVisible();
        await expect(page.locator('input[name="Password"]')).toBeVisible();

        await expect(page.locator('role=button', { name: 'login' })).toBeVisible();
    });

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.fill('input[name="Username"]', 'mluukkai');
            await page.fill('input[name="Password"]', 'salainen');
            await page.click('role=button[name="login"]');

            await page.locator('role=button[name="logout"]').waitFor();

            await expect(page.locator('role=button[name="logout"]')).toBeVisible();
            await expect(page.locator('role=heading[name="blogs"]')).toBeVisible();
            await expect(page.locator('role=heading[name="Matti Luukkainen logged in"]')).toBeVisible();
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.fill('input[name="Username"]', 'mluukkai');
            await page.fill('input[name="Password"]', 'wrongpassword');
            await page.click('role=button[name="login"]');

            await page.locator('role=heading[name="Wrong credentials"]').waitFor();

            await expect(page.locator('role=button[name="logout"]')).toBeHidden();
            await expect(page.locator('role=heading[name="blogs"]')).toBeHidden();
            await expect(page.locator('role=heading[name="Matti Luukkainen logged in"]')).toBeHidden();

            await expect(page.locator('role=button[name="login"]')).toBeVisible();
        })
    });
})