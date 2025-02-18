import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    product_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required:true
    },
    variant_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'variants',
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        default:0
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, versionKey: false
})

const CartItemModel = mongoose.model('cart_items', cartItemSchema)

export default CartItemModel