import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/ApiError.js"
import ImageModel from "../models/imageModel.js"



export const uploadFileService = async(data) =>{
    try {
        const image = {
            public_id:data?.filename,
            url:data?.path,
            name:data?.originalname,
            type:'image'
        }
        const newImage = await ImageModel.create(image)
        return newImage
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message)
    }
}