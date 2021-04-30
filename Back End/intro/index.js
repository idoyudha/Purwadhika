const http = require('http') // same with import
const fs = require('fs')
const url = require('url') // for query
const PORT = 2000

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
                    response.end("<h2>Query not found</h2>")
                }
            }
            else {
                response.end(products)
            }
        }
        else if (request.method == 'DELETE') {
            response.writeHead(200, {"Content-Type":"text/html"})
            let result = JSON.parse(products)
            result.splice(index,1)
            response.end(JSON.stringify(result))
        }
    }
    else if (request.url.includes('/users')) {
        let users = fs.readFileSync('./data/users.json')
        if (request.method == 'GET') {
            response.writeHead(200, {"Content-Type":"text/html"})
            response.end(users)
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