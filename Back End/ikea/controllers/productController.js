const { db, dbQuery, uploader } = require('../config')
const fs = require('fs')

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

    addProduct: async (request, response, next) => {
        try {
            // // console.log(request.body)
            // let name = request.body.name
            // let brand = request.body.brand
            // let description = request.body.description
            // let price = request.body.price
            // let images = request.body.images
            // let stock = request.body.stock
            // let postProduct =  `INSERT INTO PRODUCT (name, brand, description, price) VALUES ('${name}', '${brand}', '${description}', ${price});`
            // let postImage = `INSERT INTO PRODUCT_IMAGE (idproduct, images) VALUES `
            // let postStock = `INSERT INTO PRODUCT_STOCK (idproduct, type, quantity) VALUES `
            // let productSQL = await dbQuery(postProduct)
            // let multipleInsertImage = []
            // let multipleInsertStock = []
            
            // // Get all idcategory from child -> parent 
            // let getCategory = `WITH RECURSIVE category_path (id, title, parent_id) AS 
            // (
            //     SELECT idcategory, category, parent_id
            //         FROM category 
            //         WHERE idcategory = ${request.body.idcategory}
            //     UNION ALL
            //     SELECT c.idcategory, c.category, c.parent_id
            //         FROM category_path AS cp JOIN category AS c 
            //         ON cp.parent_id = c.idcategory
            // )
            // SELECT * FROM category_path;`
            
            // getCategory = await dbQuery(getCategory)
            // // console.log('getCategory', getCategory)
            // // response.status(200).send(getCategory)
            // if (productSQL.insertId) {
            //     getCategory = getCategory.map(item => [productSQL.insertId, item.id])
            //     console.log(getCategory)
            //     let insertCategory = `INSERT INTO product_category (idproduct, idcategory) VALUES ?`
            //     await dbQuery(insertCategory, [getCategory])

            //     stock.forEach(element => {
            //         multipleInsertStock.push(`(${productSQL.insertId}, ${db.escape(element.type)}, ${db.escape(element.quantity)})`)
            //     });
            // }
            // images.forEach(element => {
            //     multipleInsertImage.push(`(${productSQL.insertId}, ${db.escape(element.images)})`)
            // });

            // console.log('Goto backend', request)
            const upload = uploader('/images', 'IMG').fields([{ name: 'images' }])

            upload(request, response, async (err) => {
                // error upload
                // if (error) {
                //     next(error)
                // }

                try {
                    // console.log(JSON.parse(request.body.data))
                    let data = JSON.parse(request.body.data)
                    console.log("JSON data", data)
                    let name = db.escape(data.name)
                    let brand = db.escape(data.brand)
                    let description = db.escape(data.description)
                    let price = db.escape(data.price)
                    let stock = data.stock
                    let postProduct =  `INSERT INTO PRODUCT (name, brand, description, price) VALUES (${name}, ${brand}, ${description}, ${price});`
                    let productSQL = await dbQuery(postProduct)
                    let multipleInsertStock = []

                    // Get all idcategory from child -> parent 
                    let getCategory = `WITH RECURSIVE category_path (id, title, parent_id) AS 
                    (
                        SELECT idcategory, category, parent_id
                            FROM category 
                            WHERE idcategory = ${data.idcategory}
                        UNION ALL
                        SELECT c.idcategory, c.category, c.parent_id
                            FROM category_path AS cp JOIN category AS c 
                            ON cp.parent_id = c.idcategory
                    )
                    SELECT * FROM category_path;`
                    // console.log("get Category", getCategory)
                    const { images } = request.files 
                    console.log("cek file upload :", images)

                    let image = request.files.images[0].filename
                    getCategory = await dbQuery(getCategory)

                    if (productSQL.insertId) {
                        getCategory = getCategory.map(item => [productSQL.insertId, item.id])
                        console.log(getCategory)
                        let insertCategory = `INSERT INTO product_category (idproduct, idcategory) VALUES ?`
                        await dbQuery(insertCategory, [getCategory])

                        // stock.forEach(element => {
                        //     multipleInsertStock.push(`(${productSQL.insertId}, ${db.escape(element.type)}, ${db.escape(element.quantity)})`)
                        // });

                        // image.forEach(element => {
                        //     multipleInsertImage.push(`(${productSQL.insertId}, ${db.escape(element.images)})`)
                        // });

                        let postImage = `INSERT INTO PRODUCT_IMAGE (idproduct, images) VALUES (${productSQL.insertId}, ${db.escape('/images/' + image)})`
                        let postStock = `INSERT INTO PRODUCT_STOCK (idproduct, type, quantity) VALUES (${productSQL.insertId}, ${db.escape(stock[0].type)}, ${db.escape(stock[0].quantity)})`

                        await dbQuery(postImage)
                        await dbQuery(postStock)
                    }

                } catch (error) {
                    // delete image when upload process error
                    fs.unlinkSync(`./public/images/${request.files.images[0].filename}`)
                    // error catch from query
                    console.log(error)
                    // error from upload function
                    next(err)
                }

            })
 
            // await dbQuery(postImage + multipleInsertImage)
            // await dbQuery(postStock + multipleInsertStock)
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
            // console.log(updateSQLProduct)
            
            await dbQuery(updateSQLProduct)
            response.status(200).send('Update success!')
        } catch (error) {
            response.status(500).send({ status: 'Error get MySQL product', messages: error})
        }
    },

    deleteProduct: async (request, response) => {
        // console.log('id', request.params.id)
        try {
            let deleteSQL = `UPDATE product SET idstatus = 2 WHERE (idproduct = ${request.params.id})`
            let deletequery = await dbQuery(deleteSQL)
            response.status(200).send({ status: 'Delete success', messages: deletequery})
        } catch (error) {
            response.status(500).send({ status: 'Error get MySQL', messages: error})
        }
    },

    printCategory: async (request, response) => {
        try {
            let getCategory = `SELECT c1.idcategory, c1.category 
            FROM category c1 LEFT JOIN category c2 ON c2.parent_id = c1.idcategory
            WHERE c2.idcategory IS NULL;` 
            let categoryQuery = await dbQuery(getCategory)
            response.status(200).send(categoryQuery)
        } 
        catch (error) {
            response.status(500).send({ status: 'Error get category', messages: error})
        }
    }
}

// Add product data
// {
//     "name": "SOALLIS",
//     "description": "Memberikan pencahayaan menyebar, baik untuk menerangi bagian besar di kamar mandi.",
//     "brand": "IKEA",
//     "price": 649000,
//     "stock": [{
//         "idproduct": 46,
//         "type": "bath lamp",
//         "quantity": 5
//     }],
//     "images": [{
//         "images": "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/306/0730612_PE737651_S5.jpg",
//         "idproduct": 46
//     }],
//     "idcategory": 5
// }