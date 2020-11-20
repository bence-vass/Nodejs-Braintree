const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: String,
    items: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        quantity: Number,

    }],
})

module.exports = mongoose.model('Cart', cartSchema)