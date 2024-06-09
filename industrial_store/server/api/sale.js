const express = require('express');
const prisma = require('../prisma/prisma');
const saleRouter = express.Router();


async function updateProductStock(productId, quantityChange) {
  const updatedProduct = await prisma.product.updateMany({
    where:{id:productId},
    data:{
      stock:{
        increment: quantityChange
      }
    }
  }
  )
}
saleRouter.post('/', async (req, res) => {
  try {
    const { saleDate, buyerId, sellerId, productId, quantity } = req.body;
    const [parsedBuyerId, parsedSellerId, parsedQuantity, parsedProductId] = [+buyerId, +sellerId, +quantity, +productId];
    const product = await prisma.product.findUnique({ where: { id: parsedProductId } });
    const totalAmount = product.price * parsedQuantity;

    const sale = await prisma.sale.create({
      data: {
        saleDate: new Date(saleDate),
        buyerId: parsedBuyerId,
        sellerId: parsedSellerId,
        totalAmount,
        quantity: parsedQuantity,
        productId: parsedProductId,
      },
    });

    await updateProductStock(parsedProductId, -parsedQuantity);

    const month = new Date(new Date(saleDate).getFullYear(), new Date(saleDate).getMonth() + 1, 1);
    const existingSalary = await prisma.salary.findFirst({
      where: { sellerId: parsedSellerId, month },
    });

    if (existingSalary) {
      await prisma.salary.update({
        where: { id: existingSalary.id },
        data: {
          salesAmount: existingSalary.salesAmount + totalAmount,
          sellerId: parsedSellerId,
          workingHours: existingSalary.workingHours, 
        },
      });
    } else {
      await prisma.salary.create({
        data: {
          sellerId: parsedSellerId,
          month,
          workingHours: 0, 
          salesAmount: totalAmount,
        },
      });
    }

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

saleRouter.post('/report', async (req, res) => {
  const { startDate, endDate, buyerId, sellerId, productId } = req.body;

  try {
    const whereClause = {
      ...(startDate && { saleDate: { gte: new Date(startDate) } }),
      ...(endDate && { saleDate: { lte: new Date(endDate) } }),
      ...(buyerId && { buyerId: parseInt(buyerId) }),
      ...(sellerId && { sellerId: parseInt(sellerId) }),
      ...(productId && { productId: parseInt(productId) }),
    };

    const sales = await prisma.sale.findMany({
      where: whereClause,
      include: {
        product: true,
        buyer: true,
        seller: true,
      },
    });

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalQuantity = sales.reduce((acc, sale) => acc + sale.quantity, 0);

    res.status(200).json({ sales, totalRevenue, totalQuantity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

saleRouter.get('/', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        product: true,
        buyer: true,
        seller: true,
      },
    });

    const totalRevenue = sales.reduce((acc, sale) => acc + +sale.totalAmount, 0);
    const totalQuantity = sales.reduce((acc, sale) => acc + +sale.quantity, 0);

    res.status(200).json({ sales, totalRevenue, totalQuantity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

saleRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { saleDate, buyerId, sellerId, productId, quantity } = req.body;
    const [parsedBuyerId, parsedSellerId, parsedQuantity, parsedProductId] = [+buyerId, +sellerId, +quantity, +productId];
    const existingSale = await prisma.sale.findUnique({ where: { id: parseInt(id) } });

    if (!existingSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const product = await prisma.product.findUnique({ where: { id: parsedProductId } });
    const newTotalAmount = product.price * parsedQuantity;
    const amountChange = newTotalAmount - existingSale.totalAmount;
    const quantityChange = parsedQuantity - existingSale.quantity;

    const sale = await prisma.sale.update({
      where: { id: parseInt(id) },
      data: {
        saleDate: new Date(saleDate),
        buyerId: parsedBuyerId,
        sellerId: parsedSellerId,
        totalAmount: newTotalAmount,
        quantity: parsedQuantity,
        productId: parsedProductId,
      },
    });

    await updateProductStock(parsedProductId, quantityChange);

  
    const month = new Date(new Date(saleDate).getFullYear(), new Date(saleDate).getMonth() + 1, 1);
    const existingSalary = await prisma.salary.findFirst({
      where: { sellerId: parsedSellerId, month },
    });

    if (existingSalary) {
      await prisma.salary.update({
        where: { id: existingSalary.id },
        data: {
          salesAmount: existingSalary.salesAmount + amountChange,
          sellerId: parsedSellerId,
          workingHours: existingSalary.workingHours, 
        },
      });
    } else {
      await prisma.salary.create({
        data: {
          sellerId: parsedSellerId,
          month,
          workingHours: 0, 
          salesAmount: newTotalAmount,
        },
      });
    }

    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


saleRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existingSale = await prisma.sale.findUnique({ where: { id: parseInt(id) } });

    if (!existingSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    await prisma.sale.delete({ where: { id: parseInt(id) } });
    await updateProductStock(existingSale.productId, -existingSale.quantity);

 
    const month = new Date(new Date(existingSale.saleDate).getFullYear(), new Date(existingSale.saleDate).getMonth()+1, 1);
    const existingSalary = await prisma.salary.findFirst({
      where: { sellerId: existingSale.sellerId, month },
    });

    if (existingSalary) {
      await prisma.salary.update({
        where: { id: existingSalary.id },
        data: {
          salesAmount: existingSalary.salesAmount - existingSale.totalAmount,
          sellerId: existingSale.sellerId,
          workingHours: existingSalary.workingHours, 
        },
      });
    }

    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = saleRouter;
