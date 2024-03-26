const { test, expect, beforeEach, afterEach, describe } = require('@playwright/test');

describe('Blog tests', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/testing/reset');
        await request.post('http://localhost:3001/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        });

        await page.goto('http://localhost:5173');
        await page.fill('input[name="Username"]', 'mluukkai');
        await page.fill('input[name="Password"]', 'salainen');

        await page.click('role=button[name="login"]');
        await page.locator('role=button[name="logout"]').waitFor();
        await page.click('role=button[name="logout"]');
        await page.locator('role=button[name="login"]').waitFor();
    });

    test('allows a logged in user to create a blog', async ({ page }) => {
        // Init
        await page.goto('http://localhost:5173');
        await page.fill('input[name="Username"]', 'mluukkai');
        await page.fill('input[name="Password"]', 'salainen');
        await page.click('role=button[name="login"]');
        await page.locator('role=button[name="logout"]').waitFor();

        // User should now be logged in and blogs database be empty
        await page.click('role=button[name="New"]');
        await page.locator('role=button[name="Create"]').waitFor();

        await page.waitForSelector('input[name="title"]', { state: 'visible' });
        await page.fill('input[name="title"]', 'test2 Blog');
        await page.fill('input[name="author"]', 'test Author');
        await page.fill('input[name="url"]', 'https://example.com');
        await page.locator("[type=submit]").click();

        await page.locator('role=heading[name="test2 Blog"]').waitFor();
        await expect(page.locator('role=heading[name="test2 Blog"]')).toBeVisible();
    });

    test('User can like a post', async ({ page }) => {
        // Init
        await page.goto('http://localhost:5173');
        await page.fill('input[name="Username"]', 'mluukkai');
        await page.fill('input[name="Password"]', 'salainen');
        await page.click('role=button[name="login"]');
        await page.locator('role=button[name="logout"]').waitFor();

        // Post has to be created first in order to edit it
        await page.click('role=button[name="New"]');
        await page.locator('role=button[name="Create"]').waitFor();
        await page.waitForSelector('input[name="title"]', { state: 'visible' });
        await page.fill('input[name="title"]', 'test2 Blog');
        await page.fill('input[name="author"]', 'test Author');
        await page.fill('input[name="url"]', 'https://example.com');
        await page.locator("[type=submit]").click();
        await page.locator('role=heading[name="test2 Blog"]').waitFor();

        const pageContent = await page.content();
        console.log(pageContent);

        await page.getByText('View').click()
        await page.locator('role=button[name="Hide"]').waitFor();

        await page.locator('role=button[name="Like"]').click();
        await page.locator('role=button[name="Like"]').click();

        await page.locator('text=Likes: 2').waitFor()
        await expect(page.locator('text=Likes: 2')).toBeVisible();
    });
});