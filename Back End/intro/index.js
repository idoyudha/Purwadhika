const http = require('http') // same with import
const fs = require('fs')  // manipulate file
const url = require('url') // for query
const PORT = 2000 //http://localhost:2000

// JSON:parse => convert buffer format to object format
// JSON:stringify => convert object format to buffer format

const server = http.createServer((request, response) => {
    // console.log(request.url)
    if (request.url == '/') {
        if (request.method == 'GET') {
            response.writeHead(200, {"Content-Type":"text/html"})
            response.end("<h2>Hello Papa</h2>")
        }
    }
    else if (request.url.includes('/products')) {
        let products = fs.readFileSync('./data/products.json')
        let q = url.parse(request.url, true).query.id
        let index = JSON.parse(products).findIndex((e) => e.id == q)
        if (request.method == 'GET') {
            response.writeHead(200, {"Content-Type":"text/html"})
            let result = JSON.parse(products)[index]
            if (q) {
                if (index > -1) {
                    response.end(JSON.stringify(result))
                }
                else {
                    response.end("Query not found")
                }
            }
            else {
                response.end(products)
            }
        }
        else if (request.method == 'POST') {
            let body = []
            request.on('data', (chunk) => {
                console.log('Data chunk: ', chunk)
                body.push(chunk)
            })
            .on('end', () => {
                body = Buffer.concat(body).toString()
                // console.log(body, JSON.parse(products))
                let result = JSON.parse(products)
                result.push(JSON.parse(body))
                // console.log('Result', result)
                fs.writeFileSync('./data/products.json', JSON.stringify(result))
                response.writeHead(201, {"Content-Type":"text/html"})
                response.end(JSON.stringify(result))
            })
        }
        else if (request.method == "PUT") {
            if (q) {
                let body = []
                request.on('data', (chunk) => {
                    body.push(chunk)
                })
                .on('end', () => {
                    body = JSON.parse(Buffer.concat(body).toString())
                    let result = JSON.parse(products)
                    let index = JSON.parse(products).findIndex((e) => e.id == q)
                    if (index < 0) {
                        response.writeHead(200, {"Content-Type":"text/html"})
                        response.end("Query not found or undefined")
                    }
                    result[index] = body 
                    console.log('Products', result)
                    fs.writeFileSync('./data/products.json', JSON.stringify(result))
                    response.writeHead(200, {"Content-Type":"text/html"})
                    response.end(fs.readFileSync('./data/products.json'))
                })
            }
            else {
                response.writeHead(200, {"Content-Type":"text/html"})
                response.end("Query not found or undefined")
            }
        }
        else if (request.method == 'PATCH') {
            if (q) {
                let body = []
                request.on('data', (chunk) => {
                    body.push(chunk)
                })
                .on('end', () => {
                    body = JSON.parse(Buffer.concat(body).toString())
                    let result = JSON.parse(products)
                    // console.log(result)
                    let index = JSON.parse(products).findIndex((e) => e.id == q)
                    if (index < 0) {
                        response.writeHead(200, {"Content-Type":"text/html"})
                        response.end("Query not found or undefined")
                    }
                    for (let property in result[index]) {
                        for (let bodyProp in body) {
                            if (property == bodyProp) {
                                result[index][property] = body[bodyProp]
                            }
                        }
                    }
                    fs.writeFileSync('./data/products.json', JSON.stringify(result))
                    response.writeHead(200, {"Content-Type":"text/html"})
                    response.end(fs.readFileSync('./data/products.json'))
                })
            }
            else {
                response.writeHead(200, {"Content-Type":"text/html"})
                response.end("Query not found or undefined")
            }
        }
        else if (request.method == 'DELETE') {
            if (q) {
                response.writeHead(200, {"Content-Type":"text/html"})
                let result = JSON.parse(products)
                result.splice(index,1)
                fs.writeFileSync('./data/products.json', JSON.stringify(result))
                response.writeHead(200, {"Content-Type":"text/html"})
                response.end(JSON.stringify(result))
            }
            else {
                response.writeHead(200, {"Content-Type":"text/html"})
                response.end("Query not found")
            }
        }
    }
    else if (request.url.includes('/users')) {
        let users = JSON.parse(fs.readFileSync('./data/users.json'))
        // console.log('User data', users)
        if (request.method == 'GET') {
            // response.end(users)
            let email = url.parse(request.url, true).query.email
            let pass = url.parse(request.url, true).query.pass
            console.log(email, pass)
            if (email || pass) {
                let index = users.findIndex((e) => e.email === email && e.password === pass)
                // let index = users.findIndex((e) => console.log(e.email, email))
                console.log(users[index].status)
                if (users[index].status === "active") {
                    if (index > 0) {
                        response.writeHead(200, {"Content-Type":"text/html"})
                        response.end("Login Success")
                        console.log("Login Success")
                    }
                    else {
                        response.writeHead(500, {"Content-Type":"text/html"})
                        response.end("Username and Pasword not match!")
                        console.log("Username and Pasword not match!")
                    }
                }
                else {
                    response.writeHead(200, {"Content-Type":"text/html"})
                    response.end("User already deactivate")
                    console.log("User already deactivate")
                }
            }
            else {
                response.writeHead(200, {"Content-Type":"text/html"})
                response.end(fs.readFileSync('./data/users.json'))
            }
        }
        else if (request.method == "POST") {
            let body = []
            request.on('data', (chunk) => {
                body.push(chunk)
            })
            .on('end', () => {
                body = JSON.parse(Buffer.concat(body).toString())
                console.log(body.email)
                let index = users.findIndex((e) => e.email === body.email)
                console.log(index)
                if (index > 0) {
                    response.writeHead(200, {"Content-Type":"text/html"})
                    response.end("Email already registered")
                }
                else {
                    users.push(body)
                    fs.writeFileSync('./data/users.json', JSON.stringify(users))
                    response.writeHead(201, {"Content-Type":"text/html"})
                    response.end(JSON.stringify(users))
                }
            })
        }
        else if (request.method == "PATCH") {
            let action = url.parse(request.url, true).query.action
            let email = url.parse(request.url, true).query.email
            let index = users.findIndex((e) => e.email === email)
            // console.log(action, email, index)
            if (action === 'delete') {
                console.log('delete', users[index].email)
                users[index].status = "Inactive"
                console.log("Update data", users)
                fs.writeFileSync('./data/users.json', JSON.stringify(users))
                response.writeHead(200, {"Content-Type":"text/html"})
                response.end(fs.readFileSync('./data/users.json'))
            }
            else if (action === 'update') {
                console.log('update')
            }
        }
    }
    else {
        if (request.method == 'GET') {
            response.writeHead(400, {"Content-Type":"text/html"})
            response.end("<h2>Page Not Found</h2>")
        }
    }

})

server.listen(PORT, () => console.log(`Server Running at ${PORT}`))