import mongoose from "mongoose"

const combinationItem = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    value:{
        type:String,
        required:true
    }
})
const productVariantSchema = new mongoose.Schema({
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products"
    },
    name:{
        type:String,
        required:true
    },
    combinations:[combinationItem],
    price:{
        type:Number,
        default:0
    },
    original_price:{
        type:Number,
        default:0
    },
    discount:{
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
    height:{
        type:Number,
        required:true,
        default:0
    },
    width:{
        type:Number,
        required:true,
        default:0
    },
    length:{
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

// productVariantSchema.pre('save', function(next) {
//     if (!this.created) this.created = new Date;
//     next();
//   });

const ProductVariantModel = mongoose.model('variants',productVariantSchema)

export default ProductVariantModel