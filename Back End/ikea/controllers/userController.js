const fs = require('fs')

module.exports = {
    getUser: (request, response) => {
        response.status(200).send('Welcome User!')
    },

    login: (request, response) => {
        response.status(200).send('Login')
    },

    register: (request, response) => {
        response.status(200).send('Register')
    }
}