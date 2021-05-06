const { response } = require('express')
const express = require('express')
const app = express()
const port = 2025 

// app.get('/', (request, response) => {
//     response.send('Hello World!')
// })

const { homeRoute, userRoute } = require('./routes')
const { db } = require('./config/database')

app.use(express.json())
app.use('/', homeRoute)
app.use('/users', userRoute)

db.getConnection(( error, connection ) => {
    if (error) {
        return console.error('error MySQL: ', error.message)
    }
    console.log(`Connected to MySQL Server : ${connection.threadId}`)
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})