const express = require('express');
const prisma = require('../prisma/prisma');
const supplierRouter = express.Router();

supplierRouter.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const supplier = await prisma.supplier.create({ data: { name } });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

supplierRouter.get('/', async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

supplierRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const supplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

supplierRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.supplier.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

module.exports = supplierRouter;
