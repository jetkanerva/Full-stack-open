const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app);

// node --test blog_api.test.js

test('GET /api/blogs returns the correct number of blog posts', async () => {
    await api
        .get('/api/blogs')
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})