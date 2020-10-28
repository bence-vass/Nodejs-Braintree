const Category = require('../models/Category')

exports.createNewCategory = (req, res, next) => {
    console.log(req.body)
    const category = new Category({
        name: req.body.name,
    })
    category.save().then(response => {
        console.log(response)
    }).catch(error => {
        console.log(error)
    })
    res.status(201).json({
        message: 'Product created',
        category: category
    })
}

exports.listCategory = async (req, res, next) => {
    try {
        const categoryQuery = await Category.find({}).exec()
        const categoryList = categoryQuery
        res.status(201).json(categoryList)
    } catch (error) {
        console.log(error)
        res.status(501).json({
            error: 'Invalid query'
        })

    }
}