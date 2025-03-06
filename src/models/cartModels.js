import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    coupon_code: {
        type: String,
        default: null
    },
    ship_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ships',
        default: null
    },
    payment_method: {
        type: String,
        enum: ['cash', 'vnpay'],
        default: "cash"
    },
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addresses',
        default: null
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true, versionKey: false
})

const CartModel = mongoose.model('carts', cartSchema)

export default CartModel