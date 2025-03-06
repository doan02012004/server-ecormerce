import express from 'express'
import checkAuth from '../../middlewares/auth.js'
import shipController from '../../controllers/shipController.js'




const router = express.Router()

router.post('/create',checkAuth,shipController.AddShipMain)
router.post('/create/item/:ship_id',checkAuth,shipController.AddShipItem)
router.get('/admin',shipController.GetAllShipAdmin )
router.get('/admin/detail/:ship_id',checkAuth,shipController.GetShipAdminById )
router.put('/admin/update/:ship_id',checkAuth,shipController.UpdateShipAdminById )
// router.get('/admin',)
// router.get('/detail/:code')
// router.put('/update/:code',checkAuth,)

export default router