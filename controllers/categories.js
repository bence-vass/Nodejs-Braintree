const Category = require('../models/Category')

exports.createNewCategory = (req, res, next) => {
    const category = new Category({
        name: req.body.name,
    })
    category.save().then(response => {

    }).catch(error => {

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

exports.deleteCategory = async (req, res, next) => {
    const docId = req.body.id
    try {
        const response = await Category.deleteOne({_id: docId})
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