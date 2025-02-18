import Joi from "joi"

const registerValidate = Joi.object({
    username:Joi.string().required(),
    email:Joi.string().email().required(),
    phone:Joi.string().required(),
    password: Joi.string().trim().min(6)
})

const loginValidate = Joi.object({
    email:Joi.string().email().required(),
    password: Joi.string().trim().min(6)
})

export default {
    registerValidate,
    loginValidate
}