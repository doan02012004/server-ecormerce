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
    code:{
        type:String,
      default:null
   },
    categories:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'categories'
        }
    ],
    slug:{
        type:String,
        required:true,
        unique:true
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
    rate:{
        type:Number,
        default:3
    },
    ship: {
        height: {
            type: Number,
            required: true,
            default: 0
        },
        width: {
            type: Number,
            required: true,
            default: 0
        },
        length: {
            type: Number,
            required: true,
            default: 0
        },
    },
    weight:{
        type:Number,
        default:0
    },
    sku:{
        type:String,
        default:''
   },
    delete_at:{
        type:Number,
        default:null
    }
}, {
    timestamps:true, versionKey:false
})

const ProductModel = mongoose.model('products',productSchema)

export default ProductModel