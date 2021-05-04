const { request, response } = require('express')
const fs = require('fs')
const url = require('url') // for query

module.exports = {
    getUsers: (request, response) => {
        let users = JSON.parse(fs.readFileSync('./data/users.json'))
        let email = url.parse(request.url, true).query.email
        let pass = url.parse(request.url, true).query.pass
        console.log('Email and Password', email, pass)
        let index = users.findIndex((e) => e.email === email && e.password === pass)
        console.log('index', index)
        if (index == -1) {
            response.status(200).send("Wrong email or password")
        }
        if (email || pass) {
            console.log(users[index].status)
            if (users[index].status === "active") {
                if (index > -1) {
                    response.status(200).send("Login Success")
                    console.log("Login Success")
                }
                else {
                    response.status(200).send("Username and Pasword does not match!")
                    console.log("Username and Pasword does not match!")
                }
            }
            else {
                response.status(200).send("User already deactivate")
                console.log("User already deactivate")
            }
        }
        else {
            response.status(200).send(users)
        }
        
    },

    postUsers: (request, response) => {
        let users = JSON.parse(fs.readFileSync('./data/users.json'))
        let email = request.body.email
        let index = users.findIndex((e) => e.email === email)
        console.log(index, email)
        if (index < 0) {
            request.body.id = users.length + 1 // auto id increment
            request.body.status = "active"
            users.push(request.body)
            fs.writeFileSync('./data/users.json', JSON.stringify(users))
            response.status(200).send("Registration Success")
        }
        else {
            response.status(200).send("Found same email, try another email")
        }
    },

    patchUsers: (request, response) => {
        let users = JSON.parse(fs.readFileSync('./data/users.json'))
        let action = url.parse(request.url, true).query.action
        let email = url.parse(request.url, true).query.email
        let index = users.findIndex((e) => e.email === email)
        console.log('index', action, email, index)
        if (index > -1) {
            if (action === 'delete') {
                console.log('delete', users[index].email)
                users[index].status = "Inactive"
                console.log("Update data", users)
                fs.writeFileSync('./data/users.json', JSON.stringify(users))
                response.status(200).send("Delete Profile Success")
            }
            else if (action === 'update') {
                console.log('update')
            }
        }
        else {
            response.status(200).send("Unable to find email")
        }
    }
}