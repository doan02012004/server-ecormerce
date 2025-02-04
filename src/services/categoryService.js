import CategoryModel from "../models/categoryModel.js"
import ApiError from "../utils/ApiError.js"
import { StatusCodes } from "http-status-codes"
import slugify from "../utils/slug.js"
import { buildCategoryTree } from "../utils/category.js"
import Pagination from "../utils/paginate.js"

const categoryCreate = async (category) => {
    const data = {
        ...category,
        display_name: category.display_name == '' ? category.name : category.display_name,
        slug: slugify(category.name)
    }
    const newCategory = await CategoryModel.create(data)
    if (!newCategory) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Tạo danh mục không thành công')
    }
    return newCategory
}

const categoryGet = async (queryRequest) => {
    const { page, limit, slug } = queryRequest
    const { _limit, _page, _skip } = Pagination({ page, limit })

    // query match
    let query = {
        parent_id: null
    }

    if (slug) {
        const category = await CategoryModel.findOne({ slug })
        query['parent_id'] = category?._id ?? null
    }

    // query aggregate
    let aggregateQuery = [{
        $match: query
    },
    {
        $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "parent_id",
            as: "children"
        }
    },
    {
        $addFields: {
            children_count: { $size: "$children" } // Đếm số danh mục con
        }
    },
    {
        $project: {
            children: 0 // Không lấy mảng children để giảm dữ liệu trả về
        }
    },
    {
        $skip: _skip
    },
    {
        $limit: _limit
    }]


    const categories = await CategoryModel.aggregate(aggregateQuery);
    const totalQuery = await CategoryModel.countDocuments(query)

    return {
        data: categories,
        paginate: {
            total: Math.ceil(totalQuery / _limit),
            current_page: _page,
        }
    }
}

const categoriesGetFormAdmin = async () => {
    const categories = await CategoryModel.find({}).exec()
    const categoryTree = await buildCategoryTree(categories);
    return categoryTree
}

const categoryGetById = async (id) => {
    const category = await CategoryModel.findById(id)
    if (!category) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Not found')
    }
    return category
}

const categoryGetBySlug = async (slug) => {
    const category = await CategoryModel.findOne({ slug })
    if (!category) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Not found')
    }
    return category
}

const categoriesPath = async (slug) => {
    const categories_path = await CategoryModel.aggregate([
        {
            $match: {
                slug: slug
            }
        },
        {
            $graphLookup: {
                from: 'categories',
                startWith: '$parent_id',
                connectFromField: 'parent_id',
                connectToField: '_id',
                as: 'parent'
            }
        }
    ])

    if (categories_path.length == 0) return categories_path

    const newCate_path = [
        ...categories_path[0].parent.reverse(),
        {
            ...categories_path[0],
            parent: undefined
        }
    ]
    return newCate_path
}

const categoryUpdate = async (id,data) => {
    const category = await CategoryModel.findByIdAndUpdate(id,{
        name:data.name,
        display_name:data.display_name,
        url_thumbnail:data.url_thumbnail,
        url_path:data.url_path,
    })

    if(!category)  throw new ApiError(StatusCodes.NOT_FOUND, 'Not found') 

    return {
        message:'Cập nhật danh mục thành công'
    }
}

const categoryDelete = async (id) => {
    const category = await CategoryModel.findByIdAndDelete(id)

    if(!category)  throw new ApiError(StatusCodes.NOT_FOUND, 'Not found') 

    return {
        message:'Xóa danh mục thành công'
    }
}

export default {
    categoryCreate,
    categoryGet,
    categoryGetById,
    categoriesGetFormAdmin,
    categoriesPath,
    categoryGetBySlug,
    categoryUpdate,
    categoryDelete
}