const express = require('express');
const prisma = require('../prisma/prisma');
const manufacturerRouter = express.Router();
manufacturerRouter.post('/', async (req, res) => {
    try {
      const { name } = req.body;
      const manufacturer = await prisma.manufacturer.create({ data: { name } });
      res.status(201).json(manufacturer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create manufacturer' });
    }
  });
manufacturerRouter.get('/', async (req, res) => {
    try {
      const manufactureries = await prisma.manufacturer.findMany();
      res.status(200).json(manufactureries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch manufactureries' });
    }
  });
manufacturerRouter.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const manufacturer = await prisma.manufacturer.update({
        where: { id: parseInt(id) },
        data: { name },
      });
      res.status(200).json(manufacturer);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update manufacturer' });
    }
  });
  manufacturerRouter.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.manufacturer.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: 'manufacturer deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete manufacturer' });
    }
  });
  
module.exports = manufacturerRouter;
  