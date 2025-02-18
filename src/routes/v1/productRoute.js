import express from 'express'
import productController from '../../controllers/productController.js'


const router = express.Router()

router.post('/',productController.createProduct)
router.get('/quickview',productController.GetAllProductQuickView)
router.get('/admin/slug/:slug',productController.GetProductAdminBySlug)
router.get('/web/slug/:slug',productController.GetProductBySlug)
router.put('/update/:id',productController.UpdateProduct)

export default router