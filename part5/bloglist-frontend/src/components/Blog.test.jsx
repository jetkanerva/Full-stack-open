import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders blogs title and author, but not URL or likes by default', () => {
    const blog = {
        title: 'Test Driven Development with React',
        author: 'Jane Doe',
        url: 'https://example.com',
        likes: 4,
        users: [{ name: 'John Doe' }],
        id: '1234'
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

test('displays the URL and number of likes after view button is clicked', async () => {
    const blog = {
        title: 'Test Driven Development with React',
        author: 'Jane Doe',
        url: 'https://example.com',
        likes: 4,
        users: [{ name: 'John Doe' }],
        id: '1234'
    };

    const mockSetBlogs = vi.fn();
    const mockSetErrorMessage = vi.fn();
    const user = { name: 'John Doe' };

    render(<Blog blog={blog} setBlogs={mockSetBlogs} setErrorMessage={mockSetErrorMessage} user={user} />);

    const viewButton = screen.getByRole('button', { name: 'View' });
    await userEvent.click(viewButton);

    const urlElement = screen.getByText(`URL: ${blog.url}`);
    expect(urlElement).toBeDefined();

    const likesElement = screen.getByText(`Likes: ${blog.likes}`);
    expect(likesElement).toBeDefined();
});