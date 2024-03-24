const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/api/blogs', async (request, response) => {
    try {
        const blogs = await Blog.find({});
        console.log(blogs)
        response.json(blogs);
    } catch (error) {
        response.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)
    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

module.exports = router