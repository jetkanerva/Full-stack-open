const router = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

router.get('/api/blogs', async (request, response) => {
    try {
        const blogs = await Blog.find({}).find({}).populate('users', { username: 1, name: 1, id: 1 });
        console.log(blogs)
        response.status(200).json(blogs);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.post('/api/blogs', async (request, response) => {
    const body = request.body;
    let user;
    try {
        const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }
        user = await User.findById(decodedToken.id);
    } catch (error) {
        return response.status(403).json({ error: "Athentication failed!" });
    }

    console.log(user);

    const { title, author, url, likes } = body;
    if (!title || !url) {
        return response.status(400).json({ error: 'Blog post must include both title and url' });
    }

    try {
        const blog = new Blog({
            title,
            author,
            url,
            likes,
            users: user._id
        });
        const savedBlog = await blog.save();
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog);
    } catch (error) {
        console.log(error)
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
        response.status(500).json({ error: error.message });
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