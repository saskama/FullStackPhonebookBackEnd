require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { response } = require('express')
const app = express()

const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
  
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let persons = Person.find({}).then(persons => {response.json(persons)})

app.get('/info', (request, response) => {

    let count = 0
    const time = new Date(Date.now())

    const p = Person.find({}).count(function(err, count){
      response.send(`<p>Phonebook has info for ${count} people </p>
                  <p>${time}</p>
                  `)
    })
    
})


app.get('/api/persons/:id', (request, response, next) => {
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



app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
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
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {

    // const person = request.body

    if (!request.body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }
    if (!request.body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    // if (Persons.findIndex(p => p.name ===request.body.name) !== -1){
    //     return response.status(400).json({ 
    //         error: 'name must be unique' 
    //       })
    // }

    const person = new Person({
      name: request.body.name,
      number: request.body.number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    }).catch(error => next(error))

    // person.id = Math.round(Math.random() * 1000)
    // persons = persons.concat(person)
    // response.json(person)

  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })


  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  // this has to be the last loaded middleware.
  app.use(errorHandler)


  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })