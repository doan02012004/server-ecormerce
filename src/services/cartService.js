import { StatusCodes } from "http-status-codes"
import CartItemModel from "../models/cartItemModels.js"
import CartModel from "../models/cartModels.js"
import ApiError from "../utils/ApiError.js"
import { env } from "../config/environment.js"


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
    if (cart.length == 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Giỏ hàng không tồn tại')
    }
    const items = await CartItemModel.find({ cart_id: cart._id }).populate('product_id variant_id')

    const newItems = items.map((item) => {
        const reItem = item.toObject()
        const total = reItem.variant_id ? Number(reItem.variant_id.price * reItem.quantity) : 0
        return {
            ...reItem,
            url_path: `${env.DOMAIN_ORIGIN}/sanpham/${reItem.product_id.slug}`,
            total: total
        }
    })
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

export default {
    AddToCart,
    GetCartByUserId,
    IncreaseQuantityCart,
    DecreaseQuantityCart,
    UpdateQuantityCart,
    DeleteCartItem
}