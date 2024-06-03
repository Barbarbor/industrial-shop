const express = require('express');
const prisma = require('../prisma/prisma');
const sellerRouter = express.Router();

// Create a seller
sellerRouter.post('/', async (req, res) => {
  try {
    const { name, surname, role, profitPercentage} = req.body;

    const seller = await prisma.seller.create({
      data: {
        name,
        surname,
        role,
        profitPercentage
        },
      });
    res.status(201).json(seller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all sellers
sellerRouter.get('/', async (req, res) => {
  try {
    const sellers = await prisma.seller.findMany({});
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a seller
sellerRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surname, profitPercentage, role} = req.body;

    const seller = await prisma.seller.update({
      where: { id: parseInt(id) },
      data: {
        name,
        surname,
        profitPercentage,
        role,
        },
      });
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update seller' });
  }
});

// Delete a seller
sellerRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.seller.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete seller' });
  }
});

module.exports = sellerRouter;
