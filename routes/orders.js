const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders')

router.post('/add', orderController.createNewOrder)
router.get('/list', orderController.listOrder)
router.get('/:id', orderController.getByIdOrder)

module.exports = router