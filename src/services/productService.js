import mongoose from "mongoose";
import ProductModel from "../models/productModel.js";
import ProductOptionModel from "../models/productOptionModel.js";
import ProductVariantModel from "../models/productVariantModel.js";
import slugify from "../utils/slug.js";
import { calculateDiscount, getLinkProductByTypeView, getModelProductByPriceMin } from "../utils/main.js";
import { cloneDeep, differenceArray, differenceKeyObject } from "../utils/lodash.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";



const CreateProduct = async (data) => {
    const session = await mongoose.startSession(); // Bắt đầu session
    session.startTransaction(); // Bắt đầu transaction

    // insert product infor
    const newInfor = {
        ...data,
        slug: slugify(data.name),
        categories: data?.categories?.map((item) => item._id),
        // volume: calculateVolume(data.height, data.width, data.length)
    }
    const product = await ProductModel.create(newInfor)

    // check type product
    if (product.type == 'configurable') {
        // insert product options
        for (const option of data.options) {
            await ProductOptionModel.create({
                ...option,
                product_id: product._id
            })
        }
    }

    // insert product variants
    for (const variant of data.models) {
        await ProductVariantModel.create({
            ...variant,
            image:variant?.image == ''?data.images[0].url:variant?.image ,
            discount: calculateDiscount(variant.original_price, variant.price),
            weight: product.weight,
            product_id: product._id
            // volume: product.volume,
            // height: product.height,
            // width: product.width,
            // length: product.length,
        })
    }
    // Hoàn tất transaction
    await session.commitTransaction();
    session.endSession();

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
    const product_infor = await ProductModel.findOne({slug}).populate('categories')
    if(!product_infor){
        throw new ApiError(StatusCodes.NOT_FOUND,'Not found')
    }
    const product = await ProductModel.aggregate([
        {
            $match: {
                slug: slug
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
        {
            $lookup: {
                from: 'options',
                localField: '_id',
                foreignField: 'product_id',
                as: 'options'
            }
        },
    ])

    if (product.length == 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Not found")
    }
    const reProduct_infor = cloneDeep(product_infor).toObject()
    return {
        ...product[0],
        ...reProduct_infor
    }

}


const UpdateProduct = async (data) => {
    const session = await mongoose.startSession(); // Bắt đầu session
    session.startTransaction(); // Bắt đầu transaction

    // insert product infor
    let update = {}
    const product = await ProductModel.findById(data._id)

    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Not found')
    }
    const reProduct = cloneDeep(product)

    const product_infor = {
        name: data.name,
        description: data.description,
        weight: data.weight
    }
    // check trường nào thay đổi thì update trường đó
    const valueUpdate = differenceKeyObject(product_infor, reProduct)
    update = { ...update, ...valueUpdate }

    // check images có cần cập nhật hay không
    if (data.images.length > reProduct.images.length || data.images.lenght < reProduct.images.length) {
        update['images'] = data.images
    } else {
        const imagesReProduct = reProduct.images.map((val) => {
            return { url: val.url }
        })
        const val = differenceArray(imagesReProduct, data.images)
        if (val.length > 0) {
            update['images'] = data.images
        }
    }

    // check danh mục có cần cập nhật hay không
    if (data.categories.length > reProduct.categories.lenght || data.categories.lenght < reProduct.categories.lenght) {
        const newCategoriesId = data.categories.map((cate) => cate._id)
        update['categories'] = newCategoriesId
    } else {
        const newCategoriesId = data.categories.map((cate) => cate._id)
        const newReProductCategoriesId = reProduct.categories.map((id) => id.toString())
        const val = differenceArray(newCategoriesId, newReProductCategoriesId)
        if (val.length > 0) {
            update['categories'] = newCategoriesId
        }
    }

    // nếu object update có trường cập nhật thì cập nhật
    if (Object.keys(update).length > 0) {
        const updateProductInfor = await ProductModel.findByIdAndUpdate(data._id, update)
        if (!updateProductInfor) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'update fail')
        }
    }
    // // check type product
    if (data.type !== reProduct.type) {
        if (data.type == 'simple') {
            await ProductOptionModel.deleteMany({ product_id: data._id })
            await ProductVariantModel.deleteMany({ product_id: data._id })
            const newModel = data.models[0]
            await ProductVariantModel.create({
                ...newModel,
                discount: calculateDiscount(newModel.original_price, newModel.price),
                weight: product.weight,
                product_id: product._id
                // volume: product.volume,
                // height: product.height,
                // width: product.width,
                // length: product.length,
            })
        }
        if (data.type == 'configurable') {
            // Cập nhật thêm thuộc tính
            for (const option of data.options) {
                await ProductOptionModel.create({
                    ...option,
                    product_id: data._id
                })
            }

            // Cập nhật thêm biến thể
            for (const variant of data.models) {
                await ProductVariantModel.create({
                    ...variant,
                    discount: calculateDiscount(variant.original_price, variant.price),
                    weight: product.weight,
                    product_id: product._id
                    // volume: product.volume,
                    // height: product.height,
                    // width: product.width,
                    // length: product.length,
                })
            }
        }
    }

    if (data.type == reProduct.type) {
        if (data.type == 'simple') {
            // await ProductOptionModel.deleteMany({product_id:data._id})
            // await ProductVariantModel.deleteMany({product_id:data._id})
            // const newModel = data.models[0]
            // await ProductVariantModel.create({
            //     ...newModel,
            //     discount: calculateDiscount(newModel.original_price,newModel.price),
            //     weight: product.weight,
            //     product_id: product._id
            //     // volume: product.volume,
            //     // height: product.height,
            //     // width: product.width,
            //     // length: product.length,
            // })
        }
        if (data.type == 'configurable') {
            // Cập nhật thêm thuộc tính
            let list_id_options = []
            const currentOptions = await ProductOptionModel.find({
                product_id:data._id
            })
            const reCurrentOptions = cloneDeep(currentOptions)
            const currentOptions_id = reCurrentOptions.map((ite) => ite._id)
            for (const option of data.options) {
                if (currentOptions_id.includes(option._id)) {
                    const newOption = await ProductOptionModel.findByIdAndUpdate(option._id, {
                        ...option,
                        values:option.values.map((val) => ({label:val.label,image:val.image}))
                    })
                    if (newOption) {
                        list_id_options.push(newOption._id.toString())
                    } else {
                        throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi cập nhật phân loại')
                    }
                } else {
                   
                    const newOption = await ProductOptionModel.create({
                       name:option.name,
                       is_show_image:option.is_show_image,
                       product_id:data._id,
                       values:option.values.map((val) => ({label:val.label,image:val.image}))
                    })
                    if (newOption) {
                        list_id_options.push(newOption._id.toString())
                    } else {
                        throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi tạo phân loại')
                    }
                }
            }
            await ProductOptionModel.deleteMany({
                product_id: data._id,
                _id: {
                    $nin: list_id_options
                }
            })

            // Cập nhật thêm biến thể
            let list_id_variants = []
            for (const variant of data.models) {
                if (variant?._id) {
                    const result = await ProductVariantModel.findByIdAndUpdate(variant._id, { ...variant, weight: data.weight })
                    if (result) {
                        list_id_variants.push(result._id.toString())
                    } else {
                        throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi update biến thể')
                    }
                } else {
                    const newVariant = await ProductVariantModel.create({
                        ...variant,
                        discount: calculateDiscount(variant.original_price, variant.price),
                        weight: data.weight,
                        product_id: data._id
                    })
                    if (newVariant) {
                        list_id_variants.push(newVariant._id.toString())
                    } else {
                        throw new ApiError(StatusCodes.BAD_REQUEST, 'Lỗi update biến thể')
                    }
                }
            }
            await ProductVariantModel.deleteMany({
                product_id: data._id,
                _id: {
                    $nin: list_id_variants
                }
            })
        }
    }

    // // insert product variants
    // for (const variant of data.models) {
    //     await ProductVariantModel.create({
    //         ...variant,
    //         discount: calculateDiscount(variant.original_price,variant.price),
    //         weight: product.weight,
    //         volume: product.volume,
    //         height: product.height,
    //         width: product.width,
    //         length: product.length,
    //         product_id: product._id
    //     })
    // }
    // Hoàn tất transaction
    await session.commitTransaction();
    session.endSession();

    return {
        message: 'Cập nhật sản phẩm thành công'
    }
}

const GetProductBySlug = async (slug) => {
    const product_infor = await ProductModel.findOne({slug}).populate('categories')
    if(!product_infor){
        throw new ApiError(StatusCodes.NOT_FOUND,'Not found')
    }
    const product = await ProductModel.aggregate([
        {
            $match: {
                slug: slug
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
        {
            $lookup: {
                from: 'options',
                localField: '_id',
                foreignField: 'product_id',
                as: 'options'
            }
        },
    ])

    if (product.length == 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Not found")
    }
    const reProduct_infor = cloneDeep(product_infor).toObject()
    let minModel = null
    for(const model of product[0].models){
        if(!minModel){
            minModel = model
        }else{
            if(model.price < minModel.price) {
                minModel = model
            }
        }
    }
    
    return {
        ...product[0],
        ...reProduct_infor,
        price:minModel?.price??0,
        original_price: minModel?.original_price??0,
        discount: minModel?.discount??0,
    }

}

export default {
    CreateProduct,
    GetAllProductQuickView,
    GetProductAdminBySlug,
    UpdateProduct,
    GetProductBySlug
}