import { StatusCodes } from "http-status-codes"
import userService from "../services/userService.js"
import ApiError from "../utils/ApiError.js"

const register = async (req, res, next) => {
    try {
        const result = await userService.register(req.body)

        return res.status(StatusCodes.CREATED).json(result)
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const user = await userService.login(req.body)
        const accessToken = userService.genarateAccessToken(user)
        const refreshToken = userService.genarateRefreshToken(user)

        res.cookie("accessToken", accessToken, {
            httpOnly: true, // Ngăn JavaScript đọc cookies (bảo mật hơn)
            // secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS khi deploy
            // sameSite: "lax", // "lax" để hoạt động trong hầu hết trường hợp

        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // Ngăn JavaScript đọc cookies (bảo mật hơn)
            // secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS khi deploy
            // sameSite: "lax", // "lax" để hoạt động trong hầu hết trường hợp
        });
        return res.status(StatusCodes.OK).json({
            user,
            accessToken,
            refreshToken
        })
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {
        const decode = req.user
        if (!decode) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại')
        }
        const user = await userService.getUserById(decode._id)
        return res.status(StatusCodes.OK).json({
           user
        })
    } catch (error) {
        next(error)
    }
}

const refreshAccessToken = async (req, res, next) => {
    try {
        const token = req.body.refreshToken
        const accessToken =  userService.refreshAccessToken(token)
        return res.status(StatusCodes.OK).json({accessToken})
    } catch (error) {
        next(error)
    }
}

export default {
    register,
    login,
    getUser,
    refreshAccessToken
}