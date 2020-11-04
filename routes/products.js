const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const productController = require('../controllers/products')

router.post('/add', productController.createNewProduct)
router.get('/list', productController.listProduct)
router.patch('/update/:id', productController.updateProduct)


module.exports = router