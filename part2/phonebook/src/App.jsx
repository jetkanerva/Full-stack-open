import { useState, useEffect } from 'react'
import "./App.css"
import db_service from "./db_service.jsx";

const Filter = ({ value, onChange }) => {
    // Filters results based on given value
    return (
        <div>
            filter shown with <input value={value} onChange={onChange} />
        </div>
    )
}

const PersonForm = ({ formData }) => {
    // Allows addition of new people into phonebook
    const { addNote, newName, handleNameChange, newNumber, handleNumberChange } = formData;

    return (
        <form onSubmit={addNote}>
            <div>
                name: <input value={newName} onChange={handleNameChange} />
            </div>
            <div>
                number: <input value={newNumber} onChange={handleNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const Persons = ({ notes, onDelete }) => {
    // List all persons inside phonebook
    console.log(notes)
    return (
        <div>
            {notes.map(note =>
                <p key={note.id}>{note.name} {note.number}
                    <button onClick={() => onDelete(note.id)}>delete</button>
                </p>
            )}
        </div>
    )
}

const Notification = ({ successMessage, errorMessage }) => {
    const hasSuccessMessage = successMessage && successMessage.trim() !== '';
    const hasErrorMessage = errorMessage && errorMessage.trim() !== '';

    return (
        <div>
            {hasSuccessMessage && (
                <div className='success'>
                    {successMessage}
                </div>
            )}
            {hasErrorMessage && (
                <div className='error'>
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

const App = () => {
    // Main application logic
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [persons, setPersons] = useState([])
    const [filter, setFilter] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        console.log('effect');
        db_service.getAll()
            .then(initialPersons => {
                console.log('promise fulfilled');
                setPersons(initialPersons);
            });
    }, []);

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            id: persons.length + 1,
            name: newName,
            number: newNumber
        }
        db_service.create(noteObject)
            .then(returnedPerson => {
                setPersons(persons.concat(returnedPerson));
                setNewName('');
                setNewNumber('');

                setSuccessMessage(`Added ${returnedPerson.name}`);
                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000);
            })
    }

    const deletePerson = (id) => {
        const person = persons.find(p => p.id === id);
        if (window.confirm(`Delete ${person.name}?`)) {
            db_service.remove(id)
                .then(() => {
                    setPersons(persons.filter(p => p.id !== id));
                })
                .catch(error => {
                    // Handle the error here
                    setErrorMessage(`Information of ${person.name} has already been removed from server`);
                    setTimeout(() => {
                        setErrorMessage('');
                    }, 5000); // Clear the error message after 5 seconds
                });
        }
    }

    const notesToShow = filter
        ? persons.filter(note => note.name.toLowerCase().includes(filter.toLowerCase()))
        : persons

    const formData = {
        addNote,
        newName,
        handleNameChange,
        newNumber,
        handleNumberChange
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification successMessage={successMessage} errorMessage={errorMessage}/>
            <Filter value={filter} onChange={handleFilterChange} />
            <h2>add a new</h2>
            <PersonForm formData={formData} />
            <h2>Numbers</h2>
            <Persons notes={notesToShow} onDelete={deletePerson} />
        </div>
    )
}

export default App
