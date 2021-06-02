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
            // console.log('INSERT ADD CART', request.body)
            queryInsert = await dbQuery(queryInsert, request.body)
            // console.log(queryCheck)
            response.status(200).send({status: "Add Success!", results: queryInsert})
        } 
        catch (error) {
            next(error)
        }
    },

    updateSameProductInCart: async (request, response, next) => {
        try {
            let queryUpdate = `UPDATE cart SET quantity = ${request.body.quantity} WHERE idcart = ${request.body.idcart}`
            queryUpdate = await dbQuery(queryUpdate, request.body)
            // console.log(queryUpdate)
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
    },

    moveToTransaction: async (request, response, next) => {
        try {
            let queryTransaction = `INSERT INTO db_ikea.transaction (invoice, date, iduser, delivery_cost, total_payment, note, idstatus) VALUES ('AA1', NOW(), ${request.params.iduser}, 40000, (SELECT SUM(quantity * price) total_payment FROM db_ikea.cart JOIN db_ikea.product ON cart.idproduct = product.idproduct WHERE iduser = 3), 'NOTE', 6);`
            let deleteCart = `DELETE FROM cart WHERE iduser = ${request.params.iduser};`
            let queryDetail = `INSERT INTO transaction_detail (idtransaction, idproduct, idstock, quantity) VALUES ?`
            
            // Insert to transaction detail
            let dataDetail = request.body.map(item => [item.idproduct, item.idcart, item.idstock, item.quantity])
            queryDetail = await dbQuery(queryDetail, [dataDetail])
            
            
            queryTransaction = await dbQuery(queryTransaction) // Insert to transaction
            deleteCart = await dbQuery(deleteCart) // Delete cart with iduser

            response.status(200).send({ success: true, message: "Checkout Done!"})      
        } 
        catch (error) {
            next(error)
        }
    },

    getTransaction: async (request, response, next) => {
        try {
            let getDataTransaction = `SELECT * FROM transaction JOIN status ON transaction.idstatus = status.idstatus WHERE iduser = ${request.params.iduser};`
            let getDataDetail = `SELECT name, type, transaction_detail.quantity, price, (transaction_detail.quantity * price) subtotal FROM transaction_detail JOIN product ON transaction_detail.idproduct = product.idproduct JOIN transaction on transaction.idtransaction = transaction_detail.idtransaction JOIN product_stock ON product_stock.idproduct_stock = transaction_detail.idstock WHERE iduser = ${request.params.iduser} AND transaction.idtransaction = transaction_detail.idtransaction; `

            dataTransaction = await dbQuery(getDataTransaction)
            // console.log(dataTransaction)

            dataDetail = await dbQuery(getDataDetail)
            dataTransaction[0].detail = dataDetail

            response.status(200).send(dataTransaction)
        } 
        catch (error) {
            next(error)
        }
    },

    payButton: async (request, response, next) => {
        try {
            let payQuery = `UPDATE transaction SET idstatus = 7 WHERE idtransaction = ${request.params.idtransaction}`    
            payQuery = await dbQuery(payQuery) 
            response.status(200).send(payQuery)
        } 
        catch (error) {
            next(error)
        }
    }
}

/* Sample data for query detail 
{
    {
        "idproduct": 1,
        "idcart": 1,
        "idstock": 1,
        "quantity": 1
    },
    {
        "idproduct": 2,
        "idcart": 2,
        "idstock": 2,
        "quantity": 2
    }
}
*/ 