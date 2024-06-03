const express = require('express');
const prisma = require('../prisma/prisma');
const salaryRouter = express.Router();

// Get all salaries for a specific month
salaryRouter.get('/', async (req, res) => {
    const { month } = req.query;
  
    try {
      // Parse the month from the query string and set it to the first day of the month
      const startDate = new Date(`${month}-01`);
      // Calculate the last day of the month
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
      
      // Query salaries for the entire month
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
        // Calculate the salary based on the provided formula
        
        
        // Format the seller's name
        const sellerName = `${salary.seller.name} ${salary.seller.surname}`;
  
        // Format the month
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
