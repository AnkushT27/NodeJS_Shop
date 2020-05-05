const express = require('express');
const path = require('path');
const router = express.Router();
const rootPath = require('../util/path');
const adminController = require('../controllers/admin')
const isloggedin = require('../routeprotector/isloggedin');


router.get('/add-product',  isloggedin,adminController.addProductFormController);
router.post('/product',  isloggedin,adminController.addProductController);
router.get('/edit-product',  isloggedin,adminController.editProductForm);
router.post('/edit-product',  isloggedin,adminController.editProduct);
router.post('/delete-product',  isloggedin,adminController.deleteProduct);
router.get('/product',  isloggedin,adminController.adminProductList);

module.exports =
{
    "adminRouter": router
}