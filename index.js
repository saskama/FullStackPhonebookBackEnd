const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('body', req => {
    return JSON.stringify(req.body)
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

app.get('/', (request, response) => {
    response.send('<h1>Phonebook App!</h1>')
  })

app.get('/info', (request, response) => {
    const time = new Date(Date.now())

    response.send(`<p>Phonebook has info for ${persons.length} people </p>
                    <p>${time}</p>
                    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {

    const person = request.body

    if (!person.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      }
    if (!person.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
    }

    if (persons.findIndex(p => p.name ===person.name) !== -1){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }


    person.id = Math.round(Math.random() * 1000)
    
    persons = persons.concat(person)

    response.json(person)

  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })