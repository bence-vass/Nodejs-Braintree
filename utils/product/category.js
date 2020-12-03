const {ProductCategory: Category} = require('../../models/Product')

exports.findCategoryParent  = async id => {
    try{
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
        if(parentID){
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

}