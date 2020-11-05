const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const categoryController = require('../controllers/categories')


router.post('/add', categoryController.createNewCategory)
router.post('/remove/:id', categoryController.deleteCategory)
router.get('/list', categoryController.listCategory)
router.patch('/update/:id', categoryController.updateCategory)
router.get('/:id', categoryController.getByIdCategory)

module.exports = router