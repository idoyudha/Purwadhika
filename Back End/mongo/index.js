const express = require('express')
const cors = require('cors')
const { request, response } = require('express')

const PORT = process.env.PORT || 3300 
const app = express() 

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.status(200).send(`<h1>Welcome</h1>`)
})

// Config MongoDB
let { MongoClient, ObjectID, connect } = require('mongodb')
let urlConnection = `mongodb+srv://ido_01:mongo75a@cluster0.njxxu.mongodb.net/toko?retryWrites=true&w=majority`

let mongo = new MongoClient(urlConnection, { useNewUrlParser: true, useUnifiedTopology: true })

mongo.connect((error, results) => {
    if (error) {
        console.log(error)
    }
    console.log("Connecting to MongoDB Server")
})

app.post('/add-data', (request, response) => {
    mongo.connect((error, connectdb) => {
        if (error) {
            console.log(error)
            response.status(500).send(error)
        }
        const db = connectdb.db('toko')
        db.collection('product').insertMany([request.body], (errorInsert, results) => {
            if (errorInsert) {
                console.log(errorInsert)
                response.status(500).send(errorInsert)
            }
            console.log("Insert Success", results)
            response.status(200).send(results)
        })
    })
})

app.get('/get-data', (request, response) => {
    mongo.connect((error, connectdb) => {
        connectdb.db('toko').collection('product').find({}).toArray((errorGet, results) => {
            if (errorGet) {
                console.log(errorGet)
                response.status(500).send(errorGet)
            }
            console.log("Get Success", results)
            response.status(200).send(results)
        })
    })
})

app.patch('/update', (request, response) => {
    mongo.connect((error, connectdb) => {
        connectdb.db('toko').collection('product').updateOne(request.query, {$set: request.body }, (errorUpdate, results) => {
            if (errorUpdate) {
                console.log(errorUpdate)
                response.status(500).send(errorUpdate)
            }
            console.log("Update Success", results)
            response.status(200).send(results)
        })
    })
})

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))