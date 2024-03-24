import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
    blogService.getAll().then(blogs =>
        setBlogs(blogs)
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(user)
      )
      setErrorMessage(null);
      setUser(user);
      setUsername('');
      setPassword('');
      setSuccessMessage('Login successful');
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    try {
      await window.localStorage.clear();
      window.location.reload();
    } catch (exception) {
      console.log(exception);
    }
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()

    try {
      await blogService.create({
        title, author, url
      })
      blogService.getAll().then(blogs =>
          setBlogs(blogs)
      )
      setTitle('');
      setAuthor('');
      setUrl('');
      setSuccessMessage(`a new blog "${title}" by ${author} added`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      console.log(exception);
      setErrorMessage(exception);
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

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
                  onChange={({target}) => setUsername(target.value)}
              />
            </div>
            <div>
              password
              <input
                  type="password"
                  value={password}
                  name="Password"
                  onChange={({target}) => setPassword(target.value)}
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
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        <h2>blogs</h2>
        <h4>{user.name} logged in</h4>
        <button onClick={handleLogout}>logout</button>
        <div>
          <h2>Create new</h2>
          <form onSubmit={handleNewBlog}>
            <div>
              title
              <input
                  type="text"
                  value={title}
                  name="title"
                  onChange={({target}) => setTitle(target.value)}
              />
            </div>
            <div>
              author
              <input
                  type="text"
                  value={author}
                  name="author"
                  onChange={({target}) => setAuthor(target.value)}
              />
            </div>
            <div>
              url
              <input
                  type="text"
                  value={url}
                  name="url"
                  onChange={({target}) => setUrl(target.value)}
              />
            </div>
            <button type="submit">Create</button>
          </form>
        </div>
        {blogs.map(blog => <Blog key={blog.id} blog={blog}/>)}
      </div>
  );
}

export default App