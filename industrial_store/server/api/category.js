const prisma = require('../prisma/prisma')
const express = require('express');
const categoryApiRouter = express.Router()

const categoryRouter = express.Router()
categoryRouter.get('', async(req,res) =>{
    const categories = await prisma.category.findMany()
    return res.status(200).json(categories)
})

categoryRouter.post('',async (req,res) => {
    try{
    const {name} = req.body

    const category = await prisma.category.create({data:{name:name}})
    return res.status(201).json(category)
    }
    catch(error){
        return res.status(500).json({error:error})
    }
})

categoryRouter.put('/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name } = req.body;
        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(categoryId) },
            data: { name }
        });
        return res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

categoryRouter.delete('/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        await prisma.category.delete({ where: { id: parseInt(categoryId) } });
        return res.status(204).end();
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

categoryApiRouter.use('/category',categoryRouter)
module.exports = categoryApiRouter;