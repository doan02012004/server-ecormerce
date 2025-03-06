import { StatusCodes } from "http-status-codes"
import CartItemModel from "../models/cartItemModels.js"
import CartModel from "../models/cartModels.js"
import ApiError from "../utils/ApiError.js"
import { env } from "../config/environment.js"
import ProductOptionModel from "../models/productOptionModel.js"
import CouponModel from "../models/couponModel.js"


const AddToCart = async (product_id, variant_id, quantity, user_id) => {
    const existCart = await CartModel.findOne({ user_id: user_id })
    if (!existCart) {
        const newCart = new CartModel({
            user_id: user_id
        })
        await newCart.save()

        const newCartItem = new CartItemModel({
            cart_id: newCart._id,
            product_id: product_id,
            variant_id: variant_id,
            quantity: quantity
        })

        await newCartItem.save()

    } else {
        const existCartItem = await CartItemModel.findOne({ product_id, variant_id }).populate('variant_id')
        if (existCartItem) {
            const reExistCartItem = existCartItem.toObject()
            if (!reExistCartItem.variant_id) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Phân loại không tồn tại')
            }

            if (Number(reExistCartItem.quantity + quantity) > Number(reExistCartItem.variant_id.stock)) {
                throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Số lượng sản phẩm đã vượt quá kho hàng')
            }

            existCartItem.quantity += quantity
            await existCartItem.save()
        } else {
            const newCartItem = new CartItemModel({
                cart_id: existCart._id,
                product_id: product_id,
                variant_id: variant_id,
                quantity: quantity
            })

            await newCartItem.save()
        }
    }
}

const GetCartByUserId = async (user_id) => {

    const cart = await CartModel.findOne({ user_id })
    if ( !cart ) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Giỏ hàng không tồn tại')
    }
    const items = await CartItemModel.find({ cart_id: cart._id }).populate('product_id variant_id')

    const newItems = []
    for(const item of items){
        const reItem = item.toObject()
        const total = reItem.variant_id ? Number(reItem.variant_id.price * reItem.quantity) : 0
        const options = await ProductOptionModel.find({product_id:reItem.product_id._id})
        newItems.push(
            {
                ...reItem,
                url_path: `${env.DOMAIN_ORIGIN}/sanpham/${reItem.product_id.slug}`,
                total: total,
                options: options.map((option) => option.toObject())
            }
        )
    }
    let calculateToTalCarts = 0
    if (newItems.length > 0) {
        calculateToTalCarts = newItems.reduce((sum, item) => item.total + sum, 0)
    }
    return {
        ...cart.toObject(),
        items: newItems,
        total: calculateToTalCarts
    }
}

const IncreaseQuantityCart = async (cartItem_id) => {
    const cartItem = await CartItemModel.findOne({ _id: cartItem_id }).populate('product_id variant_id')
    if (!cartItem) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }
    const reCartItem = cartItem.toObject()
    if (!reCartItem.product_id || !reCartItem.variant_id) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }

    if (Number(reCartItem.quantity + 1) > Number(reCartItem.variant_id.stock)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Đã đạt giới hạn sản phẩm')
    }

    cartItem.quantity += 1

    await cartItem.save()

    return {
        message: "Tăng sản phẩm thành công"
    }
}

const DecreaseQuantityCart = async (cartItem_id) => {
    const cartItem = await CartItemModel.findOne({ _id: cartItem_id }).populate('product_id variant_id')
    if (!cartItem) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }
    const reCartItem = cartItem.toObject()
    if (!reCartItem.product_id || !reCartItem.variant_id) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }

    if (Number(reCartItem.quantity - 1) == 0) {
        await CartItemModel.findByIdAndDelete(cartItem_id)
    } else {
        cartItem.quantity -= 1
        await cartItem.save()
    }


    return {
        message: "Giảm sản phẩm thành công"
    }
}

const UpdateQuantityCart = async (cartItem_id, quantity) => {
    const cartItem = await CartItemModel.findOne({ _id: cartItem_id }).populate('product_id variant_id')
    if (!cartItem) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }
    const reCartItem = cartItem.toObject()
    if (!reCartItem.product_id || !reCartItem.variant_id) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }

    if (Number(quantity) > Number(reCartItem.variant_id.stock) || Number(quantity) <= 0 || !quantity ) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Số lượng không hợp lệ')
    }

    cartItem.quantity = Number(quantity)
    await cartItem.save()

    return {
        message: "Cập nhật số lượng thành công"
    }
}

const DeleteCartItem = async (cartItem_id) => {
    const cartItem = await CartItemModel.findByIdAndDelete(cartItem_id)
    if (!cartItem) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }

    return {
        message: "Xóa sản phẩm thành công"
    }
}

const GetInfoCheckout = async (user_id) => {
    let info = []
    const cart = await CartModel.findOne({ user_id })
    if ( !cart ) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Giỏ hàng không tồn tại')
    }
    const items = await CartItemModel.find({ cart_id: cart._id }).populate('product_id variant_id')

    // get các item
    const newItems = []
    for(const item of items){
        const reItem = item.toObject()
        const total = reItem.variant_id ? Number(reItem.variant_id.price * reItem.quantity) : 0
        const options = await ProductOptionModel.find({product_id:reItem.product_id._id})
        newItems.push(
            {
                ...reItem,
                url_path: `${env.DOMAIN_ORIGIN}/sanpham/${reItem.product_id.slug}`,
                total: total,
                options: options.map((option) => option.toObject())
            }
        )
    }
    let calculateToTalCarts = 0
    if (newItems.length > 0) {
        calculateToTalCarts = newItems.reduce((sum, item) => item.total + sum, 0)
    }

    // get coupon
    let couponRespon = null
    const coupon = await CouponModel.findOne({code:cart.coupon_code})
    const nowTime = new Date()
    if(!coupon || coupon.end_date < nowTime.getTime()){
        cart.coupon_code = null
        await cart.save()
    }else{
        couponRespon = coupon.toObject()
    }
   
    // tính lại giá tiền qua 

    
    return {
        ...cart.toObject(),
        items: newItems,
        coupon:couponRespon,
        info:[],
        total: calculateToTalCarts,
        sumtotal:calculateToTalCarts
    }
}

const ApplyCoupon = async (user_id,code,totalShip,totalCart) => {
    const cart = await CartModel.findOne({ user_id })
    if ( !cart) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Giỏ hàng không tồn tại')
    }
    
    if(cart.coupon_code.toString() == code) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Mã giảm giá đã được áp dụng ')
    }

    const coupon = await CouponModel.findOne({code:code})
    if(!coupon){
        throw new ApiError(StatusCodes.NOT_FOUND, 'Mã giảm giá không tồn tại')
    }
    const nowTime = new Date()
    if( coupon.end_date < nowTime.getTime()){
        throw new ApiError(StatusCodes.NOT_FOUND, 'Mã giảm giá đã hết hạn')
    }
    
    if(totalCart >= coupon.min_price){
        cart.code = code
        await cart.save()
    }
    
}
export default {
    AddToCart,
    GetCartByUserId,
    IncreaseQuantityCart,
    DecreaseQuantityCart,
    UpdateQuantityCart,
    DeleteCartItem,
    ApplyCoupon,
    GetInfoCheckout
}