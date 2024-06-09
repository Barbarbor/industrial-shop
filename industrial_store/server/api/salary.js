const express = require('express');
const prisma = require('../prisma/prisma');
const salaryRouter = express.Router();

salaryRouter.get('/', async (req, res) => {
    const { month } = req.query;
  
    try {
    
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
      
      const salaries = await prisma.salary.findMany({
        where: {
          month: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          seller: true,
        },
      });
  
      const salaryData = salaries.map((salary) => {
 
        const sellerName = `${salary.seller.name} ${salary.seller.surname}`;
  
        const formattedMonth = startDate.toLocaleDateString('default', { month: 'short', year: 'numeric' });
  
        return {
          id: salary.id,
          sellerId: sellerName,
          month: formattedMonth,
          salesAmount: salary.salesAmount,
          workingHours: salary.workingHours,
          salary: salary.salary
        };
      });
  
      res.status(200).json(salaryData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = salaryRouter;
