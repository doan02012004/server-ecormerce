import { StatusCodes }  from "http-status-codes"



export const createProduct = async(req,res,next) =>{
    try {
        const {product_infor,product_options,product_variants} = req.body
        // throw new ApiError(StatusCodes.BAD_REQUEST,'error')
        return res.status(StatusCodes.CREATED).json({
            message:'CREATE SUCCSS'
        })
    } catch (error) {
        // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //     message:error.message
        // })
        next(error)
    }
}