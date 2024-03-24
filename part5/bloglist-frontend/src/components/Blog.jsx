import React, { useState } from 'react'
import blogService from '../services/blogs'


const Blog = ({ blog, setBlogs, setErrorMessage, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  console.log(user)

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }

    try {
      await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs => blogs.map(b => b.id !== blog.id ? b : updatedBlog))
    } catch (exception) {
      console.error(exception)
      setErrorMessage('Failed to update likes')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Do you really want to delete this permanently')) {
        await blogService.remove(id)
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      }
    } catch (exception) {
      console.error(exception)
    }
  }

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleDetails} style={{ marginLeft: '10px' }}>
        {detailsVisible ? 'Hide' : 'View'}
      </button>
      {detailsVisible && (
        <div>
          <p>URL: {blog.url}</p>
          <p>Likes: {blog.likes}
            <button onClick={handleLike}>Like</button>
          </p>
          <p>Added by: {blog.users[0].name}</p>
          {blog.users[0].name === user.name ?
            <button onClick={() => handleDelete(blog.id)}>Delete</button>
            : <></>
          }
        </div>
      )}
    </div>
  )
}

export default Blog