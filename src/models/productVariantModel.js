import mongoose from "mongoose"


const productVariantSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    name: {
        type: String,
        default: ''
    },
    tiers_index: [
        {
            type: Number
        }
    ],
    price: {
        type: Number,
        default: 0
    },
    original_price: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    sku: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
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
    sold:{
        type: Number,
        default: 0
    },
    weight: {
        type: Number,
        required: true,
        default: 0
    },
    is_default:{
        type:Boolean,
        default:false
    },
    deleted_at:{
        type:Number,
        default:null
    }
}, {
    timestamps: true, versionKey: false
})

// productVariantSchema.pre('save', function(next) {
//     if (!this.created) this.created = new Date;
//     next();
//   });

const ProductVariantModel = mongoose.model('variants', productVariantSchema)

export default ProductVariantModel