const { response, query, request } = require('express')
const { db, dbQuery, transporter } = require('../config')

module.exports = {
    getCart: async (request, response, next) => {
        try {
            console.log("Request Get Cart", request.user.iduser)
            let cart = `SELECT cart.iduser, cart.idproduct, cart.idstock, cart.idcart, product.name, pi.images, product.price, ps.type, ps.quantity, 
            cart.quantity FROM cart JOIN product ON cart.idproduct = product.idproduct JOIN product_stock ps ON 
            ps.idproduct_stock = cart.idstock JOIN product_image pi ON pi.idproduct_image = cart.idstock 
            WHERE cart.iduser=${request.user.iduser}`
            querycart = await dbQuery(cart)
            // console.log("After query cart", querycart)
            response.status(200).send(querycart)
        } 
        catch (error) {
            next(error)
        }
    },

    addCart: async (request, response, next) => {
        try {
            console.log("Req add cart", request)
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
            let n = Math.floor(Math.random() * 100000)
            let queryTransaction = `INSERT INTO db_ikea.transaction (invoice, date, iduser, delivery_cost, total_payment, note, idstatus) VALUES ('INVOICE/${n}', NOW(), ${request.user.iduser}, 40000, (SELECT SUM(quantity * price) total_payment FROM db_ikea.cart JOIN db_ikea.product ON cart.idproduct = product.idproduct WHERE iduser = ${request.user.iduser}), 'NOTE', 6);`
            let deleteCart = `DELETE FROM cart WHERE iduser = ${request.user.iduser};`
            let queryDetail = `INSERT INTO transaction_detail (idtransaction, idproduct, idstock, quantity) VALUES ?`
            
            // Insert to transaction
            queryTransaction = await dbQuery(queryTransaction) // Insert to transaction

            console.log('query transaction', queryTransaction)
            console.log("REquest body", request.body)
            // Insert to transaction detail
            let dataDetail = request.body.map(item => [queryTransaction.insertId, item.idproduct, item.idstock, item.quantity])
            queryDetail = await dbQuery(queryDetail, [dataDetail])
            
            deleteCart = await dbQuery(deleteCart) // Delete cart with iduser

            response.status(200).send({ success: true, message: "Checkout Done!"})      
        } 
        catch (error) {
            next(error)
        }
    },

    getTransaction: async (request, response, next) => {
        try {
            // console.log("GET TRANSACTION REQUEST", request.user)
            // console.log("GET TRANSACTION PARAMS", request.params)
            // console.log("REQUEST", request)
            let getDataTransaction = null 
            let getDataDetail = null
            if (request.params.iduser == 1) {
                getDataTransaction = `SELECT * FROM transaction JOIN status ON transaction.idstatus = status.idstatus JOIN user ON transaction.iduser = user.iduser;`
                getDataDetail = `SELECT transaction.idtransaction, name, type, transaction_detail.quantity, price, (transaction_detail.quantity * price) subtotal FROM transaction_detail JOIN product ON transaction_detail.idproduct = product.idproduct JOIN transaction on transaction.idtransaction = transaction_detail.idtransaction JOIN product_stock ON product_stock.idproduct_stock = transaction_detail.idstock WHERE transaction.idtransaction = transaction_detail.idtransaction; `
            }
            else {
                getDataTransaction = `SELECT * FROM transaction JOIN status ON transaction.idstatus = status.idstatus WHERE iduser = ${request.user.iduser};`
                getDataDetail = `SELECT transaction.idtransaction, name, type, transaction_detail.quantity, price, (transaction_detail.quantity * price) subtotal FROM transaction_detail JOIN product ON transaction_detail.idproduct = product.idproduct JOIN transaction on transaction.idtransaction = transaction_detail.idtransaction JOIN product_stock ON product_stock.idproduct_stock = transaction_detail.idstock WHERE iduser = ${request.user.iduser} AND transaction.idtransaction = transaction_detail.idtransaction; `
            }

            dataTransaction = await dbQuery(getDataTransaction)
            // console.log(dataTransaction)

            dataDetail = await dbQuery(getDataDetail)
            // console.log(dataTransaction)
            // console.log(dataDetail)
            dataTransaction.forEach(elementT => {
                elementT.detail = []
                dataDetail.forEach(elementD => {
                    if (elementT.idtransaction == elementD.idtransaction) {
                        elementT.detail.push(elementD)
                    }
                });
            });

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
[
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
]
*/ 