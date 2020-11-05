const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true, unique: true,},
}, {
    timestamps: true
})

categorySchema.post('save', (error, res, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        next({
            error,
            message: 'slug must be unique'
        });
    } else {
        next(error);
    }
})


module.exports = mongoose.model('Category', categorySchema)