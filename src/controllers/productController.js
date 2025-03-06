import { StatusCodes } from "http-status-codes"
import productService from "../services/productService.js"
import ApiError from "../utils/ApiError.js"
import mongoose from "mongoose";



const createProduct = async (req, res, next) => {
    const session = await mongoose.startSession(); // Bắt đầu session
    session.startTransaction(); // Bắt đầu transaction
    try {
        const data = req.body
        const result = await productService.CreateProduct(data)
        // Hoàn tất transaction
        await session.commitTransaction();
        session.endSession();
        return res.status(StatusCodes.CREATED).json(result)

    } catch (error) {
        // Hoàn tất transaction
        await session.abortTransaction();
        session.endSession();
        next(error)
    }
}
const GetAllProductQuickView = async (req, res, next) => {
    try {
        const result = await productService.GetAllProductQuickView(req.query)
        return res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

const GetProductAdminBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params
        const result = await productService.GetProductAdminBySlug(slug)
        return res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

const UpdateProduct = async (req, res, next) => {
    const session = await mongoose.startSession(); // Bắt đầu session
    session.startTransaction(); // Bắt đầu transaction
    try {
        const { id } = req.params
        if (!id) {
            throw new ApiError()
        }
        const result = await productService.UpdateProduct(req.body)
        // Hoàn tất transaction
        await session.commitTransaction();
        session.endSession();
        return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error)
    }
}

const GetProductBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params
        const result = await productService.GetProductBySlug(slug)
        return res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

export default {
    createProduct,
    GetAllProductQuickView,
    GetProductAdminBySlug,
    UpdateProduct,
    GetProductBySlug
}