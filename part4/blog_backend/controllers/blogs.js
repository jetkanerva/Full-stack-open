const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/api/blogs', async (request, response) => {
    try {
        const blogs = await Blog.find({});
        console.log(blogs)
        response.status(200).json(blogs);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.post('/api/blogs', async (request, response) => {
    const { title, url } = request.body;
    if (!title || !url) {
        return response.status(400).json({ error: 'Blog post must include both title and url' });
    }

    try {
        const blog = new Blog(request.body);
        const result = await blog.save();
        response.status(201).json(result);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = router