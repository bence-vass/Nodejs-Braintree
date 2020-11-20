const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: String,
    cart: {type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true},
    address: String,
    amount: {type: Number, required: true},
    currency: {type: String, uppercase: true, minlength: 3, maxlength: 3, default: 'HUF'},
}, {timestamp: true})

module.exports = mongoose.model('Order', orderSchema)