import mongoose from "mongoose"



const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:''
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    type:{
        type:String,
        required:true,
        enum:['simple','configurable'],
        default:'simple'
    },
    images:[
        {
           url:{
            type:String,
            required:true
           }
        }
    ],
    status:{
        type:Boolean,
        default:true
    },
    // volume:{
    //     type:Number,
    //     default:0
    // },
    // height:{
    //     type:Number,
    //     required:true,
    //     default:0
    // },
    // width:{
    //     type:Number,
    //     required:true,
    //     default:0
    // },
    // length:{
    //     type:Number,
    //     required:true,
    //     default:0
    // },
    sold:{
        type:Number,
        default:0
    },
    rate:{
        type:Number,
        default:3
    },
    weight:{
        type:Number,
        default:0
    },
    categories:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'categories'
        }
    ]
}, {
    timestamps:true, versionKey:false
})

const ProductModel = mongoose.model('products',productSchema)

export default ProductModel