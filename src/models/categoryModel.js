import mongoose from "mongoose"


const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:Boolean,
        default:false
    }
}, {
    timestamps:true, versionKey:false
})

const CategoryModel = mongoose.model('categories',categorySchema)

export default CategoryModel