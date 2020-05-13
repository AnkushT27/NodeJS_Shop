const express = require('express');
const path = require('path');
const router = express.Router();
const rootPath = require('../util/path')
const adminData = require('./admin');
const shop = require('../controllers/shop');
const isloggedin = require('../routeprotector/isloggedin');
 router.get('/',shop.products);
 router.get('/product',shop.productList);
 router.get('/cart', isloggedin,shop.cartList);
 router.get('/product-details/:productId',shop.productDetails);
 router.post('/cart', isloggedin,shop.cart);
 router.post('/delete-cart', isloggedin,shop.deleteFromCart);
 router.get('/orders',  isloggedin,shop.orders);
 router.post('/orders',  isloggedin,shop.checkout);
 router.get('/checkout',  isloggedin,shop.goToCheckout);
 router.get('/invoice/:orderid',isloggedin,shop.getInvoice);
 router.get('/checkout/cancel',  isloggedin,shop.goToCheckout);
 router.get('/checkout/succcess',  isloggedin,shop.checkout);

module.exports = router;