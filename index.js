const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.get('/api/persons', (req, res) => {
  res.json(persons);
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send('Person not found');
  }
})

app.get('/info', (req, res) => {
  const currentTime = new Date().toISOString();
  const numPersons = persons.length;
  res.send(`<p>The phonebook has info for ${numPersons} people.</p><p>${currentTime}</p>`);
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = persons.length;
  persons = persons.filter(person => person.id !== id);

  if (persons.length < initialLength) {
    res.status(204).end();
  } else {
    res.status(404).send('Person not found');
  }
})

app.post('/api/persons', (req, res) => {
  const newPerson = req.body;

  if (!newPerson.name || !newPerson.number) {
    return res.status(400).send('The name or number is missing')
  }

  const existingPerson = persons.find(person => person.name === newPerson.name)
  if (existingPerson) {
    return res.status(400).send('The name already exists in the phonebook')
  }

  const newId = Math.floor(Math.random() * 1000)
  newPerson.id = newId

  persons.push(newPerson)
  res.status(201).json(newPerson);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})