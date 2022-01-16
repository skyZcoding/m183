'use strict'
const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const postRoutes = require('./routes/post-routes')

const app = express()
const PORT = 8080

app.use(express.json())
app.use(cors())
app.use(bodyparser.json())

app.use('/api', postRoutes.routes)


app.listen(PORT, () => console.log('App is listening on url: http://localhost:' + PORT))