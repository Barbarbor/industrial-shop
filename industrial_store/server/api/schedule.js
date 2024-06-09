const express = require('express');
const prisma = require('../prisma/prisma'); // Assuming you have a Prisma setup file
const scheduleRouter = express.Router();

// Create a new schedule
const calculateWorkingHours = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    const end = new Date(`1970-01-01T${endTime}:00Z`);
    const hours = (end - start) / 1000 / 60 / 60; // Convert milliseconds to hours
    return Math.floor(hours);
  };
  
  // Create a new schedule
  scheduleRouter.post('/', async (req, res) => {
    const { day, startTime, endTime, sellerId } = req.body;

    try {
        // Create new schedule
        const newSchedule = await prisma.workSchedule.create({
            data: {
                day: new Date(day),
                startTime,
                endTime,
                sellerId: +sellerId
            },
        });

        // Calculate working hours
        const workingHours = calculateWorkingHours(startTime, endTime);

        // Determine the month of the schedule
        const month = new Date(new Date(day).getFullYear(), new Date(day).getMonth() +1, 1);

        // Find existing salary record for the month
        const existingSalary = await prisma.salary.findFirst({
            where: { sellerId, month  },
        });

        if (existingSalary) {
            const salesAmount = existingSalary.salesAmount
            const workinghrs = existingSalary.workingHours
            const newWorkingHours = workinghrs + workingHours
            // Update existing salary record
            await prisma.salary.update({
                where: { id: existingSalary.id },
                data: {
                    workingHours: newWorkingHours,
                    sellerId: +sellerId,
                    salesAmount

                },
            });
        } else {
            // Create new salary record
            await prisma.salary.create({
                data: {
                    sellerId: +sellerId,
                    month,
                    workingHours,
                    salesAmount: 0, // Assume salesAmount will be updated separately
                },
            });
        }

        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(500).json({ error: error.message }); // Provide detailed error message
    }
});


// Get all schedules
scheduleRouter.get('/', async (req, res) => {
  try {
    const schedules = await prisma.workSchedule.findMany({
      include: {
        seller: true,
      },
    });

    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
scheduleRouter.post('/filters', async (req, res) => {
    const { sellerId, startTime, endTime } = req.body;
  
    try {
      const filters = {};
  
      if (sellerId) {
        filters.sellerId = sellerId;
      }
  
      if (startTime && endTime) {
        filters.day = {
          gte: new Date(startTime),
          lte: new Date(endTime),
        };
      }
  
      const filteredSchedules = await prisma.workSchedule.findMany({
        where: filters,
        include: {
          seller: true,
        },
      });
  
      res.status(200).json(filteredSchedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
// Get schedule by ID
scheduleRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await prisma.workSchedule.findUnique({
      where: { id: parseInt(id) },
      include: {
        seller: true,
      },
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a schedule
scheduleRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { day, startTime, endTime, sellerId } = req.body;
  
    try {
      const oldSchedule = await prisma.workSchedule.findUnique({ where: { id: parseInt(id) } });
  
      if (!oldSchedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
  
      const oldWorkingHours = calculateWorkingHours(oldSchedule.startTime, oldSchedule.endTime);
      const newWorkingHours = calculateWorkingHours(startTime, endTime);
      const workingHoursDifference = newWorkingHours - oldWorkingHours;
  
      const updatedSchedule = await prisma.workSchedule.update({
        where: { id: parseInt(id) },
        data: {
          day: new Date(day),
          startTime,
          endTime,
          sellerId,
        },
      });
  
     
      const month = new Date(new Date(day).getFullYear(), new Date(day).getMonth() +1, 1);
      const salaryInfo = await prisma.salary.findFirst({where:{sellerId: +sellerId, month }})
      if(!salaryInfo){
        await prisma.salary.create({
          data: {
              sellerId: +sellerId,
              month,
              workingHours:newWorkingHours,
              salesAmount: 0, 
          },
      })
    }
    else{
      const workingHours = salaryInfo.workingHours + workingHoursDifference
      const salesAmount = salaryInfo.salesAmount
      await prisma.salary.update({
        where: {  id: +salaryInfo.id },
        data: {
          workingHours,
          salesAmount,
          sellerId
        },
      });
    }
      res.status(200).json(updatedSchedule);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete a schedule
  scheduleRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const oldSchedule = await prisma.workSchedule.findUnique({ where: { id: parseInt(id) } });

      if (!oldSchedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      
  
      const workingHours = calculateWorkingHours(oldSchedule.startTime, oldSchedule.endTime);
      const month = new Date(new Date(oldSchedule.day).getFullYear(), new Date(oldSchedule.day).getMonth() +1, 1);

      const salaryInfo = await prisma.salary.findFirst({where:{sellerId: +oldSchedule.sellerId, month }})
      await prisma.workSchedule.delete({
        where: { id: parseInt(id) },
      });
  
      if(!salaryInfo){
        await prisma.salary.create({
          data: {
              sellerId: +oldSchedule.sellerId,
              month,
              workingHours:0,
              salesAmount: 0, 
          },
      })
    }
    else {
      const newWorkingHours = salaryInfo.workingHours - workingHours
      const salesAmount = salaryInfo.salesAmount
      await prisma.salary.update({
        where: { id: +salaryInfo.id },
        data: {
          workingHours: newWorkingHours,
          sellerId: oldSchedule.sellerId,
          salesAmount
        },
      });
    }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = scheduleRouter;
