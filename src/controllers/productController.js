import { StatusCodes }  from "http-status-codes"



export const createProduct = async(req,res,next) =>{
    try {
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