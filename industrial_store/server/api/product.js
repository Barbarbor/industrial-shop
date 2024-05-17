const prisma = require('../index')
const express = require('express');
const productApiRouter = express.Router()

const productRouter = express.Router()
productRouter.get('', async(req,res) =>{
    const products = await prisma.product.findMany()
    return res.status(200).json(products)
})
productApiRouter.use('/product',productRouter)
module.exports = productApiRouter