import React, {useState} from 'react';
import blogService from '../services/blogs'; // Adjust the import path as necessary

const CreateBlogForm = ({setBlogs}) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');
    const [formVisible, setFormVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleNewBlog = async (event) => {
        event.preventDefault();

        try {
            const newBlog = await blogService.create({
                title, author, url
            });
            setBlogs(blogs => [...blogs, newBlog]);
            setTitle('');
            setAuthor('');
            setUrl('');
            setSuccessMessage(`A new blog "${title}" by ${author} added`);
            setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            setFormVisible(false);
        } catch (exception) {
            console.error(exception);
            setErrorMessage(exception.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    };

    const hideWhenVisible = { display: formVisible ? 'none' : '' };
    const showWhenVisible = { display: formVisible ? '' : 'none' };

    return (
        <div>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            <div style={hideWhenVisible}>
                <button onClick={() => setFormVisible(true)}>Create new</button>
            </div>
            <div style={showWhenVisible}>
                <h2>Create new blog</h2>
                <form onSubmit={handleNewBlog}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            name="title"
                            onChange={({target}) => setTitle(target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="author">Author:</label>
                        <input
                            id="author"
                            type="text"
                            value={author}
                            name="author"
                            onChange={({target}) => setAuthor(target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="url">URL:</label>
                        <input
                            id="url"
                            type="text"
                            value={url}
                            name="url"
                            onChange={({target}) => setUrl(target.value)}
                        />
                    </div>
                    <button type="submit">Create</button>
                </form>
                <button onClick={() => setFormVisible(false)}>Cancel</button>
            </div>
        </div>
    );
};

export default CreateBlogForm;
