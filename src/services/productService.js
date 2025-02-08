import mongoose from "mongoose";
import ProductModel from "../models/productModel";
import ProductOptionModel from "../models/productOptionModel";
import ProductVariantModel from "../models/productVariantModel";
import slugify from "../utils/slug";


const productCreate = async(info,options,variants) => {
    const session = await mongoose.startSession(); // Bắt đầu session
    session.startTransaction(); // Bắt đầu transaction
    
    // insert product infor
    const newInfor = {
        ...info,
        slug:slugify(info.name)
    }
    const product_infor = await ProductModel.create(newInfor)

    // check type product
    if(product_infor.type =='configurabel'){
        // insert product options
        for(const option of options){
            await ProductOptionModel.create({
                ...option,
                product_id:product_infor._id
            })
        }

        // insert product variants
        for(const variant of variants){
            await ProductVariantModel.create({
                ...variant,
                product_id:product_infor._id
            })
        }
    }

     // Hoàn tất transaction
     await session.commitTransaction();
     session.endSession();

    return {
        message:'Tạo sản phẩm mới thành công'
    }
}


export default {
    productCreate
}