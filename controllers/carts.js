const Cart = require('../models/Cart')

exports.createNewCart = (req, res, next) => {
    const userId = req.body.userId
    const items = req.body.items
    const cart = new Cart({
        userId: userId,
        items: items
    })
    cart.save().then(response => {
        res.status(201).json({
            message: 'Cart created',
            cart: cart
        })
    }).catch(error => {

    })

}

exports.listCart = async (req, res, next) => {
    const cartQuery = await Cart.find({})
        //.populate('items.product')
        .populate({
            path: 'items.product',
            populate: {
                path: 'category',
                model: 'Category'
            }
        })
        .exec()
    const cartList = cartQuery
    res.status(201).json({
        cartList
    })
}