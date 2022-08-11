const express = require('express');
const router = express.Router();
const productsRouter = require('./products');
const carritoRouter = require('./cart');

router.use('/productos', productsRouter);
router.use('/carrito', carritoRouter);

module.exports = router;