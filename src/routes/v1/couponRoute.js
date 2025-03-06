import express from 'express'
import checkAuth from '../../middlewares/auth.js'
import couponController from '../../controllers/couponController.js'



const router = express.Router()

router.post('/create', couponController.CreateCoupon)
router.post('/save',checkAuth,couponController.SaveCoupon)
router.get('/user',checkAuth, couponController.GetAllCouponByUserId)
router.get('/admin',couponController.GetAllCouponAdmin)
router.get('/detail/:code',couponController.GetCouponByCode)
router.put('/update/:code',checkAuth,couponController.UpdateCouponByCode)

export default router