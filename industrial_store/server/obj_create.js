const prisma = require('./prisma/prisma');

const generateData = async () => {
  // Clear existing data
  await prisma.$executeRaw`TRUNCATE TABLE "Seller", "WorkSchedule", "Salary", "Product", "Category", "Manufacturer", "Supplier", "Buyer", "Supply", "Sale" RESTART IDENTITY CASCADE;`;

  // Data for categories, manufacturers, and suppliers
  const categoryNames = ['Электроника', 'Одежда', 'Техника для кухни', 'Книги', 'Игрушки'];
  const manufacturerNames = ['Компания 1', 'Компания 2', 'Компания 3', 'Компания 4', 'Компания 5'];
  const supplierNames = ['Поставщик 1', 'Поставщик 2', 'Поставщик 3', 'Поставщик 4', 'Поставщик 5'];
  
  // Generate data for tables without foreign keys
  const categories = categoryNames.map(name => ({ name }));
  const manufacturers = manufacturerNames.map(name => ({ name }));
  const suppliers = supplierNames.map(name => ({ name }));
  
  const buyers = Array.from({ length: 30 }).map(() => ({
    name: `Buyer_${Math.floor(Math.random() * 10000)}`,
    surname: `Surname_${Math.floor(Math.random() * 10000)}`,
    ageGroup: ['18-25', '26-35', '36-45', '46-60', '60+'][Math.floor(Math.random() * 5)],
    gender: ['мужской', 'женский'][Math.floor(Math.random() * 2)],
  }));

  // Insert data into non-foreign key tables
  await prisma.category.createMany({ data: categories });
  await prisma.manufacturer.createMany({ data: manufacturers });
  await prisma.supplier.createMany({ data: suppliers });
  await prisma.buyer.createMany({ data: buyers });

  // Retrieve inserted data for foreign key references
  const categoriesDb = await prisma.category.findMany();
  const manufacturersDb = await prisma.manufacturer.findMany();
  const suppliersDb = await prisma.supplier.findMany();
  const buyersDb = await prisma.buyer.findMany();

  // Data for products
  const productNames = ['Кассета', 'Платье', 'Тостер', 'Телефон', 'Книга', 'Игрушка', 'Часы', 'Фен', 'Компьютер', 'Ноутбук'];
  
  // Generate data for tables with foreign keys
  const products = Array.from({ length: 100000}).map(() => ({
    name: productNames[Math.floor(Math.random() * productNames.length)],
    price: Math.floor(Math.random() * 9900) + 100,
    stock: Math.floor(Math.random() * 1000) + 1,
    categoryId: categoriesDb[Math.floor(Math.random() * categoriesDb.length)].id,
    manufacturerId: manufacturersDb[Math.floor(Math.random() * manufacturersDb.length)].id,
  }));

  const sellers = Array.from({ length: 50 }).map(() => ({
    name: `Seller_${Math.floor(Math.random() * 10000)}`,
    surname: `Surname_${Math.floor(Math.random() * 10000)}`,
    profitPercentage: Math.floor(Math.random() * 101),
    role: `Role_${Math.floor(Math.random() * 10000)}`,
  }));

  // Insert data into foreign key tables
  await prisma.product.createMany({ data: products });
  await prisma.seller.createMany({ data: sellers });

  // Retrieve inserted data for further foreign key references
  const productsDb = await prisma.product.findMany();
  const sellersDb = await prisma.seller.findMany();

  const workSchedules = Array.from({ length: 100000 }).map(() => ({
    day: new Date(new Date().getTime() - Math.floor(Math.random() * 10000000000)).toISOString(), // Random date within the past
    startTime: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    endTime: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    sellerId: sellersDb[Math.floor(Math.random() * sellersDb.length)].id,
  }));

 

  const supplies = Array.from({ length: 50000 }).map(() => ({
    productId: productsDb[Math.floor(Math.random() * productsDb.length)].id,
    supplierId: suppliersDb[Math.floor(Math.random() * suppliersDb.length)].id,
    quantity: Math.floor(Math.random() * 1000) + 1,
    amount: Math.floor(Math.random() * 9901) + 100,
    deliveredAt: new Date(new Date().getTime() - Math.floor(Math.random() * 10000000000)).toISOString(), // Random date within the past
  }));

  const sales = Array.from({ length: 75000 }).map(() => ({
    totalAmount: Math.floor(Math.random() * 9901) + 100,
    saleDate: new Date(new Date().getTime() - Math.floor(Math.random() * 10000000000)).toISOString(), // Random date within the past
    quantity: Math.floor(Math.random() * 100) + 1,
    buyerId: buyersDb[Math.floor(Math.random() * buyersDb.length)].id,
    sellerId: sellersDb[Math.floor(Math.random() * sellersDb.length)].id,
    productId: productsDb[Math.floor(Math.random() * productsDb.length)].id,
  }));

  // Insert data into remaining foreign key tables
  await prisma.workSchedule.createMany({ data: workSchedules }); 
  await prisma.supply.createMany({ data: supplies });
  await prisma.sale.createMany({ data: sales });

  console.log('Data generation complete!');
};

generateData()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
