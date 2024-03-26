import { render, screen } from '@testing-library/react';
import Blog from './Blog';

test('renders blogs title and author, but not URL or likes by default', () => {
    const blog = {
        title: 'Test Driven Development with React',
        author: 'Jane Doe',
        url: 'https://example.com/blog/tdd-react',
        likes: 5,
        users: [{ name: 'John Doe' }],
        id: 'blog123'
    }

    const mockSetBlogs = vi.fn()
    const mockSetErrorMessage = vi.fn()
    const user = { name: 'John Doe' }

    render(<Blog blog={blog} setBlogs={mockSetBlogs} setErrorMessage={mockSetErrorMessage} user={user} />)

    const element = screen.getByText(blog.title)
    expect(element).toBeDefined()

    const authorElement = screen.getByText(blog.author)
    expect(authorElement).toBeDefined()

    const urlElement = screen.queryByText(`URL: ${blog.url}`)
    expect(urlElement).toBeNull()

    const likesElement = screen.queryByText(`Likes: ${blog.likes}`)
    expect(likesElement).toBeNull()
});