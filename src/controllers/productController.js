import { StatusCodes }  from "http-status-codes"
import productService from "../services/productService.js"



export const createProduct = async(req,res,next) =>{
    try {
        const data = req.body
        const result = await productService.CreateProduct(data)
        return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
        next(error)
    }
}