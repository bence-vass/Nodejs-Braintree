const Order = require('../models/Order')
const Cart = require('../models/Cart')

exports.createNewOrder = async (req, res, next) => {
    const userID = req.body.userId
    const cart = req.body.cart
    let amount = 0
    try {

        let cartQuery = await Cart.findById(cart).populate({
            path: 'items.product',
            // populate: {
            //     path: 'category',
            //     model: 'Category'
            // }
        }).exec()
        cartQuery.items.map(e => {
            amount += Number(e.product.price) * Number(e.quantity)
        })
        let order = new Order({
            cart: cart,
            amount: amount
        })
        try {
            let response = await order.save()
            res.status(200).json({status: 'error', response: response})
        } catch (saveError) {
            res.status(200).json({status: 'error', response: saveError})
        }

    } catch (cartError) {
        res.status(200).json({status: 'error', response: cartError})
    }
}

exports.listOrder = async (req, res, next) => {

}

exports.getByIdOrder = async (req, res, next) => {

}