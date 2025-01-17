import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/ApiError.js"
import { uploadFileService } from "../services/uploadService.js"

 
export const uploadFile = async(req , res,next) => {
    try {
        if(!req.file){
            throw new ApiError(StatusCodes.NOT_FOUND, 'không có file')
        }
        const result = await uploadFileService(req.file)
        return res.status(StatusCodes.OK).json(result)
    } catch (error) {
       next(error)
    }
}