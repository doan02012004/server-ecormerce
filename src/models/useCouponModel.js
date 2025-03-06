import mongoose from "mongoose"

const userCouponCSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    coupon_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupons',
        required:true
    },
    used_at:{
       type:Number,
       default:null
    },
}, {
    timestamps: true, versionKey: false
})

const UserCouponModel = mongoose.model('user_coupons', userCouponCSchema)

export default UserCouponModel