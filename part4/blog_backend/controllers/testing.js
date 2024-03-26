const testingRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

// Added this to complete testing on Part 5

testingRouter.post('/reset', async (request, response) => {
    if (process.env.NODE_ENV !== 'test') {
        return response.status(403).json({ error: 'not allowed' });
    }

    await User.deleteMany({});
    await Blog.deleteMany({});

    response.status(204).end();
});

module.exports = testingRouter;