const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const categoryController = require('../controllers/categories')


router.post('/add', categoryController.createNewCategory)
router.post('/remove', categoryController.deleteCategory)
router.get('/list', categoryController.listCategory)

module.exports = router