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
        // .populate({
        //     path: 'items.product',
        //     populate: {
        //         path: 'category',
        //         model: 'Category'
        //     }
        // })
        .exec()
    const cartList = cartQuery
    res.status(201).json({
        cartList
    })
}

exports.updateCartAdd = async (req, res, next) => {
    const cardID = req.params.cartID
    const productID = req.params.productID
    const quantity = Number(req.query.quantity) || 1
    let index = null
    const cartQuery = await Cart.findById(cardID)
    cartQuery.items.map((e, i) => {
        if (e.product.toString() === productID) {
            index = i
        }
    })
    if (index != null) {
        cartQuery.items[index].quantity = Number(cartQuery.items[index].quantity) + quantity
    } else {
        cartQuery.items.push({
            product: productID,
            quantity: quantity
        })
    }

    try {
        let response = await cartQuery.save()
        res.status(200).json({status: 'success', response: response})
    } catch (error){
        res.status(200).json({status: 'error', response: error})
    }

}

exports.updateCartRemove = async (req, res, next) => {
    const cardID = req.params.cartID
    const productID = req.params.productID
    const quantity = Number(req.query.quantity) || 1
    let index = null
    const cartQuery = await Cart.findById(cardID)
    cartQuery.items.map((e, i) => {
        if (e.product.toString() === productID) {
            index = i
        }
    })
    if(index != null){
        let itemQty = Number(cartQuery.items[index].quantity)
        if(itemQty - quantity > 0){
            cartQuery.items[index].quantity = itemQty - quantity
        } else if(itemQty - quantity === 0){
            cartQuery.items[index].remove()
        } else {
            res.status(200).json({status: 'error', message: "Invalid quantity"})
        }
        let response = await cartQuery.save()
        res.status(200).json({status: 'success', response: response})
    } else {
        res.status(200).json({status: 'error', message: "No item with this ID in the cart"})
    }
}

exports.getByIdCart = async (req, res, next) => {
    const docId = req.params.id
    try {
        const doc = await Cart.findById(docId).populate({
            path: 'items.product',
            // populate: {
            //     path: 'category',
            //     model: 'Category'
            // }
        }).exec()
        res.status(200).json(doc)
    } catch (error) {
        res.status(501).json({
            error: error,
            message: 'invalid id'
        })
    }

}


