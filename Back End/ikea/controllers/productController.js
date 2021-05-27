const { response, request } = require('express')
const fs = require('fs')
const url = require('url')
const { db, dbQuery } = require('../config/database')

module.exports = {
    getProduct: async (request, response) => {
        try {
            let getSQL, dataSearch = []
            let getImage = `SELECT * FROM PRODUCT_IMAGE`
            let getStock = `SELECT * FROM PRODUCT_STOCK JOIN STATUS ON PRODUCT_STOCK.idstatus = STATUS.idstatus`
            for (let prop in request.query) {
                dataSearch.push(`${prop} = ${db.escape(request.query[prop])}`)
                console.log(prop)
            }
            if (dataSearch.length > 0) {
                getSQL = `SELECT * FROM PRODUCT JOIN STATUS ON PRODUCT.idstatus = STATUS.idstatus WHERE ${dataSearch.join(' AND ')};`
            }
            else {
                getSQL = `SELECT * FROM PRODUCT JOIN STATUS ON PRODUCT.idstatus = STATUS.idstatus WHERE PRODUCT.idstatus=1`
            }

            let get = await dbQuery(getSQL)
            let getImg = await dbQuery(getImage)
            let getStck = await dbQuery(getStock)

            get.forEach(item => {
                item.images = []
                getImg.forEach(element => {
                    if (item.idproduct == element.idproduct) {
                        item.images.push(element)
                    }
                })

                item.stock = []
                getStck.forEach(element => {
                    if (item.idproduct == element.idproduct) {
                        item.stock.push(element)
                    }
                });
            });
            response.status(200).send(get)
        }
        catch (error) {
            response.status(500).send({ status: 'Error MySQL', message: error})
        }
    },

    addProduct: async (request, response) => {
        try {
            // console.log(request.body)
            let name = request.body.name
            let brand = request.body.brand
            let description = request.body.description
            let price = request.body.price
            let images = request.body.images
            let stock = request.body.stock
            let postProduct =  `INSERT INTO PRODUCT (name, brand, description, price) VALUES ('${name}', '${brand}', '${description}', ${price});`
            let postImage = `INSERT INTO PRODUCT_IMAGE (idproduct, images) VALUES `
            let postStock = `INSERT INTO PRODUCT_STOCK (idproduct, type, quantity) VALUES `
            let productSQL = await dbQuery(postProduct)
            let multipleInsertImage = []
            let multipleInsertStock = []
            
            if (productSQL.insertId) {
                images.forEach(element => {
                    multipleInsertImage.push(`(${productSQL.insertId}, ${db.escape(element.images)})`)
                });
                stock.forEach(element => {
                    multipleInsertStock.push(`(${productSQL.insertId}, ${db.escape(element.type)}, ${db.escape(element.quantity)})`)
                });
            }
            // console.log(postImage)
            // console.log(multipleInsertImage)
            await dbQuery(postImage + multipleInsertImage)
            await dbQuery(postStock + multipleInsertStock)
            response.status(200).send('All done for Add')
        } catch (error) {
            response.status(500).send({ status: 'Error add to database MySQL', messages: error})
        }
    },

    updateProduct: async (request, response) => {
        try {
            let updateProduct = []
            let all_body = request.body 
            let images = request.body.images
            let stock = request.body.stock
            delete all_body.status
            delete all_body.images
            delete all_body.stock
            for (let property in all_body) {
                updateProduct.push(`${property} = ${db.escape(all_body[property])}`)
            }
            // Update images
            let updateImages = images.map(item => `UPDATE product_image SET images=${db.escape(item.images)} WHERE idproduct_image=${db.escape(item.idproduct_image)};`)
            
            // Update stock
            let updateStock = stock.map(item => `UPDATE product_stock SET type=${db.escape(item.type)}, quantity=${item.quantity} WHERE idproduct_stock=${item.idproduct_stock};`)
            
            // Update product
            let updateSQLProduct = `UPDATE PRODUCT SET ${updateProduct} WHERE (idproduct = '${request.body.idproduct}');
            ${updateImages.join('\n')}
            ${updateStock.join('\n')}`
            console.log(updateSQLProduct)
            
            await dbQuery(updateSQLProduct)
            response.status(200).send('Update success!')
        } catch (error) {
            response.status(500).send({ status: 'Error get MySQL product', messages: error})
        }
    },

    deleteProduct: async (request, response) => {
        console.log('id', request.params.id)
        try {
            let deleteSQL = `UPDATE product SET idstatus = 2 WHERE (idproduct = ${request.params.id})`
            let deletequery = await dbQuery(deleteSQL)
            response.status(200).send({ status: 'Delete success', messages: deletequery})
        } catch (error) {
            response.status(500).send({ status: 'Error get MySQL', messages: error})
        }
    }
}