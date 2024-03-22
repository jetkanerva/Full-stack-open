const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

// node --test blog_api.test.js

describe('Blog API tests', () => {
    test('GET /api/blogs returns the correct number of blog posts in JSON format', async () => {
        const response = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);

        const expectedNumberOfBlogs = 6;
        expect(response.body).toHaveLength(expectedNumberOfBlogs);
    });
});