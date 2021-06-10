const { db, dbQuery, transporter, createToken } = require('../config')
const Crypto = require('crypto') // module for hashing password


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
            // console.log(res)
            let cartSQL = `SELECT cart.iduser, cart.idproduct, cart.idcart, cart.idstock, product.name, pi.images, product.price, ps.type, ps.quantity, 
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
                let hashPassword = Crypto.createHmac("sha256", "ikea$$$").update(request.body.password).digest("hex")
                
                let getSQL = `SELECT * FROM USER WHERE 
                email=${db.escape(request.body.email)} AND
                password=${db.escape(hashPassword)}`

                let iduser = `SELECT iduser FROM db_ikea.user WHERE email = ${db.escape(request.body.email)}`
                // console.log('iduser', iduser)
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

            let char = '0123456789qwertyuiopasdfghjklzxcvbnm'
            let OTP = ''

            for (let i = 0; i < 6; i++) {
                OTP += char.charAt(Math.floor(Math.random() * char.length))
            }

            // hashing password
            let hashPassword = Crypto.createHmac("sha256", "ikea$$$").update(password).digest("hex")

            // console.log(username, email, password, role, idstatus)
            let getSQL = `SELECT * FROM USER WHERE email='${email}'`
            let postSQL = `INSERT INTO user (username, email, password, role, idstatus, otp) VALUES ('${username}', '${email}', '${hashPassword}', '${role}', '${idstatus}', ${db.escape(OTP)});`
            let get = await dbQuery(getSQL)
            let data = JSON.parse(JSON.stringify(get))
            // console.log(data.length)
            if (data.length > 0) {
                response.status(200).send('Email already registered!')
            }
            else {
                let data = await dbQuery(postSQL)
                let getUser = await dbQuery(`SELECT * FROM USER WHERE iduser=${data.insertId}`)

                let {iduser, username, email, role, idstatus, otp} = getUser[0]

                // Create token
                let token = createToken({iduser, username, email, role, idstatus})

                // config email 

                // 1. email content
                let mail = {
                    from: 'Admin IKEA <yudhatama1123@gmail.com>',
                    to: email,
                    subject: '[IKEA] - Verification Email',
                    html: ` <div><p>Your OTP is <b>${otp}</b></p>
                            <a href='http://localhost:3000/verification/${token}'> Verification your email </a></div>`
                }

                // 2. config transporter
                await transporter.sendMail(mail)

                response.status(200).send({ success: true, messages: "Register Suceess!"})
            }
        } 
        catch (error) {
            console.log(error)
            response.status(400).send({ status: 'Error post to MySQL', messages: error})
        }
    },

    verification: async (request, response) => {
        try {
            console.log("Read token: ", request.user)
            let getUserID = `SELECT iduser FROM user WHERE otp = ${db.escape(request.body.otp)}`
            let userID = await dbQuery(getUserID)
            let {iduser} = userID[0]
            let getOTP = `SELECT otp FROM user WHERE iduser = ${db.escape(iduser)};`
            let data = await dbQuery(getOTP)
            // console.log('data otp', data[0].otp)
            // console.log('request body', request.body.otp)
            if (request.body.otp == data[0].otp) {
                // console.log('Found')
                let updateStatus = `UPDATE user SET idstatus = 11 WHERE iduser = ${db.escape(iduser)};`
                // console.log(updateStatus)

                await dbQuery(updateStatus)
                response.status(200).send({ success: true, messages: "Email is verified!"})
            }
            else {
                console.log('Wrong OTP')
            }
        } 
        catch (error) {
            console.log(error)
            response.status(400).send({ status: 'Error MySQL', messages: error})
        }
    },

    reverification: async (request, response) => {
        try {
            console.log('Goto reverification')
            let hashPassword = Crypto.createHmac("sha256", "ikea$$$").update(request.body.password).digest("hex")
            let getUserData = `SELECT * FROM user WHERE email = ${db.escape(request.body.email)} AND password = ${db.escape(hashPassword)};`
            let userID = await dbQuery(getUserData)
            let {iduser, username, email, role, idstatus} = userID[0]
            // console.log(userID[0].iduser)
            let char = '0123456789qwertyuiopasdfghjklzxcvbnm'
            let OTP = ''

            for (let i = 0; i < 6; i++) {
                OTP += char.charAt(Math.floor(Math.random() * char.length))
            }

            let updateOTP = `UPDATE user SET otp = ${db.escape(OTP)} WHERE iduser = ${iduser};`
            // console.log(updateOTP)
            await dbQuery(updateOTP)
            
            // Create token
            let token = createToken({iduser, username, email, role, idstatus})

            // config email 
            // 1. email content
            let mail = {
                from: 'Admin IKEA <yudhatama1123@gmail.com>',
                to: email,
                subject: '[IKEA] - Verification Email',
                html: ` <div><p>Your new OTP is <b>${OTP}</b></p>
                        <a href='http://localhost:3000/verification/${token}'> Verification your email </a></div>`
            }
            // 2. config transporter
            await transporter.sendMail(mail)

            response.status(200).send({ success: true, messages: "OTP has been sent to your email"})
        } catch (error) {
            console.log(error)
            response.status(400).send({ status: 'Error MySQL', messages: error})
        }
    }
}