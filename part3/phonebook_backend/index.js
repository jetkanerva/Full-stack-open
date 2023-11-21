require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors())
app.use(express.json());

const Person = require('./models/note')

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

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people);
    });
});

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(people => {
            if (people) {
                response.json(people);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.get('/info', (request, response) => {
    const numberOfEntries = Person.length;
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

    if (people.some(note => note.name === body.name)) {
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

    newNote.save()
        .then(savedNote => {
            response.json(savedNote);
        })
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const noteIndex = Person.findIndex(note => note.id === id);

    console.log(id)
    console.log(noteIndex)

    if (noteIndex !== -1) {
        Person.splice(noteIndex, 1);
        response.status(200).send({ message: 'Person deleted successfully' });
    } else {
        response.status(404).send({ error: 'Person not found' });
    }
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('dist'))
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})