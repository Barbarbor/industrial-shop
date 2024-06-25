const prisma = require('../prisma/prisma');
const categories = require('./categories');
const suppliers = require('./suppliers');
const manufacturers = require('./manufacturers');
const products = require('./products');
const { maleNames, femaleNames } = require('./names');
const { maleSurnames, femaleSurnames } = require('./surnames');
const roles = require('./roles');

const updateProductStock = async (productId, quantityChange) => {
  await prisma.product.updateMany({
    where: { id: productId },
    data: { stock: { increment: quantityChange } }
  });
};

const calculateWorkingHours = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}:00Z`);
  const end = new Date(`1970-01-01T${endTime}:00Z`);
  
  const hours = (end - start) / 1000 / 60 / 60; 
  return Math.floor(hours);
};

const generateData = async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "Seller", "WorkSchedule", "Salary", "Product", "Category", "Manufacturer", "Supplier", "Buyer", "Supply", "Sale" RESTART IDENTITY CASCADE;`;

  const categoriesData = categories.map(name => ({ name }));
  const manufacturersData = manufacturers.map(name => ({ name }));
  const suppliersData = suppliers.map(name => ({ name }));

  await prisma.category.createMany({ data: categoriesData });
  await prisma.manufacturer.createMany({ data: manufacturersData });
  await prisma.supplier.createMany({ data: suppliersData });

  const categoriesDb = await prisma.category.findMany();
  const manufacturersDb = await prisma.manufacturer.findMany();
  const suppliersDb = await prisma.supplier.findMany();

  const buyers = Array.from({ length: 200 }).map((_, index) => ({
    name: index % 2 === 0 ? femaleNames[Math.floor(Math.random() * 25)] : maleNames[Math.floor(Math.random() * 25)],
    surname: index % 2 === 0 ? femaleSurnames[Math.floor(Math.random() * 25)] : maleSurnames[Math.floor(Math.random() * 25)],
    ageGroup: ['18-25', '26-35', '36-45', '46-60', '60+'][Math.floor(Math.random() * 5)],
    gender: index % 2 === 0 ? 'женский' : 'мужской'
  }));

  await prisma.buyer.createMany({ data: buyers });
  const buyersDb = await prisma.buyer.findMany();

  const productsData = Array.from({ length: 70 }).map((_,index) => ({
    name: products[index],
    price: Math.floor(Math.random() * 9900) + 100,
    stock: Math.floor(Math.random() * 50) + 10,
    categoryId: categoriesDb[Math.floor(Math.random() * categoriesDb.length)].id,
    manufacturerId: manufacturersDb[Math.floor(Math.random() * manufacturersDb.length)].id,
  }));

  await prisma.product.createMany({ data: productsData });
  const productsDb = await prisma.product.findMany();

  const sellers = Array.from({ length: 30 }).map((_, index) => {
    const roleName = Object.keys(roles)[Math.floor(Math.random() * Object.keys(roles).length)];
    return {
      name: index % 2 === 0 ? femaleNames[Math.floor(index / 2)] : maleNames[Math.floor(index / 2)],
      surname: index % 2 === 0 ? femaleSurnames[Math.floor(index / 2)] : maleSurnames[Math.floor(index / 2)],
      profitPercentage: roles[roleName],
      role: roleName,
    };
  });

  await prisma.seller.createMany({ data: sellers });
  const sellersDb = await prisma.seller.findMany();

  const workSchedules = Array.from({ length: 500 }).map(() => {
    const startHour = Math.floor(Math.random() * 9) + 8;
    const endHour = Math.max(startHour + 4, Math.floor(Math.random() * 12) + 12);
    const startTime = `${startHour.toString().padStart(2, '0')}:00`;
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;

    return {
      day: new Date(new Date().getTime() - Math.floor(Math.random() * 10000000000)),
      startTime,
      endTime,
      sellerId: sellersDb[Math.floor(Math.random() * sellersDb.length)].id
    };
  });
  const supplies = Array.from({ length: 500 }).map(() => ({
    productId: productsDb[Math.floor(Math.random() * productsDb.length)].id,
    supplierId: suppliersDb[Math.floor(Math.random() * suppliersDb.length)].id,
    quantity: Math.floor(Math.random() * 21) + 10,
    amount: Math.floor(Math.random() * 20001) + 10000,
    deliveredAt: new Date(new Date().getTime() - Math.floor(Math.random() * 10000000000)) 
  }));

  const sales = Array.from({ length: 500 }).map(() => ({
    totalAmount: Math.floor(Math.random() * 25001) + 10000,
    saleDate: new Date(new Date().getTime() - Math.floor(Math.random() * 10000000000)),
    quantity: Math.floor(Math.random() * 3) + 1,
    buyerId: buyersDb[Math.floor(Math.random() * buyersDb.length)].id,
    sellerId: sellersDb[Math.floor(Math.random() * sellersDb.length)].id,
    productId: productsDb[Math.floor(Math.random() * productsDb.length)].id
  }));

  for (const schedule of workSchedules) {
    const { startTime, endTime, day, sellerId } = schedule;
    const workingHours = calculateWorkingHours(startTime, endTime);
    const month = new Date(new Date(day).getFullYear(), new Date(day).getMonth() + 1, 1);
    const existingSalary = await prisma.salary.findFirst({ where: { sellerId, month } });
    if (existingSalary) {
      const { salesAmount, workingHours: existingHours } = existingSalary;
      await prisma.salary.update({
        where: { id: existingSalary.id },
        data: {
          workingHours: existingHours + workingHours,
          sellerId,
          salesAmount
        },
      });
    } else {
      await prisma.salary.create({
        data: {
          sellerId,
          month,
          workingHours,
          salesAmount: 0,
        },
      });
    }
    await prisma.workSchedule.create({ data: schedule });
  }

  for (const supply of supplies) {
    const { productId, quantity } = supply;
    await updateProductStock(productId, quantity);
    await prisma.supply.create({ data: supply });
  }

  for (const sale of sales) {
    const { productId, quantity, sellerId, totalAmount, saleDate } = sale;
    await updateProductStock(productId, -quantity);

    const month = new Date(new Date(saleDate).getFullYear(), new Date(saleDate).getMonth() + 1, 1);
    const existingSalary = await prisma.salary.findFirst({ where: { sellerId, month } });

    if (existingSalary) {
      await prisma.salary.update({
        where: { id: existingSalary.id },
        data: {
          salesAmount: existingSalary.salesAmount + totalAmount,
          sellerId,
          workingHours: existingSalary.workingHours,
        },
      });
    } else {
      await prisma.salary.create({
        data: {
          sellerId,
          month,
          workingHours: 0,
          salesAmount: totalAmount,
        },
      });
    }
    await prisma.sale.create({ data: sale });
  }

  console.log('Data generation complete!');
};

generateData()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
