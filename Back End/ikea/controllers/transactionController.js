const { response, query } = require('express')
const { dbQuery } = require('../config/database')

module.exports = {
    getCart: async (request, response, next) => {
        try {
            // iduser, idproduct, name, image, price, type, quantity, idstock, quantity
            let cart = `SELECT cart.iduser, cart.idproduct, product.name, pi.images, product.price, ps.type, ps.quantity, 
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
            queryInsert = await dbQuery(queryInsert, request.body)
            response.status(200).send({status: "Success!", results: queryInsert})
        } 
        catch (error) {
            next(error)
        }
    },

    updateCart: (request, response, next) => {
        let iduser = request.body.iduser
        let idproduct = request.body.idproduct
        let idstock = request.body.idstock
        let quantity = request.body.quantity
        console.log(request.body)
    },
    
    deleteCart: (request, response, next) => {
        
    }
}