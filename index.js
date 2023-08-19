require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const Person = require('./models/person')

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
app.get('/info', (request, response) => {
  response.send('<h2>Phonebook has info for ' + (persons.length).toString() + ' persons</h2><p>' + date.toString() + '</p>')
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
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
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
    .catch(error => console.log(error))
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})