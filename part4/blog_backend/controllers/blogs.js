const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/api/blogs', async (request, response) => {
    try {
        const blogs = await Blog.find({}).find({}).populate('users');
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

router.put('/api/blogs/:id', async (request, response) => {
    const { title, author, url, likes } = request.body;

    const blogUpdate = {
        title,
        author,
        url,
        likes
    };

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id,
            blogUpdate,
            { new: true, runValidators: true, context: 'query' }
        );

        if (updatedBlog) {
            response.json(updatedBlog);
        } else {
            response.status(404).end();
        }
    } catch (error) {
        response.status(500).json({ error: error.message }); // Bad request for invalid ID formats, etc.
    }
});

router.delete('/api/blogs/:id', async (request, response) => {
    try {
        const result = await Blog.findByIdAndRemove(request.params.id);
        if (result) {
            response.status(204).end();
        } else {
            response.status(404).json({ error: 'Blog post not found' });
        }
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = router