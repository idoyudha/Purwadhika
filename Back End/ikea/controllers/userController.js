const fs = require('fs')
const url = require('url')
const { db, dbQuery } = require('../config/database')

module.exports = {
    getUser: async (request, response) => {
        try {
            let query = url.parse(request.url, true)
            let res = query.path.replace("/?", "")
            let res1 = res.replace(/=/g, "='")
            let res2 = res1.replace(/&/g, "' AND ")
            if (query.path !== '/') {
                getSQL = `SELECT * FROM USER WHERE ${res2}'`
            }
            else {
                getSQL = `SELECT * FROM USER`
            }
            console.log(res)
            let cartSQL = `SELECT cart.iduser, cart.idproduct, product.name, pi.images, product.price, ps.type, ps.quantity, 
            cart.quantity FROM cart JOIN product ON cart.idproduct = product.idproduct JOIN product_stock ps ON 
            ps.idproduct_stock = cart.idstock JOIN product_image pi ON pi.idproduct_image = cart.idstock 
            WHERE ${res}`
            let data = await dbQuery(getSQL)
            data[0].cart = await dbQuery(cartSQL)
            response.status(200).send(data)
        } 
        catch (error) {
            response.status(500).send({ status: 'Error MySQL', messages: error})
        }
    },

    login: async (request, response) => {
        try {
            if (request.body.email && request.body.password) {
                let getSQL = `SELECT * FROM USER WHERE 
                email=${db.escape(request.body.email)} AND
                password=${db.escape(request.body.password)}`

                let iduser = `SELECT iduser FROM db_ikea.user WHERE email = ${db.escape(request.body.email)}`
                console.log('iduser', iduser)

                let data = await dbQuery(getSQL)
                if (data.length > 0) {
                    response.status(200).send(data) 
                }
                else {
                    response.status(200).send('Account or password not match!')
                }
            }
            else {
                response.status(200).send('Parameter not complete!')
            }
        } 
        catch (error) {
            response.status(400).send({ status: 'Error MySQL', messages: error})
        }
    },

    register: async (request, response) => {
        try {
            let username = request.body.username
            let email = request.body.email
            let password = request.body.password
            let role = request.body.role
            let idstatus = request.body.idstatus
            // console.log(username, email, password, role, idstatus)
            let getSQL = `SELECT * FROM USER WHERE email='${email}'`
            let postSQL = `INSERT INTO user (username, email, password, role, idstatus) VALUES ('${username}', '${email}', '${password}', '${role}', '${idstatus}');`
            let get = await dbQuery(getSQL)
            let data = JSON.parse(JSON.stringify(get))
            console.log(data.length)
            if (data.length > 0) {
                response.status(200).send('Email already registered!')
            }
            else {
                await dbQuery(postSQL)
                response.status(200).send('Register Success!')
            }
        } 
        catch (error) {
            response.status(400).send({ status: 'Error post to MySQL', messages: error})
        }
    }
}