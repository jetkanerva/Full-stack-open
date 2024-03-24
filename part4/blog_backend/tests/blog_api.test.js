const { test, after, beforeEach } = require('node:test')
const assert = require('assert').strict;
const supertest = require('supertest')
const app = require('../app')

const mongoose = require('mongoose')
const Blog = require('../models/blog')

const api = supertest(app);

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})

test('GET /api/blogs returns the correct number of blog posts', async () => {
    const response = await api
        .get('/api/blogs')
        .expect('Content-Type', /application\/json/);

    console.log(response.body);
    const expectedNumberOfBlogs = 2;
    assert.equal(response.body.length, expectedNumberOfBlogs, `Expected ${expectedNumberOfBlogs} blog posts`);
})

test('unique identifier property of the blog posts is named id', async () => {
    const response = await api
        .get('/api/blogs');

    assert.ok(response.body[0].id, 'Blog post should have an id property');
});

test('making a POST request to /api/blogs successfully creates a new blog post', async () => {
    const newBlog = {
        title: 'unit test',
        author: 'test user',
        url: 'https://fullstackopen.com/en/',
        likes: 5,
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    assert.equal(response.body.length, initialBlogs.length + 1, 'Total number of blogs should be increased by one');

    const titles = response.body.map(r => r.title);
    assert.ok(titles.includes(newBlog.title), 'The new blog title should be in the database');
});

test('if likes property is missing it defaults to 0', async () => {
    const newBlog = {
        title: 'Default Likes Test',
        author: 'Test Author',
        url: 'http://example.com/default-likes',
    };

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    assert.equal(response.body.likes, 0, 'Likes property should default to 0');
});

test('blog without title or url is not added', async () => {
    const newBlogWithoutTitle = {
        author: 'Missing Title',
        url: 'http://example.com/missing-title',
        likes: 2,
    };

    await api
        .post('/api/blogs')
        .send(newBlogWithoutTitle)
        .expect(400);

    const newBlogWithoutUrl = {
        title: 'Missing URL',
        author: 'Test Author',
        likes: 3,
    };

    await api
        .post('/api/blogs')
        .send(newBlogWithoutUrl)
        .expect(400);

    const response = await api.get('/api/blogs');
    assert.equal(response.body.length, initialBlogs.length, 'Total number of blogs should not increase');
});

test('a blog post can be deleted', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = blogsAtStart[0];

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);

    const blogsAtEnd = await Blog.find({});
    assert.equal(blogsAtEnd.length, blogsAtStart.length - 1, 'Should decrease the blog count');
});

test('blog post can be successfully updated', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0].toJSON();

    const newLikes = blogToUpdate.likes + 1;

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ ...blogToUpdate, likes: newLikes })
        .expect(200)
        .expect('Content-Type', /application\/json/);

    const updatedBlog = await Blog.findById(blogToUpdate.id);

    assert.strictEqual(updatedBlog.likes, newLikes, 'The likes should be incremented by 1');
});

after(async () => {
    await mongoose.connection.close()
})