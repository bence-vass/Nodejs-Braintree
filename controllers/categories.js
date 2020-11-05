const Category = require('../models/Category')

exports.createNewCategory = (req, res, next) => {
    const category = new Category({
        name: req.body.name,
        slug: req.body.slug
    })
    category.save().then(response => {
        res.status(201).json({
            message: 'Product created',
            category: response
        })
    }).catch(error => {
        res.status(502).json({
            message: 'save error',
            error: error
        })
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
    const docId = req.params.id
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

exports.updateCategory = async (req, res, next) => {
    const docId = req.params.id
    const newName = req.body.name
    const newSlug = req.body.slug
    Category.findByIdAndUpdate(docId, {
        name: newName,
        slug: newSlug
    }, { new: true, omitUndefined: true },(error, result) => {
        if(error){
            res.status(501).json({
                error: error,
                message: 'update error'
            })
        } else {
            res.status(201).json({
                response: result
            })
        }
    })
}

exports.getByIdCategory = async (req, res, next) => {
    const docId = req.params.id
    try {
        const doc = await Category.findById(docId).exec()
        res.status(200).json(doc)
    } catch (error) {
        res.status(501).json({
            error: error,
            message: 'invalid id'
        })
    }
}