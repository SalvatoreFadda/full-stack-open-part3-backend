require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.json())

const path = require('path');
const buildPath = path.join(__dirname, 'build')
app.use(express.static(buildPath))

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).send('The name or number is missing');
  }

  const newPerson = new Person({
    name,
    number,
  });

  newPerson.save().then((savedPerson) => {
    res.status(201).json(savedPerson)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).send('Person not found')
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send('Internal server error')
    })
})

app.get('/api/info', (req, res) => {
  const currentTime = new Date().toISOString()
  Person.countDocuments({}, (error, count) => {
    if (error) {
      console.log(error)
      res.status(500).send('Internal server error')
    } else {
      res.send(`<p>The phonebook has info for ${count} people.</p><p>${currentTime}</p>`)
    }
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send('Internal server error')
    })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})