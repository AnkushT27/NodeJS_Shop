const express = require('express');
const path = require('path');
const router = express.Router();
const rootPath = require('../util/path');
const adminController = require('../controllers/admin')

router.get('/add-product',adminController.addProductFormController);
router.post('/product',adminController.addProductController);
router.get('/edit-product',adminController.editProductForm);
router.post('/edit-product',adminController.editProduct);
router.post('/delete-product',adminController.deleteProduct);
router.get('/product',adminController.adminProductList);

module.exports =
{
    "adminRouter": router
}