import { StatusCodes } from "http-status-codes"
import CartItemModel from "../models/cartItemModels.js"
import CartModel from "../models/cartModels.js"
import ApiError from "../utils/ApiError.js"


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
        }else{
            const newCartItem = new CartItemModel({
                cart_id:existCart._id,
                product_id:product_id,
                variant_id:variant_id,
                quantity:quantity
            })

            await newCartItem.save()
        }
    }
}

const GetCartByUserId = async(user_id) => {

    const cart = await CartModel.findOne({user_id})
    if(cart.length == 0){
        throw new ApiError(StatusCodes.NOT_FOUND,'Giỏ hàng không tồn tại')
    }
    const items = await CartItemModel.find({cart_id:cart._id}).populate('product_id variant_id')
    
    const newItems = items.map((item) => {
        const reItem = item.toObject()
        const total = reItem.variant_id? Number(reItem.variant_id.price * reItem.quantity): 0
        return {
            ...reItem,
            total:total
        }
    })
    let calculateToTalCarts = 0 
    if(newItems.length>0){
        calculateToTalCarts = newItems.reduce((sum, item) => item.total + sum , 0)
    } 
    return {
        ...cart.toObject(),
        items:newItems,
        total:calculateToTalCarts
    }
}

export default {
    AddToCart,
    GetCartByUserId
}