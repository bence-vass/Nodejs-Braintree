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
        res.status(201).json({
            message: 'Product created',
            product: product
        })
    }).catch(error => {
        res.status(502).json({
            message: 'save error',
            error: error
        })
    })

}

exports.listProduct = async (req, res, next) => {
    try {
        const productQuery = await Product.find({}).populate('category').exec()
        /*
        const productList = productQuery.map((e, i) => {
            return {
                id: e.id,
                name: e.name,
                description: e.description,
                price: e.price,
                category: e.category ? e.category.name : 'Unknown'
            }
        })
        */
        res.status(201).json(productQuery)
    } catch (error) {
        console.log(error)
        res.status(501).json({
            error: 'Invalid query'
        })

    }

}

exports.deleteProduct = async (req, res, next) => {
    const docId = req.params.id
    try {
        const response = await Product.deleteOne({_id: docId})
        res.status(201).json({
            response: response
        })
    } catch (error) {
        res.status(501).json({
            error: error,
            message: 'invalid id'
        })
    }
}


exports.getByIdProduct = async (req, res, next) => {
    const docId = req.params.id
    try {
        const doc = await Product.findById(docId).populate('category').exec()
        res.status(200).json(doc)
    } catch (error) {
        res.status(501).json({
            error: error,
            message: 'invalid id'
        })
    }

}

exports.updateProduct = async (req, res, next) => {
    const docId = req.params.id
    const newName = req.body.name
    const newCategory = req.body.category
    const newDescription = req.body.description
    const newPrice = req.body.price
    Product.findByIdAndUpdate(docId, {
        name: newName,
        category: newCategory,
        description: newDescription,
        price: newPrice
    }, { new: true, omitUndefined: true },(error, result) => {
        if(error){
            res.status(501).json({
                error: error,
                message: 'update error'
            })
        } else {
            res.status(200).json({
                response: result
            })
        }
    })
}