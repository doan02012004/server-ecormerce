import mongoose from "mongoose";
import ProductModel from "../models/productModel.js";
import ProductOptionModel from "../models/productOptionModel.js";
import ProductVariantModel from "../models/productVariantModel.js";
import slugify from "../utils/slug.js";
import { calculateDiscount, calculateVolume } from "../utils/main.js";


const CreateProduct = async (data) => {
    const session = await mongoose.startSession(); // Bắt đầu session
    session.startTransaction(); // Bắt đầu transaction

    // insert product infor
    const newInfor = {
        ...data,
        slug: slugify(data.name),
        categories: data?.categories?.map((item) => item._id),
        volume: calculateVolume(data.height, data.width, data.length)
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
            discount: calculateDiscount(variant.original_price,variant.price),
            weight: product.weight,
            volume: product.volume,
            height: product.height,
            width: product.width,
            length: product.length,
            product_id: product._id
        })
    }
    // Hoàn tất transaction
    await session.commitTransaction();
    session.endSession();

    return {
        message: 'Tạo sản phẩm mới thành công'
    }
}


export default {
    CreateProduct
}