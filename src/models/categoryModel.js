import mongoose from "mongoose"


const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        trim: true
    },
    display_name:{
        type:String,
        required:true,
        trim: true,
    },
    status:{
        type:Boolean,
        default:true
    },
    url_thumbnail:{
        type:String,
        default:''
    },
    url_path:{
        type:String,
        default:''
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        default: null
    },
   
}, {
    timestamps:true, versionKey:false
})

const CategoryModel = mongoose.model('categories',categorySchema)

export default CategoryModel