const { response, request } = require('express')
const fs = require('fs')
const url = require('url')
const { db } = require('../config/database')

module.exports = {
    getProduct: (request, response) => {
        let getSQL, dataSearch = []
        for (let prop in request.query) {
            dataSearch.push(`${prop} = ${db.escape(request.query[prop])}`)
        }
        if (dataSearch.length > 0) {
            getSQL = `SELECT * FROM product WHERE ${dataSearch.join(' AND ')};`
        }
        else {
            getSQL = `SELECT * FROM product`
        }
        db.query(getSQL, (error, result) => {
            if (error) {
                response.status(200).send({ status: 'Error MySQL', message: error})
            }
            response.status(200).send(result)
        })
    },

    addProduct: (request, response) => {
        let image = request.body.image
        let name = request.body.name
        let brand = request.body.brand
        let description = request.body.description
        let qty = request.body.qty
        let price = request.body.price
        let postSQL =  `INSERT INTO product (image, name, brand, description, qty, price) VALUES ('${image}', '${name}', '${brand}', '${description}', ${qty}, ${price});`
        db.query(postSQL, (error, result) => {
            if (error) {
                response.status(500).send({ status: 'Error get MySQL', messages: error})
            }
            response.status(200).send("Add product success!")
        })
    },

    updateProduct: (request, response) => {
        let updateProduct = []
        for (let property in request.body) {
            updateProduct.push(`${property} = '${request.body[property]}'`)
        }
        console.log('Body', request.body)
        console.log('query', updateProduct)
        let updateSQL = `UPDATE product SET ${updateProduct} WHERE (idproduct = '${request.body.idproduct}');`
        console.log(updateSQL)
        // UPDATE db_ikea.product SET idproduct = 5,price = 25900 WHERE (idproduct = '5');
        db.query(updateSQL, (error, result) => {
            if (error) {
                response.status(500).send({ status: 'Error get MySQL', messages: error})
            }
            response.status(200).send({ status: 'Database has been updated', messages: result.message})
        })
    },

    deleteProduct: (request, response) => {
        console.log('id', request.params.id)
        let deleteSQL = `UPDATE product SET qty = '0', status = 'Not-Available' WHERE (idproduct = ${request.params.id})`;
        db.query(deleteSQL, (error, result) => {
            if (error) {
                response.status(500).send({ status: 'Error get MySQL', messages: error})
            }
            response.status(200).send({ status: 'Delete success', messages: result.message})
        })
    }
}