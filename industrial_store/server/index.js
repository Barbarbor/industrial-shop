
const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const apiRouter = express.Router()
const categoryRouter = require('./api/category');
const productRouter = require('./api/product');
const supplierRouter = require('./api/supplier');
const buyerRouter = require('./api/buyer');
const saleRouter = require('./api/sale');
const supplyRouter = require('./api/supply');
const manufacturerRouter = require('./api/manufacturer')
const sellerRouter = require('./api/seller')
const scheduleRouter = require('./api/schedule')
const salaryRouter = require('./api/salary')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

apiRouter.use('/category', categoryRouter);
apiRouter.use('/product', productRouter);
apiRouter.use('/supplier', supplierRouter);
apiRouter.use('/buyer', buyerRouter);
apiRouter.use('/sale', saleRouter);
apiRouter.use('/supply', supplyRouter);
apiRouter.use('/manufacturer', manufacturerRouter)
apiRouter.use('/seller', sellerRouter)
apiRouter.use('/schedule',scheduleRouter)
apiRouter.use('/salary', salaryRouter)
app.use('/api',apiRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
