const mongoose = require('mongoose')
const Person = require("./models/person")
const express = require('express')
const app = express()
var morgan = require('morgan')
app.use(express.json())
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))

morgan.token('peron', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :peron'))




const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info',(request, response) => {
  response.send(` Phonebook has info for ${persons.length} people <br> <p>${Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(x => {
    response.json(x)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)  
  const person = persons.find(z => z.id === id)
  if(person){
    response.json(person)
  }
  else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }
  // if(persons.filter(person => person.name.toLowerCase() === body.name.toLowerCase()).length>0){
  //   return response.status(400).json({ 
  //     error: 'name must be unique'
  //   })
  // }

  // const person = {
  //   id: Math.floor(Math.random() * 10000),
  //   name: body.name,
  //   number: body.number
  // }
  const person = new Person({
        name:body.name,
        number:body.number
    })
  person.save().then(result => {
      console.log('phonenumber saved!')
    })

  //persons = persons.concat(person)

  response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})