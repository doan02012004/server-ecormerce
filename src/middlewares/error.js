import { StatusCodes } from "http-status-codes"


export const errorHandler =  (err, req, res) =>{

    // Nếu dev không cẩn thận thiếu status code thì mặc định status code sẽ là INTERNAL_SERVER_ERROR
   if(!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

   // tạo ra 1 biến responseError 
   const responseError = {
    statusCode:err.statusCode,
    message:err.message || StatusCodes[err.statusCode],
    stack:err.stack
   }

   return res.status(responseError.statusCode).json(responseError)
}