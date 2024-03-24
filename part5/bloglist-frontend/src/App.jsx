import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import CreateBlogForm from './components/blogForm.jsx';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
    blogService.getAll().then(blogs =>
        setBlogs(blogs)
    );
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username, password,
      });
      window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      setSuccessMessage('Login successful');
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000);
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null); // Clear token on logout
  };

  if (!user) {
    return (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                  type="text"
                  value={username}
                  name="Username"
                  onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
              <input
                  type="password"
                  value={password}
                  name="Password"
                  onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
          {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </div>
    )
  }

  return (
      <div>
        <h2>blogs</h2>
        <h4>{user.name} logged in</h4>
        <button onClick={handleLogout}>logout</button>
        <div>
          <CreateBlogForm
              setBlogs={setBlogs}
          />
        </div>
        {blogs.map(blog => <Blog key={blog.id} blog={blog} setBlogs={setBlogs} setErrorMessage={setErrorMessage}/>)}
      </div>
  );
};

export default App;