
const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const apiRouter = express.Router()

const productApiRouter = require('./api/product')
const categoryApiRouter = require('./api/category')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

apiRouter.use(productApiRouter)
apiRouter.use(categoryApiRouter)

app.use('/api',apiRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
