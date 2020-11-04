const express = require('express');
const router = express.Router();

const cartController = require('../controllers/carts')

router.post('/add', cartController.createNewCart)
router.get('/list', cartController.listCart)
//router.patch('/update', cartController)
//router.get('/list', categoryController.listCategory)

module.exports = router