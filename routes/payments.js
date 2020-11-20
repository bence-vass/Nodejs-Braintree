const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments')

router.post('/start', paymentController.startPayment)
router.post('/single-payment', paymentController.singleUsePayment)

module.exports = router