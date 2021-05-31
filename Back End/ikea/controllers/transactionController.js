const { response, query, request } = require('express')
const { dbQuery } = require('../config/database')

module.exports = {
    getCart: async (request, response, next) => {
        try {
            // iduser, idproduct, name, image, price, type, quantity, idstock, quantity
            let cart = `SELECT cart.iduser, cart.idproduct, cart.idcart, product.name, pi.images, product.price, ps.type, ps.quantity, 
            cart.quantity FROM cart JOIN product ON cart.idproduct = product.idproduct JOIN product_stock ps ON 
            ps.idproduct_stock = cart.idstock JOIN product_image pi ON pi.idproduct_image = cart.idstock 
            WHERE cart.iduser=${request.params.iduser}`
            querycart = await dbQuery(cart)
            response.status(200).send(querycart)
        } 
        catch (error) {
            next(error)
        }
    },

    addCart: async (request, response, next) => {
        try {
            let queryInsert = 'INSERT INTO cart SET ?'
            console.log('INSERT ADD CART', request.body)
            queryInsert = await dbQuery(queryInsert, request.body)
            console.log(queryCheck)
            response.status(200).send({status: "Add Success!", results: queryCheck})
        } 
        catch (error) {
            next(error)
        }
    },

    updateSameProductInCart: async (request, response, next) => {
        try {
            let queryUpdate = `UPDATE cart SET quantity = ${request.body.quantity} WHERE idcart = ${request.body.idcart}`
            queryUpdate = await dbQuery(queryUpdate, request.body)
            console.log(queryUpdate)
            response.status(200).send({status: "Add Success!", results: queryUpdate})
        } 
        catch (error) {
            next(error)
        }
    },

    updateCart: async (request, response, next) => {
        try {
            let idcart = request.body.idcart
            let queryUpdate = `UPDATE cart SET ? WHERE idcart = ${idcart}`
            queryUpdate = await dbQuery(queryUpdate, request.body)
            response.status(200).send({status: "Update Success!", results: queryUpdate})
        } 
        catch (error) {
            next(error)
        }
    },
    
    deleteCart: async (request, response, next) => {
        try {
            let queryDelete = `DELETE FROM cart WHERE idcart = ${request.params.id};`
            deleteCart = await dbQuery(queryDelete)
            response.status(200).send(deleteCart)
        } 
        catch (error) {
            next(error)
        }
    }
}