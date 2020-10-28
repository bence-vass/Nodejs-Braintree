const Product = require('../models/Product')

exports.createNewProduct = (req, res, next) => {
    console.log(req.body)
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
    })
    product.save().then(response => {
        console.log(response)
    }).catch(error => {
        console.log(error)
    })
    res.status(201).json({
        message: 'Product created',
        product: product
    })
}

exports.listProduct = async (req, res, next) => {
    try {
        const productQuery = await Product.find({}).populate('category').exec()
        const productList = productQuery.map((e, i) => {
            return {
                id: e.id,
                name: e.name,
                description: e.description,
                price: e.price,
                category: e.category ? e.category.name : 'Unknown'
            }
        })
        res.status(201).json(productList)
    } catch (error) {
        console.log(error)
        res.status(501).json({
            error: 'Invalid query'
        })

    }

}