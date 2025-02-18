import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
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