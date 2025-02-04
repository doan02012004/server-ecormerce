import Joi from 'joi'

const categoryValidate = Joi.object({
    name: Joi.string().trim().required(),
    slug: Joi.string().trim().required(),
    status: Joi.boolean(),
    type: Joi.number(),
    url_thumbnail:Joi.string(),
    url_path: Joi.string(),
    parent_id:Joi.string(),
    children: Joi.array(),
})

export default {
    categoryValidate
}