const fs = require('fs')
const url = require('url')
const { db } = require('../config/database')

module.exports = {
    getUser: (request, response) => {
        // let getSQL, dataSearch = [];
        // for (let prop in request.query) {
        //     dataSearch.push(`${prop} = ${db.escape(request.query[prop])}`)
        // }
        // if (dataSearch.length > 0) {
        //     getSQL = `SELECT * FROM USER WHERE ${dataSearch.join(' AND ')};`
        // }
        // else {
        //     getSQL = `SELECT * FROM USER`
        // }

        // db.query(getSQL, (error, results) => {
        //     if (error) {
        //         response.status(500).send({ status: 'Error MySQL', messages: error})
        //     }
        //     response.status(200).send(results)
        // })
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
        db.query(getSQL, (error, result) => {
            if (error) {
                response.status(200).send({ status: 'Error MySQL', messages: error})
            }
            response.status(200).send(result)
        })
    },

    login: (request, response) => {
        if (request.body.email && request.body.password) {
            let getSQL = `SELECT * FROM USER WHERE 
            email=${db.escape(request.body.email)} AND
            password=${db.escape(request.body.password)}`

            db.query(getSQL, (error, result) => {
                if (error) {
                    response.status(400).send({ status: 'Error MySQL', messages: error})
                }
                if (result.length > 0) {
                    response.status(200).send(result)
                }
                else {
                    response.status(200).send({ status: 'Account Not Found'})
                }
            })
        }
        else {
            response.status(200).send('Parameter not complete')
        }
        // let getSQL = 'SELECT * FROM USER'

        // db.query(getSQL, (error, result) => {
        //     if (error) {
        //         response.status(400).send({ status: 'Error MySQL', messages: error})
        //     }
        //     let email = url.parse(request.url, true).query.email
        //     let password = url.parse(request.url, true).query.password
        //     let data = JSON.parse(JSON.stringify(result))
        //     console.log(data[0].email, data[0].password)
        //     console.log('Email and Password: ', email, password)
        //     let index = data.findIndex((item) => 
        //         item.email === email && item.password === password
        //     )
        //     if (index == -1) {
        //         response.status(400).send("Wrong email or password")
        //     }
        //     if (email || pass) {
        //         console.log(data[index].status)
        //         if (data[index].status === "active") {
        //             if (index > -1) {
        //                 response.status(200).send(data[index])
        //                 console.log("Login Success")
        //             }
        //             else {
        //                 response.status(200).send("Username and Pasword does not match!")
        //                 console.log("Username and Pasword does not match!")
        //             }
        //         }
        //         else {
        //             response.status(200).send("User already deactivate")
        //             console.log("User already deactivate")
        //         }
        //     }
        //     else {
        //         response.status(200).send(data[index])
        //     }
        // })
    },

    register: (request, response) => {
        let username = request.body.username
        let email = request.body.email
        let password = request.body.password
        let role = request.body.role
        let idstatus = request.body.idstatus
        console.log(username, email, password, role, idstatus)
        let getSQL = `SELECT * FROM USER WHERE email='${email}'`
        let postSQL = `INSERT INTO user (username, email, password, role, idstatus) VALUES ('${username}', '${email}', '${password}', '${role}', '${idstatus}');`
        db.query(getSQL, (error, result) => {
            if (error) {
                response.status(500).send({ status: 'Error get MySQL', messages: error})
            }
            let data = JSON.parse(JSON.stringify(result))
            console.log(data.length)
            if (data.length > 0) {
                response.status(200).send('Email already registered!')
            }
            else {
                db.query(postSQL, (error, result) => {
                    if (error) {
                        response.status(400).send({ status: 'Error post MySQL', messages: error})
                    }
                    response.status(200).send('Register Success!')
                })
            }
        })
    }
}