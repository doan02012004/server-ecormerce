import Joi from "joi"

const RequestBodyAddToCart = Joi.object({
    product_id:Joi.string().required(),
    variant_id:Joi.string().required(),
    quantity:Joi.number().min(1).required()
})

export default {
    RequestBodyAddToCart
}