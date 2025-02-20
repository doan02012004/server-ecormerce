import express from 'express'
import checkAuth from '../../middlewares/auth.js'
import cartController from '../../controllers/cartController.js'


const router = express.Router()

router.get('/',checkAuth,cartController.GetCartByUserId)
router.post('/add-to-cart',checkAuth,cartController.AddToCart)
router.post('/increase',checkAuth,cartController.IncreaseQuantityCart)
router.post('/decrease',checkAuth,cartController.DecreaseQuantityCart)
router.post('/update-qty',checkAuth,cartController.UpdateQuantityCart)
router.post('/delete',checkAuth,cartController.DeleteCartItem)

export default router