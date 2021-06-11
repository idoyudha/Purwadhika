const jwt = require('jsonwebtoken')


// Middleware or method function to make token
module.exports = {
    createToken: (payload) => {
        return jwt.sign(payload, "ikea$", {
            expiresIn: '12h'
        })
    },
    
    readToken: (request, response, next) => {
        // console.log('Request read token',request.token)
        jwt.verify(request.token, "ikea$", (error, decoded) => {
            if (error) {
                return response.status(401).send('User not authorization')
            }

            // Translated data token
            request.user = decoded 

            next()
        })
    }
}