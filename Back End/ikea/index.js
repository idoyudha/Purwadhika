const { response } = require('express')
const express = require('express')
const app = express()
const port = 2025 

// app.get('/', (request, response) => {
//     response.send('Hello World!')
// })

const { homeRoute } = require('./routes')

app.use('/', homeRoute)

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})