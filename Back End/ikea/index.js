const { response } = require('express')
const express = require('express')
const app = express()
const port = 2025 
const cors = require('cors')

const { homeRoute, userRoute, productRoute } = require('./routes')
const { db } = require('./config/database')

app.use(cors())
app.use(express.json())
app.use('/', homeRoute)
app.use('/users', userRoute)
app.use('/products', productRoute)

db.getConnection(( error, connection ) => {
    if (error) {
        return console.error('error MySQL: ', error.message)
    }
    console.log(`Connected to MySQL Server : ${connection.threadId}`)
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})