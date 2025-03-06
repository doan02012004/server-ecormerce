import { StatusCodes } from "http-status-codes"
import CouponModel from "../models/couponModel.js"
import ApiError from "../utils/ApiError.js"
import UserCouponModel from "../models/useCouponModel.js"


const createCoupon = async (dataForm) => {
    const existCoupon = await CouponModel.findOne({code:dataForm.code})
    if(existCoupon){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Mã code này đã tồn tại')
    }
    const newCoupon = await CouponModel.create(dataForm)
    if(!newCoupon){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Tạo phiếu giảm giá thất bại')
    }

    return {
        message:'Tạo phiếu giảm giá thành công'
    }
}

const saveCouponByUser = async(user_id,coupon_id) => {
    const existCoupon = await CouponModel.findById(coupon_id)
    if(!existCoupon){
        throw new ApiError(StatusCodes.NOT_FOUND,'Phiếu giảm giá không tồn tại')
    }
    const reCoupon = existCoupon.toObject()
    const convertEndDate = new Date(reCoupon.end_date).getTime()
    const now = Date.now()
    if(convertEndDate< now ){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Phiếu giảm giá đã hết hạn')
    }
    if(reCoupon.quantity == 0){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Phiếu giảm giá đã hết lượt dùng')
    }

    const existSaveCoupon = await UserCouponModel.findOne({user_id,coupon_id})
    if(existSaveCoupon){
        return {
            message:'Mã giảm giá đã tồn tại trong kho của bạn'
        }
    }
    
    const newSaveUserCoupon = new UserCouponModel({
        user_id,
        coupon_id,
        used_at:null
    })

    await newSaveUserCoupon.save()
    existCoupon.quantity -=1
    await existCoupon.save()
    
    return {
        message:'Lưu mã giảm giá thành công !'
    }
}

const getAllCouponAdmin = async ()=> {
    const now = Date.now()
    const coupons = await CouponModel.find({
        end_date:{$gte:now},
        is_delete:false,
        is_public:true
    }).sort({createdAt:-1})
    return coupons
} 

const getAllCouponByUserId = async (user_id)=> {
    const coupons = await UserCouponModel.find({user_id}).populate('coupon_id')
    if(coupons.length == 0){
        return []
    }
    const newCoupons = coupons.map((item) => {
        const reItem = item.toObject()
        return {
            ...reItem.coupon_id,
            used_at:reItem.used_at
        }
    })
    return newCoupons
} 

const getCouponByCode = async (code) => {
    const coupon = await CouponModel.findOne({code:code})
    if(!coupon) throw new ApiError(StatusCodes.NOT_FOUND,'Phiếu giảm giá không tồn tại')
    
    return coupon
}

const updateCoupon = async (dataForm) => {
    const newCoupon = await CouponModel.findOneAndUpdate({code:dataForm.code},{
        ...dataForm
    })
    if(!newCoupon){
        throw new ApiError(StatusCodes.BAD_REQUEST,'Cập nhật phiếu giảm giá thất bại')
    }

    return {
        message:'Cập nhật phiếu giảm giá thành công'
    }
}

export default {
    createCoupon,
    saveCouponByUser,
    getAllCouponAdmin,
    getAllCouponByUserId,
    getCouponByCode,
    updateCoupon
}