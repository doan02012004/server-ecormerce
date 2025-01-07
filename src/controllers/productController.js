const { StatusCodes } = require("http-status-codes")


export const createProduct = async(req,res) =>{
    try {
        return res.status(StatusCodes.CREATED).json({
            message:'CREATE SUCCSS'
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:error.message
        })
    }
}