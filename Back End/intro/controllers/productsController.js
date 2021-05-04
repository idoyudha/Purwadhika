const { request, response } = require("express");
const fs = require('fs')

module.exports = {
    getProducts: (request, response) => {
        let products = JSON.parse(fs.readFileSync('./data/products.json'))
        response.status(200).send(products)
    },

    postProducts: (request, response) => {
        // console.log(request.body)
        // console.log(request.query)
        let products = JSON.parse(fs.readFileSync('./data/products.json'))
        request.body.id = products.length + 1 // auto id increment
        products.push(request.body)
        // console.log(products)
        fs.writeFileSync('./data/products.json', JSON.stringify(products))
        response.status(200).send(products)
    },

    putProducts: (request, response) => {
        // console.log(request.body, request.params)
        let products = JSON.parse(fs.readFileSync('./data/products.json'))
        let index = products.findIndex(item => item.id == request.params.id)
        // console.log(index)
        if (index > -1) {
            products[index] = request.body 
            // console.log(products)
            fs.writeFileSync('./data/products.json', JSON.stringify(products))
            response.status(200).send(products)
        }
        else {
            response.status(600).send('<h2>Product Request Not Found</h2>')
        }
    },

    patchProducts: (request, response) => {
        console.log(request.body, request.params)
        let products = JSON.parse(fs.readFileSync('./data/products.json'))
        let index = products.findIndex(item => item.id == request.params.id)
        if (index > -1) {
            for (let property in products[index]) {
                for (let bodyProp in request.body) {
                    if (property == bodyProp) {
                        products[index][property] = request.body[bodyProp]
                    }
                }
            }
            fs.writeFileSync('./data/products.json', JSON.stringify(products))
            response.status(200).send(products)
        }
        else {
            response.status(600).send('<h2>Product Request Not Found</h2>')
        }
    },

    deleteProducts: (request, response) => {
        console.log(request.params.id)
        let products = JSON.parse(fs.readFileSync('./data/products.json'))
        let index = products.findIndex(item => item.id == request.params.id)
        console.log(index)
        if (index > -1) {
            products.splice(index,1)
            // console.log(products[request.params.id])
            fs.writeFileSync('./data/products.json', JSON.stringify(products))
            response.status(200).send(products)
        }
        else {
            response.status(600).send('<h2>Product Request Not Found</h2>')
        }
    }
}