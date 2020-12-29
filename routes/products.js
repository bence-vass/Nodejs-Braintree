const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const productController = require('../controllers/products')
const CRUDL = require('../utils/crudl')
const {ProductAttribute} = require('../models/Product')


router.post('/add', productController.createNewProduct)
router.get('/list', productController.listProduct)
router.patch('/update/:id', productController.updateProduct)
router.post('/remove/:id', productController.deleteProduct)
router.get('/:id', productController.getByIdProduct)


router.post('/category/create', productController.createProductCategory)
router.post('/category/navbar', productController.navbarListCategory)


router.post('/attribute/create', productController.createProductAttribute)
router.post('/attribute/delete/:documentId', productController.deleteProductAttribute)
router.post('/attribute/find/:documentId', productController.findOneProductAttribute)
router.post('/attribute/update/:documentId', productController.updateOneProductAttribute)
//router.post('/attribute/list', productController)
let AttribureView = new CRUDL(ProductAttribute, router,'/attr')
AttribureView.createView()
AttribureView.listView()

module.exports = router