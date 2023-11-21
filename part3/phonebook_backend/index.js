const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors())
app.use(express.json());

const requestLogger = (request, response, next) => {
    const start = Date.now();

    response.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${request.method} ${request.path} ${response.statusCode} - ${duration}ms ${JSON.stringify(request.body)}`);
    });

    next();
};

app.use(requestLogger)

function getTimeEET() {
    const currentDate = new Date();
    const dateTimeOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
    };
    const timeZoneOptions = {
        timeZoneName: 'long'
    };

    const formattedDateTime = new Intl.DateTimeFormat('en-US', dateTimeOptions).format(currentDate);

    // There is probably easier way to do this...
    const timeZones = new Intl.DateTimeFormat('en-US', timeZoneOptions).format(currentDate);
    const values = timeZones.split(',');
    const timeZoneName = values[values.length - 1].trim();

    return formattedDateTime + " (" + timeZoneName + ")";
}

let notes = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);

    if (note) {
        response.json(note);
    } else {
        response.status(404).send({ error: 'Note not found' });
    }
});

app.get('/info', (request, response) => {
    const numberOfEntries = notes.length;
    const currentTime = getTimeEET();
    const data = {
        message : `This page contains information about ${numberOfEntries} people.`,
        time: currentTime,
    };

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <body>
            <p>${data.message}</p>
            <br/>
            <p>${data.time}</p>
        </body>
        </html>
    `;

    response.send(htmlContent);
});

// I set the POST request to accept name as json body since it is a very common practice
app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        });
    }

    if (notes.some(note => note.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const id = Math.floor(Math.random() * 1000) + 1;
    console.log(id);

    const newNote = {
        id: id,
        name: body.name,
        number: body.number
    };

    notes.push(newNote);
    response.json(newNote);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const noteIndex = notes.findIndex(note => note.id === id);

    console.log(id)
    console.log(noteIndex)

    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        response.status(200).send({ message: 'Person deleted successfully' });
    } else {
        response.status(404).send({ error: 'Note not found' });
    }
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('dist'))
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})