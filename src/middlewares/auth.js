import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/ApiError.js"
import jwt from 'jsonwebtoken'
import { env } from "../config/environment.js"

 const checkAuth = async(req,res,next) => {
    try {
        const authorization = req.headers.authorization ?? ''
        const token = authorization.split(' ')[1]
        if(!token){
            throw new ApiError(StatusCodes.UNAUTHORIZED,"Lỗi xác thực")
        }
         jwt.verify(token,env.TOKEN_SECRET, (err,decode) => {
            if(err){
                throw new ApiError(StatusCodes.UNAUTHORIZED,"Lỗi xác thực")
            }
            req.user = decode
         })
        next()
    } catch (error) {
        next(error)
    }
}

export default checkAuth