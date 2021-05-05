const fs = require('fs')

module.exports = {
    getHomepage: (request, response) => {
        response.status(200).send('Welcome Home!')
    }
}