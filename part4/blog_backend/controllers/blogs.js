const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

router.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)
    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

module.exports = router