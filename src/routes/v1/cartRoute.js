import express from 'express'
import checkAuth from '../../middlewares/auth.js'
import cartController from '../../controllers/cartController.js'


const router = express.Router()

router.post('/add-to-cart',checkAuth,cartController.AddToCart)
router.get('/',checkAuth,cartController.GetCartByUserId)

export default router