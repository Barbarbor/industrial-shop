const express = require('express');
const prisma = require('../prisma/prisma');
const buyerRouter = express.Router();

buyerRouter.post('/', async (req, res) => {
  try {
    const { name, surname, ageGroup, gender} = req.body;

    const buyer = await prisma.buyer.create({
      data: {
        name,
        surname,
        ageGroup,
        gender,
        },
      });
    res.status(201).json(buyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

buyerRouter.get('/', async (req, res) => {
  try {
    const buyers = await prisma.buyer.findMany({});
    res.status(200).json(buyers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch buyers' });
  }
});

buyerRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surname, ageGroup, gender} = req.body;

    const buyer = await prisma.buyer.update({
      where: { id: parseInt(id) },
      data: {
        name,
        surname,
        ageGroup,
        gender,
        },
      });
    res.status(200).json(buyer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update buyer' });
  }
});

buyerRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.buyer.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Buyer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete buyer' });
  }
});

module.exports = buyerRouter;
