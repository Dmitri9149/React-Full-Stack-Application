const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

let persons = [
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

const date = new Date()
/*
app.get('/info', (request, response) => {
  response.send('<h2>Phonebook has info for ' + (persons.length).toString() + ' persons</h2><p>' + date.toString() + '</p>')
})
*/

app.get('/info', (req, res) => {
  Person.find({}).then(people => {
    res.send(
      `<div>
        <p>There are ${people.length} records in the phonebook</p>
        <p> ${new Date().toString()}</p>
      </div>`
    )
    console.log(`Server sends size as  ${people.length}`)
  })
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

/*
app.get('/api/persons', (request, response) => {
  response.json(persons)
})
*/

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

/*
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
    console.log('Person', person)
  } else {
    response.status(404).end()
  }
  response.json(person)
})
*/
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

/*
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})
*/
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

/*
const getRandomInt = max => Math.floor(Math.random() * max)
*/

/*
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name ) {
    return response.status(400).json({ 
      error: 'name missing' 
    }) 
  } else if (!body.number ) {
      return response.status(400).json({ 
        error: 'number missing'
      }) 
  } else if (persons.filter(person => person.name === body.name).length !== 0) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })     
  }

  const person = {
    name: body.name,
    number: body.number,
    id: getRandomInt(1_000_000_000),
  }

  persons = persons.concat(person)

  response.json(person)
})
*/
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updated)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})