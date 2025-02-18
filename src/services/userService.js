
import { StatusCodes } from "http-status-codes"
import bcrypt from 'bcrypt'
import ApiError from "../utils/ApiError.js"
import userValidate from "../validations/userValidate.js"
import UserModel from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import { env } from "../config/environment.js"

const register = async (user) => {
    const result = userValidate.registerValidate.validate(user, { abortEarly: true })
    if (result.error) {
        const errors = result.error.details.map((err) => err.message)
        throw new ApiError(StatusCodes.BAD_REQUEST, errors)
    }

    const checkUser = await UserModel.findOne({ email: user.email })
    if (checkUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Tài khoản đã tồn tại')
    }

    const saltOrRounds = 10
    const hashPassword = await bcrypt.hash(user.password, saltOrRounds)
    const newUser = await UserModel.create({ ...user, password: hashPassword })

    return {
        message: 'Đăng ký thành công',
        user: { ...newUser.toObject(), password: undefined }
    }

}

const login = async (account) => {
    const result = userValidate.loginValidate.validate(account, { abortEarly: true })
    if (result.error) {
        const errors = result.error.details.map((err) => err.message)
        throw new ApiError(StatusCodes.BAD_REQUEST, errors)
    }

    const checkUser = await UserModel.findOne({ email: account.email })
    if (!checkUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Tài khoản hoặc mật khẩu sai')
    }

    const checkPasword = await bcrypt.compare(account.password, checkUser.password)
    if (!checkPasword) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Tài khoản hoặc mật khẩu sai')
    }
    const reUser = checkUser.toObject()

    return { ...reUser, password: undefined }

}

const genarateAccessToken = (user) => {
    const payload = {
        _id: user._id,
        role: user.role
    }
    const token = jwt.sign(payload, env.TOKEN_SECRET, { expiresIn: env.TIME_ACCESSTOKEN })
    return token
}

const genarateRefreshToken = (user) => {
    const payload = {
        _id: user._id,
        role: user.role
    }
    const token = jwt.sign(payload, env.TOKEN_SECRET, { expiresIn: env.TIME_REFRESHTOKEN })
    return token
}

const getUserById = async (id) => {
    const checkUser = await UserModel.findById(id)
    if (!checkUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại')
    }
    const reUser = checkUser.toObject()

    return { ...reUser, password: undefined }

}

const refreshAccessToken =  (token) => {

    let newAccessToken = null
    if (!token) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Lỗi')
    }
     jwt.verify(token,env.TOKEN_SECRET, (err,decode) => {
        if(err){
            throw new ApiError(StatusCodes.NOT_FOUND, 'Lỗi')
        }
        newAccessToken = genarateAccessToken({_id:decode._id,role:decode.role})
    })
    return newAccessToken
}


export default {
    register,
    login,
    genarateAccessToken,
    genarateRefreshToken,
    getUserById,
    refreshAccessToken
}