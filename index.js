const express = require('express')
const app = express()

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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const PORT = 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})