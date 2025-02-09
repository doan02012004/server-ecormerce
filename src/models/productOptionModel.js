import mongoose from "mongoose"

const valuesOptionsShema = new mongoose.Schema({
    label:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:null
    }
}, {
    timestamps:true, versionKey:false
})

const productOptionSchema = new mongoose.Schema({
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products"
    },
    name:{
        type:String,
        required:true
    },
    is_show_image:{
        type:Boolean,
        required:true,
        default:false
    },
    values:[valuesOptionsShema]

}, {
    timestamps:true, versionKey:false
})

const ProductOptionModel = mongoose.model('options',productOptionSchema)

export default ProductOptionModel