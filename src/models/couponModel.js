import mongoose from "mongoose"

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: String,
        enum: ['ship', 'product'],
        required: true
    },
    discount_type: {
        type: String,
        enum: ['percent', 'fixed'],
        required: true
    },
    value_percent: {
        type: Number,
    },
    value_fixed: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 0
    },
    min_price: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        default: 0
    },
    start_date: {
        type: Number,
        required: true,
    },
    end_date: {
        type: Number,
        required: true,
    },
    is_public: {
        type: Boolean,
        default: true
    },
    is_delete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true, versionKey: false
})

const CouponModel = mongoose.model('coupons', couponSchema)

export default CouponModel