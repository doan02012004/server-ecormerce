import { StatusCodes }  from "http-status-codes"
import productService from "../services/productService.js"
import ApiError from "../utils/ApiError.js"



 const createProduct = async(req,res,next) =>{
    try {
        const data = req.body
        const result = await productService.CreateProduct(data)
        return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
        next(error)
    }
}
const GetAllProductQuickView = async(req,res,next) =>{
    try {
        const result = await productService.GetAllProductQuickView(req.query)
        return res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

const GetProductAdminBySlug = async(req,res,next) =>{
    try {
        const {slug} = req.params
        const result = await productService.GetProductAdminBySlug(slug)
        return res.status(StatusCodes.OK).json(result)
    } catch (error) {
        next(error)
    }
}

const UpdateProduct = async (req,res,next) =>{
    try {
        const {id} = req.params
        if(!id) {
            throw new ApiError()
        }
        const result = await productService.UpdateProduct(req.body)
        return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
        next(error)
    }
}

const GetProductBySlug = async(req,res,next) =>{
    try {
        const {slug} = req.params
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