import { StatusCodes } from "http-status-codes"
import categoryService from "../services/categoryService.js"

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.categoryCreate(req.body)
    return res.status(StatusCodes.CREATED).json(category)
  } catch (error) {
    next(error)
  }
}

const categoryGet = async (req, res, next) => {
  try {
    const categories = await categoryService.categoryGet(req.query)
    return res.status(StatusCodes.CREATED).json(categories)
  } catch (error) {
    next(error)
  }
}

const categoryGetById = async (req, res, next) => {
  try {
    const category = await categoryService.categoryGetById(req.params.categoryId)
    return res.status(StatusCodes.CREATED).json(category)
  } catch (error) {
    next(error)
  }
}

const categoryGetBySlug = async (req, res, next) => {
  try {
    const category = await categoryService.categoryGetBySlug(req.params.slug)
    return res.status(StatusCodes.CREATED).json(category)
  } catch (error) {
    next(error)
  }
}


const categoriesGetFormAdmin = async (req, res, next) => {
  try {
    const categories = await categoryService.categoriesGetFormAdmin()
    return res.status(StatusCodes.OK).json(categories)
  } catch (error) {
    next(error)
  }
}

const categoriesGetPath = async (req, res, next) => {
  try {
    const { slug } = req.params
    const categories = await categoryService.categoriesPath(slug)
    return res.status(StatusCodes.OK).json(categories)
  } catch (error) {
    next(error)
  }
}

const categoryUpdate = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await categoryService.categoryUpdate(id, req.body)
    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const categoryDelete = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await categoryService.categoryDelete(id)
    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export default {
  createCategory,
  categoryGet,
  categoryGetById,
  categoriesGetFormAdmin,
  categoriesGetPath,
  categoryGetBySlug,
  categoryUpdate,
  categoryDelete
}