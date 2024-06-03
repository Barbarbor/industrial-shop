const express = require('express');
const prisma = require('../prisma/prisma');
const productRouter = express.Router();

// Create a product
productRouter.post('/', async (req, res) => {
  try {
    const { name, price, stock, categoryId, manufacturerId } = req.body;
    const parsedPrice = +price
    const parsedStock = +stock 
    const parsedCategoryId = +categoryId
    const parsedManufacturerId = +manufacturerId
    const product = await prisma.product.create({
      data: {
        name,
        price:parsedPrice,
        stock:parsedStock,
        categoryId:parsedCategoryId,
        manufacturerId:parsedManufacturerId,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all products
productRouter.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
productRouter.post('/filters', async (req, res) => {
  const { categoryId, manufacturerId, name } = req.body;

  try {
    const whereClause = {
      ...(categoryId && { categoryId: parseInt(categoryId) }),
      ...(manufacturerId && { manufacturerId: parseInt(manufacturerId) }),
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
    };

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        manufacturer: true,
      },
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read products by name
productRouter.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products by name' });
  }
});
// Update a product
productRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price,  stock, categoryId, manufacturerId } = req.body;
    const parsedPrice = +price
    const parsedStock = +stock 
    const parsedCategoryId = +categoryId
    const parsedManufacturerId = +manufacturerId
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price:parsedPrice,
        stock:parsedStock,
        categoryId:parsedCategoryId,
        manufacturerId:parsedManufacturerId,
      },
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
productRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = productRouter;
