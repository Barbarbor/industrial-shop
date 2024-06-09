const { PrismaClient, Prisma } = require('@prisma/client');
const { z } = require('zod');

const SellerSchema = z.object({
  name: z.string().max(100),
  surname: z.string().max(100),
  profitPercentage: z.number().gte(0).lte(100),
  role: z.string().max(50),
});

const WorkScheduleSchema = z.object({
  day: z.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/), 
  endTime: z.string().regex(/^\d{2}:\d{2}$/),   
  sellerId: z.number().int(),
});

const SalarySchema = z.object({
  workingHours: z.number().int().gte(0),
  sellerId: z.number().int(),
  salesAmount: z.number().int().gte(0),
  salary: z.number().int().gte(0).optional(),
  month: z.date(),
});

const ProductSchema = z.object({
  name: z.string().max(255),
  price: z.number().int().gte(0),
  stock: z.number().int().gte(0),
  categoryId: z.number().int(),
  manufacturerId: z.number().int(),
});

const CategorySchema = z.object({
  name: z.string().max(100),
});

const ManufacturerSchema = z.object({
  name: z.string().max(100),
});

const SupplierSchema = z.object({
  name: z.string().max(100),
});

const BuyerSchema = z.object({
  name: z.string().max(100),
  surname: z.string().max(100),
  ageGroup: z.string().max(50),
  gender: z.string().max(10),
});

const SupplySchema = z.object({
  productId: z.number().int(),
  supplierId: z.number().int(),
  quantity: z.number().int().gte(0),
  amount: z.number().int().gte(0),
  deliveredAt: z.date(),
});

const SaleSchema = z.object({
  totalAmount: z.number().int().gte(0),
  saleDate: z.date().default(() => new Date()),
  quantity: z.number().int().gte(0),
  buyerId: z.number().int(),
  sellerId: z.number().int(),
  productId: z.number().int(),
});

const prisma = new PrismaClient();


prisma.$use(async (params, next) => {
  if (params.model === 'Salary' && (params.action === 'create' || params.action === 'update')) {
    const salaryData = params.args.data;

 
    const seller = await prisma.seller.findFirst({
      where: { id: salaryData.sellerId },
    });

    const newSalary = salaryData.workingHours * 200 + Math.floor(salaryData.salesAmount * seller.profitPercentage * 0.01);

    params.args.data.salary = newSalary;
  }

  return next(params);
});

const extendedPrisma = prisma.$extends({
  query: {
    seller: {
      create({ args, query }) {
        args.data = SellerSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = SellerSchema.partial().parse(args.data);
        return query(args);
      },
    },
    workSchedule: {
      create({ args, query }) {
        args.data = WorkScheduleSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = WorkScheduleSchema.partial().parse(args.data);
        return query(args);
      },
    },
    salary: {
      create({ args, query }) {
        args.data = SalarySchema.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = SalarySchema.partial().parse(args.data);
        return query(args);
      },
    },
    product: {
      create({ args, query }) {
        args.data = ProductSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = ProductSchema.partial().parse(args.data);
        return query(args);
      },
    },
    category: {
      create({ args, query }) {
        args.data = CategorySchema.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = CategorySchema.partial().parse(args.data);
        return query(args);
      },
    },
    manufacturer: {
      create({ args, query }) {
        args.data = ManufacturerSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = ManufacturerSchema.partial().parse(args.data);
        return query(args);
      },
    },
    supplier: {
      create({ args, query }) {
        args.data = SupplierSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = SupplierSchema.partial().parse(args.data);
        return query(args);
      },
    },
    buyer: {
      create({ args, query }) {
        args.data = BuyerSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = BuyerSchema.partial().parse(args.data);
        return query(args);
      },
    },
    supply: {
      create({ args, query }) {
        args.data = SupplySchema.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = SupplySchema.partial().parse(args.data);
        return query(args);
      },
    },
    sale: {
      create({ args, query }) {
        args.data = SaleSchema.parse(args.data);
        return query(args);
      },
      update({ args, query }) {
        args.data = SaleSchema.partial().parse(args.data);
        return query(args);
      },
    },
  },
});

module.exports = extendedPrisma;
