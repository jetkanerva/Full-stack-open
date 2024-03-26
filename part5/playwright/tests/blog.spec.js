const { test, expect } = require('@playwright/test');

test.describe('Blog app', () => {
    test.beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3001/api/testing/reset');
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
        await page.click('text=login');
    });

    test('allows a logged in user to create a blog', async ({ page }) => {
        await page.click('text=Create new');
        await page.fill('input[name="title"]', 'test Blog');
        await page.fill('input[name="author"]', 'test Author');
        await page.fill('input[name="url"]', 'https://example.com');

        await page.click('text=Create');

        await expect(page.locator('text=text Blog')).toBeVisible();
    });
});
