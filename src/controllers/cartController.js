import { StatusCodes } from "http-status-codes"
import cartValidate from "../validations/cartValidate.js";
import ApiError from "../utils/ApiError.js";
import cartService from "../services/cartService.js";


const AddToCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Not Found')
        }
        const resultValidate = cartValidate.RequestBodyAddToCart.validate(req.body, { abortEarly: true })
        if (resultValidate?.error) {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, resultValidate?.error.details[0].message)
        }

        const { product_id, variant_id, quantity } = resultValidate.value

        await cartService.AddToCart(product_id, variant_id, quantity, user._id)

        return res.status(StatusCodes.CREATED).json({
            statusCode:201,
            message: 'Thêm giỏ hàng thành công',
            success: true
        })
    } catch (error) {
        next(error)
    }
}

const GetCartByUserId = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Not Found')
        }
        const cart = await cartService.GetCartByUserId(user._id)
        return res.status(StatusCodes.OK).json(cart)
    } catch (error) {
        next(error)
    }
}


const IncreaseQuantityCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Not Found')
        }
        const {cartItem_id} = req.body

        const result = await cartService.IncreaseQuantityCart(cartItem_id)

        return res.status(StatusCodes.OK).json({
            statusCode:201,
            ...result
        })
    } catch (error) {
        next(error)
    }
}

const DecreaseQuantityCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Not Found')
        }
        const {cartItem_id} = req.body

        const result = await cartService.DecreaseQuantityCart(cartItem_id)

        return res.status(StatusCodes.OK).json({
            statusCode:201,
            ...result
        })

    } catch (error) {
        next(error)
    }
}

const UpdateQuantityCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Not Found')
        }
        const {cartItem_id,quantity} = req.body

        const result = await cartService.UpdateQuantityCart(cartItem_id,quantity)

         return res.status(StatusCodes.OK).json({
            statusCode:201,
            ...result
        })

    } catch (error) {
        next(error)
    }
}

const DeleteCartItem = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Not Found')
        }
        const {cartItem_id} = req.body
        const result = await cartService.DeleteCartItem(cartItem_id)

         return res.status(StatusCodes.OK).json({
            statusCode:201,
            ...result
        })

    } catch (error) {
        next(error)
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