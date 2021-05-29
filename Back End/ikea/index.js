const { response } = require('express')
const express = require('express')
const app = express()
const port = 2025 
const cors = require('cors')

const { homeRoute, userRoute, productRoute, transactionRoute } = require('./routes')
const { db } = require('./config/database')

app.use(cors())
app.use(express.json())
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

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})