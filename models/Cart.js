const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    userId: String,
    items: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        quantity: Number,

    }],
    expireAt: {
        type: Date,
        default: function() {
            if(this.userId){
                return null
            } else {
                // 60 seconds from now  === 60000
                return new Date(new Date().valueOf() + 36000000);
            }
        }
    }
}, { timestamps: true })
cartSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Cart', cartSchema)