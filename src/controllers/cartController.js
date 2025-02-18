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


export default {
    AddToCart,
    GetCartByUserId
}