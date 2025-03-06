import { StatusCodes } from "http-status-codes"
import couponService from "../services/couponService.js"
import ApiError from "../utils/ApiError.js"

const CreateCoupon = async(req,res,next) => {
    try {
        const result = await couponService.createCoupon(req.body)
        return res.status(StatusCodes.CREATED).json({
            ...result,
            statusCode:201
        })
    } catch (error ) {
        next(error)
    }
}

const SaveCoupon =async(req,res,next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Not Found')
        }
        const {coupon_id} = req.body
        const result = await couponService.saveCouponByUser(user._id,coupon_id)
        return res.status(StatusCodes.CREATED).json({
            ...result,
            statusCode:201
        })
    } catch (error ) {
        next(error)
    }
}

const GetAllCouponAdmin =async(req,res,next) => {
    try {
        const result = await couponService.getAllCouponAdmin()
        return res.status(StatusCodes.OK).json(result)
    } catch (error ) {
        next(error)
    }
}

const GetAllCouponByUserId =async(req,res,next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Not Found')
        }
        const result = await couponService.getAllCouponByUserId(user._id)
        return res.status(StatusCodes.OK).json(result)
    } catch (error ) {
        next(error)
    }
}
const GetCouponByCode =async(req,res,next) => {
    try {
        console.log('đã vào')
        const result = await couponService.getCouponByCode(req.params.code)
        console.log(result)
        return res.status(StatusCodes.OK).json(result)
    } catch (error ) {
        next(error)
    }
}

const UpdateCouponByCode =async(req,res,next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Not Found')
        }
        const result = await couponService.updateCoupon(req.body)
        return res.status(StatusCodes.OK).json({
            ...result,
            statusCode:200
        })
    } catch (error ) {
        next(error)
    }
}


export default {
    CreateCoupon,
    SaveCoupon,
    GetAllCouponByUserId,
    GetAllCouponAdmin,
    GetCouponByCode,
    UpdateCouponByCode
}