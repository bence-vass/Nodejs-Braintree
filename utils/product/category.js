const {ProductCategory: Category} = require('../../models/Product')

exports.findCategoryParent = async id => {
    try {
        return await Category.findById(id).exec()
    } catch (e) {
        throw e
    }
}

exports.createNewCategory = async (display, slug = null, parentID = null) => {
    try {
        let data = {
            display: display
        }
        if (parentID) {
            let parent = await exports.findCategoryParent(parentID)
            data.parent = parent.id
            data.level = parent.level + 1
        }
        slug ? data.slug = slug : data.slug = display
        let newCategory = new Category(data)
        await newCategory.save()
        return newCategory
    } catch (e) {
        throw  e
    }
}

exports.navbarCategoryList = async () => {

    function createTree(data, root) {
        let r = [], o = {}
        data.forEach(item => {
            item.children = o[item._id] && o[item._id].children
            o[item._id] = item
            if (!item.parent || item.parent === root) {
                r.push(item)
            } else {
                o[item.parent] = o[item.parent] || {}
                o[item.parent].children = o[item.parent].children || []
                o[item.parent].children.push(item)
            }
        })
        return r
    }

    try {
        let allCategories = await Category.find({}).lean().exec()
        return createTree(allCategories, null)
    } catch (e) {
        throw e
    }
}