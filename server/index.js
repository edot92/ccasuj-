require('dotenv').config()
import express from 'express'
import { Nuxt, Builder } from 'nuxt'

import api from './api'
import mesin from './api/mesin'

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.set('port', port)

// Import API Routes
app.use('/api', api)
app.use('/mesin', mesin)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)
var io = require('socket.io')()
io.on('connection', function(client) {
  client.on('event', function(data) {
    console.log(data)
  })
  client.on('disconnect', function() {
    console.log('disconnect')
  })
  console.log('ada klient')
})

io.listen(3001)
// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
