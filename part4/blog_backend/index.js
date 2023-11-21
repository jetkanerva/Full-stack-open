require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const errorHandler = require('./utils/middleware')
const requestLogger = require('./utils/logger')
const Person = require('./models/note')

app.use(cors())
app.use(express.json())
app.use(requestLogger)

function getTimeEET () {
  const currentDate = new Date()
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
  }
  const timeZoneOptions = {
    timeZoneName: 'long'
  }

  const formattedDateTime = new Intl.DateTimeFormat('en-US', dateTimeOptions).format(currentDate)

  // There is probably easier way to do this...
  const timeZones = new Intl.DateTimeFormat('en-US', timeZoneOptions).format(currentDate)
  const values = timeZones.split(',')
  const timeZoneName = values[values.length - 1].trim()

  return formattedDateTime + ' (' + timeZoneName + ')'
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(people => {
      if (people) {
        response.json(people)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// I set the POST request to accept name as json body since it is a very common practice
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(
    error => next(error)
  )
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndRemove(id)
    .then(result => {
      if (result) {
        response.status(200).send({ message: 'Person deleted successfully' })
      } else {
        response.status(404).send({ error: 'Person not found' })
      }
    }).catch(
      error => next(error)
    )
})

app.get('/info', async (request, response) => {
  const numberOfEntries = await Person.countDocuments({})
  const currentTime = getTimeEET()
  const data = {
    message: `This page contains information about ${numberOfEntries} people.`,
    time: currentTime
  }

  const htmlContent = `
        <!DOCTYPE html>
        <html>
        <body>
            <p>${data.message}</p>
            <br/>
            <p>${data.time}</p>
        </body>
        </html>
    `

  response.send(htmlContent)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('dist'))
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
