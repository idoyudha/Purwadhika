const { request, response } = require("express");
const fs = require('fs')

module.exports = {
    getProducts:(request, response) => {
        let products = JSON.parse(fs.readFileSync('./data/products.json'))
        response.status(200).send(products)
    }
}