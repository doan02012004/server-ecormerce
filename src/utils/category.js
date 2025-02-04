export const buildCategoryTree = (categories,parent_id=null) => {
    return categories
    .filter((item) => String(item.parent_id) === String(parent_id))
    .map((item) => {
        return {
            ...item.toObject(),
            children:buildCategoryTree(categories,item._id)
        }
    })
}

export const CategoryPath = () => {

}

