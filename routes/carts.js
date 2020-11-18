const express = require('express');
const router = express.Router();

const cartController = require('../controllers/carts')

router.post('/add', cartController.createNewCart)
router.get('/list', cartController.listCart)
router.patch('/update/:cartID/add/:productID', cartController.updateCartAdd)
router.patch('/update/:cartID/remove/:productID', cartController.updateCartRemove)
router.get('/:id', cartController.getByIdCart)

module.exports = router