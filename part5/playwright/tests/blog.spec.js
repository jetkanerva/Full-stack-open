const { test, expect, beforeEach, afterEach, describe } = require('@playwright/test');

describe('Blog tests', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/testing/reset');
        const name = 'Matti Luukkainen';
        const username = 'mluukkai';
        const password = 'salainen';
        await createAndLoginUser(page, name, username, password, request)
    });

    test('allows a logged in user to create a blog', async ({ page }) => {
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

    test('user who added the blog can delete the blog', async ({ page }) => {
        // Post has to be created first in order to delete it
        await page.click('role=button[name="New"]');
        await page.locator('role=button[name="Create"]').waitFor();
        await page.waitForSelector('input[name="title"]', { state: 'visible' });
        await page.fill('input[name="title"]', 'test2 Blog');
        await page.fill('input[name="author"]', 'test Author');
        await page.fill('input[name="url"]', 'https://example.com');
        await page.locator("[type=submit]").click();
        await page.locator('role=heading[name="test2 Blog"]').waitFor();

        await page.goto('http://localhost:5173/');
        await page.locator('role=heading[name="test2 Blog"]').waitFor();

        await page.getByText('View').click()
        await page.locator('role=button[name="Hide"]').waitFor();

        const pageContent = await page.content();
        console.log(pageContent);

        page.on('dialog', dialog => dialog.accept());
        await page.getByText('Delete').click()

        await page.waitForTimeout(500);

        // Blog should now be deleted
        await expect(page.locator('role=heading[name="test2 Blog"]')).toBeHidden();
    });

    test('only the user who added the blog sees the delete button', async ({ page, context, request }) => {
        await page.click('role=button[name="New"]');
        await page.locator('role=button[name="Create"]').waitFor();
        await page.waitForSelector('input[name="title"]', { state: 'visible' });
        await page.fill('input[name="title"]', 'test2 Blog');
        await page.fill('input[name="author"]', 'test Author');
        await page.fill('input[name="url"]', 'https://example.com');
        await page.locator("[type=submit]").click();
        await page.locator('role=heading[name="test2 Blog"]').waitFor();

        await page.goto('http://localhost:5173/');
        await page.locator('role=heading[name="test2 Blog"]').waitFor();

        await page.getByText('View').click()
        await page.locator('role=button[name="Hide"]').waitFor();

        // Delete button should be visible for mluukkai
        await expect(page.getByText('Delete')).toBeVisible()

        // Create new user
        const name = 'Hacker';
        const username = 'hacker';
        const password = '1234';
        await page.click('role=button[name="logout"]');
        await createAndLoginUser(page, name, username, password, request)

        await page.locator('role=heading[name="test2 Blog"]').waitFor();
        await page.getByText('View').click()
        await page.locator('role=button[name="Hide"]').waitFor();

        // The Delete button should not be shown for another user
        await expect(page.getByText('Delete')).toBeHidden()
    });

    test('blogs are ordered by likes in descending order', async ({ page }) => {
        // Create first blog
        await page.click('role=button[name="New"]');
        await page.locator('role=button[name="Create"]').waitFor();
        await page.waitForSelector('input[name="title"]', { state: 'visible' });
        await page.fill('input[name="title"]', 'test1 Blog');
        await page.fill('input[name="author"]', 'test1 Author');
        await page.fill('input[name="url"]', 'https://example1.com');
        await page.locator("[type=submit]").click();
        await page.locator('role=heading[name="test1 Blog"]').waitFor();

        // Like the first blog once
        await page.goto('http://localhost:5173');
        await page.getByText('View').click()
        await page.locator('role=button[name="Hide"]').waitFor();
        await page.locator('role=button[name="Like"]').click();
        await page.locator('role=button[name="Like"]').click();

        await page.goto('http://localhost:5173');

        // Create the second blog
        await page.click('role=button[name="New"]');
        await page.locator('role=button[name="Create"]').waitFor();
        await page.waitForSelector('input[name="title"]', { state: 'visible' });
        await page.fill('input[name="title"]', 'test2 Blog');
        await page.fill('input[name="author"]', 'test2 Author');
        await page.fill('input[name="url"]', 'https://example2.com');
        await page.locator("[type=submit]").click();
        await page.locator('role=heading[name="test2 Blog"]').waitFor();

        // Like the second blog twice
        await page.locator('.blog:has-text("test2 Blog") >> text=View').click();
        await page.locator('role=button[name="Hide"]').waitFor();
        await page.locator('role=button[name="Like"]').click();
        await page.locator('role=button[name="Like"]').click();
        await page.locator('role=button[name="Like"]').click();

        // Test that blogs are in correct order
        console.log("Blog order:")
        const pageContent = await page.content();
        console.log(pageContent);
        const indexTest2Blog = pageContent.indexOf('test2 Blog');
        const indexTest1Blog = pageContent.indexOf('test1 Blog');
        expect(indexTest2Blog).not.toEqual(-1);
        expect(indexTest1Blog).not.toEqual(-1);
        expect(indexTest2Blog).toBeLessThan(indexTest1Blog);
    });
});

async function createAndLoginUser(page, name, username, password, request) {
    await request.post('http://localhost:3001/api/users', {
        data: {
            name: name,
            username: username,
            password: password
        }
    });
    await page.goto('http://localhost:5173/login');
    await page.fill('input[name="Username"]', username);
    await page.fill('input[name="Password"]', password);
    await page.click('role=button[name="login"]');
    await page.locator('role=button[name="logout"]').waitFor();
    await page.goto('http://localhost:5173');
}