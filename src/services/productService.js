
import ProductModel from "../models/productModel.js";
import ProductOptionModel from "../models/productOptionModel.js";
import ProductVariantModel from "../models/productVariantModel.js";
import slugify from "../utils/slug.js";
import { calculateDiscount, getLinkProductByTypeView, getModelProductByPriceMin } from "../utils/main.js";
import { cloneDeep } from "../utils/lodash.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";




const CreateProduct = async (data) => {


    // insert product infor
    const newInfor = {
        ...data,
        slug: slugify(data.name),
        categories: data?.categories?.map((item) => item._id),
    }
    const product = await ProductModel.create(newInfor)

    if (data.options.length > 0) {
        // insert product options
        for (let i = 0; i < data.options.length; i++) {
            await ProductOptionModel.create({
                ...data.options[i],
                option_index: i,
                product_id: product._id
            })
        }
    }

    // insert product variants
    for (const variant of data.models) {
        await ProductVariantModel.create({
            ...variant,
            image: variant?.image == '' ? data.images[0].url : variant?.image,
            discount: calculateDiscount(variant.original_price, variant.price),
            weight: product.weight,
            product_id: product._id,
            ship: data.ship
        })
    }
    

    return {
        message: 'Tạo sản phẩm mới thành công'
    }
}

const GetAllProductQuickView = async (queryRequest) => {
    const { type_view, page, limit, } = queryRequest
    const _page = page ?? 1;
    const _limit = limit ?? 5;
    const _skip = _limit * (_page - 1)
    const products = await ProductModel.aggregate([
        {
            $match: {

            }
        },
        {
            $lookup: {
                from: 'variants',
                localField: '_id',
                foreignField: 'product_id',
                as: 'models'
            }
        },
        { $skip: _skip },
        { $limit: Number(_limit) },
    ])

    const totalCountProducts = await ProductModel.countDocuments();

    const reProducts = cloneDeep(products)

    const newProducts = reProducts.map((item) => {
        const model = getModelProductByPriceMin(item.models)
        return {
            ...item,
            rate: 5,
            price: model?.price ?? 0,
            original_price: model?.original_price ?? 0,
            discount: model?.discount ?? 0,
            infor_sold: {
                qty: 0,
                text: 'Đã bán 0'
            },
            models: undefined,
            categories: undefined,
            url_path: getLinkProductByTypeView(type_view, item.slug)
        }
    })
    return {
        data: newProducts,
        paginate: {
            totalPage: Math.ceil(totalCountProducts / _limit),
            currentPage: _page
        }
    }
}

const GetProductAdminBySlug = async (slug) => {
    const product_infor = await ProductModel.findOne({ slug }).populate('categories')
    if (!product_infor) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Not found')
    }
    const productOptions = await ProductOptionModel.find({product_id:product_infor._id})

    let models = []
    if (productOptions.length == 0) {
        const defaultVariant = await ProductVariantModel.findOne({product_id:product_infor._id,is_default:true})
        models.push(defaultVariant.toObject())
    }else{
        models = await ProductVariantModel.find({product_id:product_infor._id,is_default:false,deleted_at:null})
    }
    const reProduct_infor = cloneDeep(product_infor).toObject()

    return {
        ...reProduct_infor,
        models:models,
        options:productOptions
    }

}


const UpdateProduct = async (data) => {

    const newInfor = {
        ...data,
        slug: slugify(data.name),
        categories: data?.categories?.map((item) => item._id),
    }
    const product = await ProductModel.findByIdAndUpdate(data._id, newInfor)

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Not found')
    }

    //update options
    const productOptions = await ProductOptionModel.find({ product_id: product._id })
    for (const option of productOptions) {
        const reOption = option.toObject()
        const findIndex = data.options.findIndex(op => op?._id == reOption._id.toString())
        if (findIndex >= 0) {
            await ProductOptionModel.findByIdAndUpdate({ _id: option._id }, data.options[findIndex])
        } else {
            await ProductOptionModel.findByIdAndDelete(reOption._id)
        }
    }
    for (const option of data.options) {
        if (!option._id && !option.product_id) {
            await ProductOptionModel.create({ ...option, product_id: product._id })
        }
    }


    // update variants
    const productVariants = await ProductVariantModel.find({ product_id: product._id,is_default:false, deleted_at: null })
    for (const variant of productVariants) {
        const reVariant = variant.toObject()
        const findIndex = data.models.findIndex((model) => model?._id == reVariant._id.toString())
        if (findIndex >= 0) {
            await ProductVariantModel.findByIdAndUpdate({ _id: reVariant._id }, data.models[findIndex])
        } else {
            const time = new Date()
            const number = time.getTime()
            await ProductVariantModel.findByIdAndUpdate({ _id: reVariant._id }, { deleted_at: number })
        }
    }

    for (const model of data.models) {
        if (!model._id && !model.product_id) {
            await ProductVariantModel.create({ ...model, product_id: product._id })
        }
    }

    return {
        message: 'Cập nhật sản phẩm thành công'
    }
}

const GetProductBySlug = async (slug) => {
    const product_infor = await ProductModel.findOne({ slug }).populate('categories')
    if (!product_infor) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Not found')
    }
    const productOptions = await ProductOptionModel.find({product_id:product_infor._id})

    let models = []
    if (productOptions.length == 0) {
        const defaultVariant = await ProductVariantModel.findOne({product_id:product_infor._id,is_default:true})
        models.push(defaultVariant.toObject())
    }else{
        models = await ProductVariantModel.find({product_id:product_infor._id,is_default:false,deleted_at:null})
    }
    const reProduct_infor = cloneDeep(product_infor).toObject()
    let minModel = null
    for (const model of models) {
        if (!minModel) {
            minModel = model
        } else {
            if (model.price < minModel.price) {
                minModel = model
            }
        }
    }

    return {
        ...reProduct_infor,
        price: minModel?.price ?? 0,
        original_price: minModel?.original_price ?? 0,
        discount: minModel?.discount ?? 0,
        models:models,
        options:productOptions
    }

}

export default {
    CreateProduct,
    GetAllProductQuickView,
    GetProductAdminBySlug,
    UpdateProduct,
    GetProductBySlug
}