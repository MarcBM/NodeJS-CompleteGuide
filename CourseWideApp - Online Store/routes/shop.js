// Node Core Modules
const path = require('path');
// Node-Specific Modules
const express = require('express');
// Custom Controller Modules
const shopController = require('../controllers/shop')

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

// Adding a colon here allows us to tell expressJS to look for a dynamic route.
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;