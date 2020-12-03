const mongoose = require('mongoose')

const productAttributeSchema = mongoose.Schema({
    display: {type: String, required: true},
    slug: {
        type: String, default: () => {
            return this.display
        },
        unique: true
    }
})

const productAttributeValueSchema = mongoose.Schema({
    attribute: {type: mongoose.Schema.Types.ObjectId, ref: 'ProductAttribute', required: true},
    display: {type: String, required: true},
    slug: {
        type: String, default: () => {
            return this.display
        },
        unique: true
    }
})

const productClassSchema = mongoose.Schema({
    has_variants: {type: Boolean, default: true},
    is_physical: {type: Boolean, default: true},
    display: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
})

const productCategorySchema = mongoose.Schema({
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'productCategory'},
    display: {type: String, required: true},
    slug: {
        type: String,
        default: () => {
            console.log(this.display)
            return this.display
        },

    },
    description: {type: String},
    level: {type: Number, default: 0}

})

const productSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    product_category: {type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true},
    product_class: {type: mongoose.Schema.Types.ObjectId, ref: 'ProductClass', required: true}
}, {
    timestamps: true
})

module.exports = {
    ProductAttribute: mongoose.model('ProductAttribute', productAttributeSchema),
    ProductAttributeValue: mongoose.model('ProductAttributeValue', productAttributeValueSchema),
    ProductClass: mongoose.model('ProductClass', productClassSchema),
    ProductCategory: mongoose.model('ProductCategory', productCategorySchema),
    Product: mongoose.model('Product', productSchema),

}