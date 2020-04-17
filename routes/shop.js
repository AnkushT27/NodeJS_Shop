const express = require('express');
const path = require('path');
const router = express.Router();
const rootPath = require('../util/path')
const adminData = require('./admin');
const shop = require('../controllers/shop');
 router.get('/',shop.products);
 router.get('/product',shop.productList);
 router.get('/cart',shop.cartList);
 router.get('/product-details/:productId',shop.productDetails);
 router.post('/cart',shop.cart);
 router.post('/delete-cart',shop.deleteFromCart);
 router.get('/orders',shop.orders);
 router.post('/orders',shop.checkout);


module.exports = router;