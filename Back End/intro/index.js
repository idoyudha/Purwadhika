// API using Express JS
const { request, response } = require('express')
const express = require('express')
const app = express()
const PORT = 4000
const fs = require('fs')

app.use(express.json())

app.get('/', (request, response) => {
    response.status(200).send('<h2>Express</h2>')
})

const { productsRouter } = require('./routers')
const { usersRouter } = require('./routers')

app.use('/products', productsRouter)
app.use('/users', usersRouter)

// app.get('/products', (request, response) => {
//     let products = JSON.parse(fs.readFileSync('./data/products.json'))
//     response.status(200).send(products)
// })

// app.post('/products', (request, response) => {
//     // console.log(request.body)
//     // console.log(request.query)
//     let products = JSON.parse(fs.readFileSync('./data/products.json'))
//     request.body.id = products.length + 1 // auto id increment
//     products.push(request.body)
//     // console.log(products)
//     fs.writeFileSync('./data/products.json', JSON.stringify(products))
//     response.status(200).send(products)
// })

// app.put('/products/:id', (request, response) => {
//     // console.log(request.body, request.params)
//     let products = JSON.parse(fs.readFileSync('./data/products.json'))
//     let index = products.findIndex(item => item.id == request.params.id)
//     // console.log(index)
//     if (index > -1) {
//         products[index] = request.body 
//         // console.log(products)
//         fs.writeFileSync('./data/products.json', JSON.stringify(products))
//         response.status(200).send(products)
//     }
//     else {
//         response.status(600).send('<h2>Product Request Not Found</h2>')
//     }
// })

// app.patch('/products/:id', (request, response) => {
//     console.log(request.body, request.params)
//     let products = JSON.parse(fs.readFileSync('./data/products.json'))
//     let index = products.findIndex(item => item.id == request.params.id)
//     if (index > -1) {
//         for (let property in products[index]) {
//             for (let bodyProp in request.body) {
//                 if (property == bodyProp) {
//                     products[index][property] = request.body[bodyProp]
//                 }
//             }
//         }
//         fs.writeFileSync('./data/products.json', JSON.stringify(products))
//         response.status(200).send(products)
//     }
//     else {
//         response.status(600).send('<h2>Product Request Not Found</h2>')
//     }
// })

// app.delete('/products/:id', (request, response) => {
//     console.log(request.params.id)
//     let products = JSON.parse(fs.readFileSync('./data/products.json'))
//     let index = products.findIndex(item => item.id == request.params.id)
//     console.log(index)
//     if (index > -1) {
//         products.splice(index,1)
//         // console.log(products[request.params.id])
//         fs.writeFileSync('./data/products.json', JSON.stringify(products))
//         response.status(200).send(products)
//     }
//     else {
//         response.status(600).send('<h2>Product Request Not Found</h2>')
//     }
// })

app.listen(PORT,() => console.log("Server Running: ", PORT))