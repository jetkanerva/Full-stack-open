import React, { useState } from 'react';

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleDetails} style={{ marginLeft: '10px' }}>
          {detailsVisible ? 'Hide' : 'View'}
        </button>
        {detailsVisible && (
            <div>
              <p>URL: {blog.url}</p>
              <p>Likes: {blog.likes} <button>Like</button></p>
              <p>Added by: {blog.user ? blog.user.name : 'Anonymous'}</p>
            </div>
        )}
      </div>
  );
};

export default Blog;
