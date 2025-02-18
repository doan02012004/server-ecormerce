import express from 'express'
import userController from '../../controllers/userController.js'
import checkAuth from '../../middlewares/auth.js'



const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/refresh', userController.refreshAccessToken)
router.get('/me',checkAuth, userController.getUser)

export default router