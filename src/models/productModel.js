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
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories"
    }

}, {
    timestamps:true, versionKey:false
})

const ProductModel = mongoose.model('products',productSchema)

export default ProductModel