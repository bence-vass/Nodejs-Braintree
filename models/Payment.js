const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    userID: String,
    orderID: {type: mongoose.Schema.Types.ObjectId, ref: 'Order'},
    gateway: {type: String, },
    clientToken: String
}, { timestamp: true })

module.exports = mongoose.model('Payment', paymentSchema)