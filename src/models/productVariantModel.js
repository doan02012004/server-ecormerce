import mongoose from "mongoose"

const productVariantSchema = new mongoose.Schema({
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products"
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        default:0
    },
    original_price:{
        type:Number,
        default:0
    },
    stock:{
        type:Number,
        default:0
    },
    sku:{
        type:String,
        default:''
    },
    volume:{
        type:Number,
        required:true,
        default:0
    },
    weight:{
        type:Number,
        required:true,
        default:0
    },
}, {
    timestamps:true, versionKey:false
})

const ProductVariantModel = mongoose.model('variants',productVariantSchema)

export default ProductVariantModel