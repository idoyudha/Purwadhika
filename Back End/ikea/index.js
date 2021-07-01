const express = require('express')
const app = express()
const port = 2025 
const cors = require('cors')
const bearerToken = require('express-bearer-token')
const https = require('https')
const fs = require('fs')
const dotenv = require('dotenv')

dotenv.config()

const { homeRoute, userRoute, productRoute, transactionRoute } = require('./routes')
const { db } = require('./config/database')

app.use(cors())
app.use(express.static('public')) // access static files in public folder
app.use(bearerToken()) // take auth/token from request header which sent by front end
app.use(express.json()) // take data from request body url
app.use('/', homeRoute)
app.use('/users', userRoute)
app.use('/products', productRoute)
app.use('/transaction', transactionRoute)

db.getConnection(( error, connection ) => {
    if (error) {
        return console.error('error MySQL: ', error.message)
    }
    console.log(`Connected to MySQL Server : ${connection.threadId}`)
})

// Error handling 
app.use((error, request, response, next) => {
    console.log("Error", error)
    response.status(500).send({status: "Error MySQL!", messages: error})
})

// https.createServer({
//     key: fs.readFileSync('./ssl/server.key'),
//     cert: fs.readFileSync('./ssl/server.cert')
// }, app).listen(port, () => {
//     console.log(`App listening at http://localhost:${port}`)
// })

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})