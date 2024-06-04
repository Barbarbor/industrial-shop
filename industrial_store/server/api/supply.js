const express = require('express');
const prisma = require('../prisma/prisma');
const supplyRouter = express.Router();
async function updateProductStock(productId, quantityChange) {
  const product = await prisma.product.findUnique({where:{id: productId}})
  const oldStock = product.stock
  const newStock = oldStock + quantityChange
  await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock },
  });
}

// Create a supply
supplyRouter.post('/', async (req, res) => {
  try {
    const { productId, supplierId, amount, quantity, deliveredAt } = req.body;
    const [productIdParsed, supplierIdParsed, amountParsed, quantityParsed] = [+productId,+supplierId,+amount,+quantity]
    const supply = await prisma.supply.create({
      data: {
        productId:productIdParsed,
        supplierId:supplierIdParsed,
        amount:amountParsed,
        quantity:quantityParsed,
        deliveredAt: new Date(deliveredAt),
      },
    });
    await updateProductStock(productIdParsed,quantityParsed)
    res.status(201).json(supply);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});

// Read all supplies
supplyRouter.get('/', async (req, res) => {
  try {
    const supplies = await prisma.supply.findMany({
      include: {
        product: true,
        supplier: true,
      },
    });
    const totalQuantity = supplies.reduce((acc, supply) => acc + supply.quantity, 0);
    const totalAmount = supplies.reduce((acc, supply) => acc + supply.amount, 0);
    res.status(200).json({ supplies, totalQuantity, totalAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a supply
supplyRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, supplierId, amount, quantity, deliveredAt } = req.body;
    const [productIdParsed, supplierIdParsed, amountParsed, quantityParsed] = [+productId,+supplierId,+amount,+quantity]
    const oldSupply = await prisma.supply.findUnique({where: {id:parseInt(id)}})
    await updateProductStock(productIdParsed,quantityParsed - oldSupply.quantity)
    const supply = await prisma.supply.update({
      where: { id: parseInt(id) },
      data: {
        productId:productIdParsed,
        supplierId:supplierIdParsed,
        amount:amountParsed,
        quantity:quantityParsed,
        deliveredAt: new Date(deliveredAt),
      },
    });
    
    res.status(200).json(supply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a supply
supplyRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingSupply = await prisma.supply.findUnique({where:{id:+id},include:{product:true}})
    await prisma.supply.delete({
      where: { id: parseInt(id) },
    });
    await updateProductStock(+existingSupply.product.id,-existingSupply.quantity)
    res.status(200).json({ message: 'Supply deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// supply report from date1 to date2
// supplyRouter.js
supplyRouter.post('/report', async (req, res) => {
  const { startDate, endDate, productId, categoryId, manufacturerId, supplierId } = req.body;

  try {
    const whereClause = {
      ...(startDate || endDate) && {
        deliveredAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) || new Date() }),
        },
      },
      ...(productId && { productId: parseInt(productId) }),
      ...(categoryId && {
        product: {
          categoryId: parseInt(categoryId),
        },
      }),
      ...(manufacturerId && {
        product: {
          manufacturerId: parseInt(manufacturerId),
        },
      }),
      ...(supplierId && { supplierId: parseInt(supplierId) }),
    };

    const supplies = await prisma.supply.findMany({
      where: whereClause,
      include: {
        product: true,
        supplier: true,
      },
    });
    const totalQuantity = supplies.reduce((acc, supply) => acc + supply.quantity, 0);
    const totalAmount = supplies.reduce((acc, supply) => acc + supply.amount, 0);

    res.status(200).json({ supplies, totalQuantity, totalAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = supplyRouter;
