import express from 'express'
import { createProduct } from '../../controllers/productController.js'

const router = express.Router()

router.get('/',createProduct)

export default router