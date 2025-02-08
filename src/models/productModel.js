import mongoose from "mongoose"


const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    type:{
        type:String,
        required:true,
        enum:['simple','configurabel']
    },
    images:[
        {
            type:String
        }
    ],
    status:{
        type:Boolean,
        default:true
    },
    original_price: {
        type:Number,
        default:0
    },
    price: {
        type:Number,
        default:0
    },
    stock:{
        type:Number,
        default:0
    },
    description:{
        type:String
    },
    volume:{
        type:Number,
        default:0
    },
    sku:{
        type:String,
        default:null
    },
    weight:{
        type:Number,
        default:0
    },
    category_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories"
    }
}, {
    timestamps:true, versionKey:false
})

const ProductModel = mongoose.model('products',productSchema)

export default ProductModel