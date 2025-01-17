import mongoose from "mongoose"


const imageSchema = new mongoose.Schema({
    public_id:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products",
        default:null
    }
}, {
    timestamps:true, versionKey:false
})

const ImageModel = mongoose.model('images',imageSchema)

export default ImageModel